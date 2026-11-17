import { useState, useCallback, useRef, useEffect } from 'react'
import type { TypingEvent } from '../types'

export interface TypingUser {
  name: string
  timestamp: number
}

export function useTyping(
  sendTyping: (typing: boolean) => void,
  currentUserName: string
) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const localTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up stale typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setTypingUsers(prev => prev.filter(user => now - user.timestamp < 3000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle incoming typing events
  const handleTypingEvent = useCallback((event: TypingEvent) => {
    if (event.name === currentUserName) return // Ignore own typing

    if (event.typing) {
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.name !== event.name)
        return [...filtered, { name: event.name, timestamp: Date.now() }]
      })
    } else {
      setTypingUsers(prev => prev.filter(u => u.name !== event.name))
    }
  }, [currentUserName])

  // Send local typing status
  const setTyping = useCallback((typing: boolean) => {
    sendTyping(typing)

    if (localTypingTimeoutRef.current) {
      clearTimeout(localTypingTimeoutRef.current)
    }

    if (!typing) {
      localTypingTimeoutRef.current = setTimeout(() => {
        sendTyping(false)
      }, 1500)
    }
  }, [sendTyping])

  return {
    typingUsers,
    setTyping,
    handleTypingEvent,
  }
}