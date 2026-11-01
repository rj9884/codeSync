export interface Room {
  id: string
  code: string
  language: string
  version: number
  createdAt: string
  updatedAt: string
  users: Record<string, RoomUser>
  ttlSeconds?: number
}

export interface RoomUser {
  sessionId: string
  name: string
  avatarId: number
  joinedAt: string
  isOwner: boolean
}

export interface CodeUpdate {
  roomId: string
  code: string
  version: number
}

export interface TypingEvent {
  roomId: string
  name: string
  typing: boolean
}

export interface UserJoinedEvent {
  sessionId: string
  name: string
  avatarId: number
  joinedAt: string
  isOwner: boolean
}

export interface UserLeftEvent {
  sessionId: string
  name: string
  avatarId: number
}

export interface ExecutionRequest {
  code: string
  language: string
}

export interface ExecutionResponse {
  output: string
  error: string
  status: string
  executionTimeMs: number
}

export interface Language {
  id: string
  name: string
  extensions: string[]
  mode: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'javascript', name: 'JavaScript', extensions: ['.js'], mode: 'javascript' },
  { id: 'typescript', name: 'TypeScript', extensions: ['.ts', '.tsx'], mode: 'typescript' },
  { id: 'python', name: 'Python', extensions: ['.py'], mode: 'python' },
  { id: 'java', name: 'Java', extensions: ['.java'], mode: 'java' },
  { id: 'cpp', name: 'C++', extensions: ['.cpp', '.cc', '.hpp'], mode: 'cpp' },
  { id: 'c', name: 'C', extensions: ['.c', '.h'], mode: 'cpp' },
  { id: 'html', name: 'HTML', extensions: ['.html', '.htm'], mode: 'html' },
  { id: 'css', name: 'CSS', extensions: ['.css'], mode: 'css' },
]

export interface User {
  roomId: string
  name: string
}