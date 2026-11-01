import { useState, useCallback, useEffect } from 'react'
import { roomApi } from '../services/api'
import type { Room, RoomUser, Language } from '../types'

interface UseRoomOptions {
  roomId: string
  initialRoom?: Room
  onRoomUpdate?: (room: Room) => void
}

export function useRoom({ roomId, initialRoom, onRoomUpdate }: UseRoomOptions) {
  const [room, setRoom] = useState<Room | null>(initialRoom || null)
  const [loading, setLoading] = useState(!initialRoom)
  const [error, setError] = useState<string | null>(null)

  const fetchRoom = useCallback(async () => {
    try {
      setLoading(true)
      const response = await roomApi.get(roomId)
      setRoom(response.data)
      onRoomUpdate?.(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load room')
      console.error('Failed to fetch room:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId, onRoomUpdate])

  useEffect(() => {
    if (!initialRoom) {
      fetchRoom()
    }
  }, [fetchRoom, initialRoom])

  const updateRoom = useCallback((updates: Partial<Room>) => {
    setRoom(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      onRoomUpdate?.(updated)
      return updated
    })
  }, [onRoomUpdate])

  const updateCode = useCallback((code: string, version: number) => {
    updateRoom({ code, version, updatedAt: new Date().toISOString() })
  }, [updateRoom])

  const addUser = useCallback((user: RoomUser) => {
    updateRoom(prev => {
      if (!prev) return null
      return {
        ...prev,
        users: { ...prev.users, [user.sessionId]: user },
      }
    })
  }, [updateRoom])

  const removeUser = useCallback((sessionId: string) => {
    updateRoom(prev => {
      if (!prev) return null
      const { [sessionId]: _, ...rest } = prev.users
      return { ...prev, users: rest }
    })
  }, [updateRoom])

  return {
    room,
    loading,
    error,
    fetchRoom,
    updateCode,
    addUser,
    removeUser,
  }
}