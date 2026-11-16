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
    if (!roomId) return
    try {
      setLoading(true)
      let roomData: Room
      try {
        const response = await roomApi.get(roomId)
        roomData = response.data
      } catch (err: any) {
        if (err?.response?.status === 404) {
          const createResp = await roomApi.create(roomId, 'javascript', '')
          roomData = createResp.data
        } else {
          throw err
        }
      }
      const finalRoom = { ...roomData, users: roomData.users || {} }
      setRoom(finalRoom)
      onRoomUpdate?.(finalRoom)
      setError(null)
    } catch (err) {
      // If fetching fails, we can still initialize local room state so the user isn't blocked
      console.error('Failed to fetch room:', err)
      const fallbackRoom: Room = {
        id: roomId,
        code: '',
        language: 'javascript',
        version: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ttlSeconds: 86400,
        userCount: 0,
        users: {},
      }
      setRoom(fallbackRoom)
      setError(null)
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
        users: { ...(prev.users || {}), [user.sessionId]: user },
      }
    })
  }, [updateRoom])

  const removeUser = useCallback((sessionId: string) => {
    updateRoom(prev => {
      if (!prev) return null
      const { [sessionId]: _, ...rest } = prev.users || {}
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