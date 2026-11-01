import axios from 'axios'
import type { ExecutionRequest, ExecutionResponse, Room, Language } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const roomApi = {
  create: (language?: string, initialCode?: string) =>
    api.post<Room>('/rooms', { language, initialCode }),

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