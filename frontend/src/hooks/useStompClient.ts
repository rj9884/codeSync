import { useEffect, useRef, useCallback, useState } from 'react'
import { stompService } from '../services/stomp'
import type { CodeUpdate, TypingEvent, UserJoinedEvent, UserLeftEvent, Room } from '../types'

interface UseStompClientOptions {
  roomId: string
  userName: string
  onCodeUpdate?: (update: CodeUpdate) => void
  onTyping?: (event: TypingEvent) => void
  onUserJoined?: (user: UserJoinedEvent) => void
  onUserLeft?: (event: UserLeftEvent) => void
  onRoomState?: (room: Room) => void
  onLanguageChange?: (language: string) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: string) => void
}

export function useStompClient({
  roomId,
  userName,
  onCodeUpdate,
  onTyping,
  onUserJoined,
  onUserLeft,
  onRoomState,
  onLanguageChange,
  onConnect,
  onDisconnect,
  onError,
}: UseStompClientOptions) {
  const [connected, setConnected] = useState(false)
  const callbacksRef = useRef({
    onCodeUpdate,
    onTyping,
    onUserJoined,
    onUserLeft,
    onRoomState,
    onLanguageChange,
    onConnect,
    onDisconnect,
    onError,
  })

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      onCodeUpdate,
      onTyping,
      onUserJoined,
      onUserLeft,
      onRoomState,
      onLanguageChange,
      onConnect,
      onDisconnect,
      onError,
    }
  })

  useEffect(() => {
    if (!roomId || !userName) return

    let mounted = true

    const connect = async () => {
      try {
        await stompService.connect(roomId, userName, {
          onCodeUpdate: (data) => {
            if (mounted) callbacksRef.current.onCodeUpdate?.(data)
          },
          onTyping: (data) => {
            if (mounted) callbacksRef.current.onTyping?.(data)
          },
          onUserJoined: (data) => {
            if (mounted) callbacksRef.current.onUserJoined?.(data)
          },
          onUserLeft: (data) => {
            if (mounted) callbacksRef.current.onUserLeft?.(data)
          },
          onRoomState: (data) => {
            if (mounted) callbacksRef.current.onRoomState?.(data)
          },
          onLanguageChange: (data) => {
            if (mounted) callbacksRef.current.onLanguageChange?.(data)
          },
          onConnect: () => {
            if (mounted) {
              setConnected(true)
              callbacksRef.current.onConnect?.()
            }
          },
          onDisconnect: () => {
            if (mounted) {
              setConnected(false)
              callbacksRef.current.onDisconnect?.()
            }
          },
          onError: (error) => {
            if (mounted) callbacksRef.current.onError?.(error)
          },
        })
      } catch (error) {
        if (mounted) {
          console.error('Failed to connect:', error)
          callbacksRef.current.onError?.(error instanceof Error ? error.message : 'Connection failed')
        }
      }
    }

    connect()

    return () => {
      mounted = false
      stompService.disconnect()
      setConnected(false)
    }
  }, [roomId, userName])

  const sendCodeUpdate = useCallback((code: string, version: number) => {
    stompService.sendCodeUpdate(roomId, code, version)
  }, [roomId])

  const sendTyping = useCallback((typing: boolean) => {
    stompService.sendTyping(roomId, userName, typing)
  }, [roomId, userName])

  const sendLanguage = useCallback((language: string) => {
    stompService.sendLanguage(roomId, language)
  }, [roomId])

  const requestRoomState = useCallback(() => {
    stompService.requestRoomState(roomId)
  }, [roomId])

  return {
    connected,
    sendCodeUpdate,
    sendTyping,
    sendLanguage,
    requestRoomState,
  }
}