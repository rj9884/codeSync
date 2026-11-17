import { useState, useCallback, useEffect, useRef } from 'react'
import { roomApi } from '../services/api'
import type { Room, RoomUser } from '../types'

interface UseRoomOptions {
  roomId: string
  initialRoom?: Room
  onRoomUpdate?: (room: Room) => void
}

export function useRoom({ roomId, initialRoom, onRoomUpdate }: UseRoomOptions) {
  const [room, setRoom] = useState<Room | null>(initialRoom || null)
  const [loading, setLoading] = useState(!initialRoom)
  const [error, setError] = useState<string | null>(null)

  const onRoomUpdateRef = useRef(onRoomUpdate)
  useEffect(() => {
    onRoomUpdateRef.current = onRoomUpdate
  }, [onRoomUpdate])

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
      onRoomUpdateRef.current?.(finalRoom)
      setError(null)
    } catch (err) {
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
  }, [roomId])

  useEffect(() => {
    if (!initialRoom) {
      fetchRoom()
    }
  }, [fetchRoom, initialRoom])

  // Sync language changes via effect rather than inside state setter
  useEffect(() => {
    if (room) {
      onRoomUpdateRef.current?.(room)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.language])

  const updateRoom = useCallback((updates: Partial<Room> | ((prev: Room) => Room)) => {
    setRoom((prev) => {
      if (!prev) return null
      return typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
    })
  }, [])

  const updateCode = useCallback((code: string, version: number) => {
    setRoom((prev) => {
      if (!prev) return null
      if (prev.code === code && prev.version === version) return prev
      return { ...prev, code, version, updatedAt: new Date().toISOString() }
    })
  }, [])

  const addUser = useCallback((user: RoomUser) => {
    if (!user || !user.sessionId) return
    setRoom((prev) => {
      if (!prev) return null
      const existing = prev.users || {}
      if (existing[user.sessionId] && existing[user.sessionId].name === user.name) {
        return prev
      }
      const updatedUsers = { ...existing, [user.sessionId]: user }
      return {
        ...prev,
        users: updatedUsers,
        userCount: Object.keys(updatedUsers).length,
      }
    })
  }, [])

  const removeUser = useCallback((sessionId: string) => {
    if (!sessionId) return
    setRoom((prev) => {
      if (!prev || !prev.users || !prev.users[sessionId]) return prev
      const { [sessionId]: _, ...rest } = prev.users
      return {
        ...prev,
        users: rest,
        userCount: Object.keys(rest).length,
      }
    })
  }, [])

  const setRoomState = useCallback((newRoom: Room) => {
    if (!newRoom) return
    setRoom((prev) => {
      if (!prev) return newRoom
      if (
        prev.version === newRoom.version &&
        prev.code === newRoom.code &&
        prev.language === newRoom.language &&
        prev.userCount === newRoom.userCount
      ) {
        return prev
      }
      return newRoom
    })
  }, [])

  return {
    room,
    loading,
    error,
    fetchRoom,
    updateCode,
    addUser,
    removeUser,
    setRoomState,
    updateRoom,
  }
}
