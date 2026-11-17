import axios from 'axios'
import type { ExecutionRequest, ExecutionResponse, Room } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const roomApi = {
  create: (roomId?: string, language?: string, initialCode?: string) =>
    api.post<Room>('/rooms', { roomId, language, initialCode }),

  get: (roomId: string) =>
    api.get<Room>(`/rooms/${roomId}`),

  delete: (roomId: string) =>
    api.delete(`/rooms/${roomId}`),

  list: () =>
    api.get<Room[]>('/rooms'),
}

export const executionApi = {
  execute: (request: ExecutionRequest) =>
    api.post<ExecutionResponse>('/execute', request),

  getLanguages: () =>
    api.get<Record<string, number>>('/execute/languages'),
}

export default api