import { useState, useCallback, useEffect } from 'react'
import type { RoomUser, UserJoinedEvent, UserLeftEvent } from '../types'

export function usePresence(initialUsers: RoomUser[] = [], currentUserId?: string) {
  const [users, setUsers] = useState<RoomUser[]>(initialUsers)

  useEffect(() => {
    if (!initialUsers) return
    setUsers((prev) => {
      if (prev.length === initialUsers.length) {
        const isSame = prev.every(
          (u, idx) => u.sessionId === initialUsers[idx]?.sessionId && u.name === initialUsers[idx]?.name
        )
        if (isSame) return prev
      }
      return initialUsers
    })
  }, [initialUsers])

  const handleUserJoined = useCallback((event: UserJoinedEvent) => {
    setUsers((prev) => {
      if (prev.some((u) => u.sessionId === event.sessionId)) return prev
      return [...prev, event]
    })
  }, [])

  const handleUserLeft = useCallback((event: UserLeftEvent) => {
    setUsers((prev) => prev.filter((u) => u.sessionId !== event.sessionId))
  }, [])

  const setUsersFromRoom = useCallback((roomUsers: Record<string, RoomUser>) => {
    setUsers(Object.values(roomUsers))
  }, [])

  const currentUser = currentUserId
    ? users.find((u) => u.sessionId === currentUserId)
    : undefined

  const otherUsers = users.filter((u) => u.sessionId !== currentUserId)

  return {
    users,
    currentUser,
    otherUsers,
    handleUserJoined,
    handleUserLeft,
    setUsersFromRoom,
  }
}

