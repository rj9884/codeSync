import { Client, Message, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { CodeUpdate, TypingEvent, UserJoinedEvent, UserLeftEvent, Room } from '../types'

type MessageHandler<T> = (data: T) => void

interface StompCallbacks {
  onCodeUpdate?: MessageHandler<CodeUpdate>
  onTyping?: MessageHandler<TypingEvent>
  onUserJoined?: MessageHandler<UserJoinedEvent>
  onUserLeft?: MessageHandler<UserLeftEvent>
  onRoomState?: MessageHandler<Room>
  onLanguageChange?: MessageHandler<string>
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: string) => void
}

class StompService {
  private client: Client | null = null
  private subscriptions: Map<string, StompSubscription> = new Map()
  private callbacks: StompCallbacks = {}
  private roomId: string | null = null
  private userName: string | null = null
  private reconnectDelay = 1000

  getUserName(): string | null {
    return this.userName
  }

  connect(roomId: string, userName: string, callbacks: StompCallbacks): Promise<void> {
    if (this.client) {
      try {
        this.disconnect()
      } catch (e) {
        // ignore
      }
    }

    this.roomId = roomId
    this.userName = userName
    this.callbacks = callbacks

    const wsUrl =
      import.meta.env.VITE_WS_URL ||
      (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/ws` : '/ws')

    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: this.reconnectDelay,
        onConnect: () => {
          console.log('STOMP connected')
          this.subscribeToRoom(roomId)
          this.joinRoom(roomId, userName)
          this.callbacks.onConnect?.()
          resolve()
        },
        onDisconnect: () => {
          console.log('STOMP disconnected')
          this.callbacks.onDisconnect?.()
        },
        onStompError: (frame) => {
          const error = frame.headers['message'] || 'STOMP error'
          console.error('STOMP error:', error)
          this.callbacks.onError?.(error)
        },
        onWebSocketError: (error) => {
          console.error('WebSocket error:', error)
          this.callbacks.onError?.(error.message)
        },
      })

      this.client.activate()

      // Timeout for connection
      setTimeout(() => {
        if (!this.client?.connected) {
          reject(new Error('Connection timeout'))
        }
      }, 10000)
    })
  }

  private subscribeToRoom(roomId: string) {
    if (!this.client) return

    // Subscribe to code updates
    this.subscriptions.set('code', this.client.subscribe(
      `/topic/room/${roomId}/code-update`,
      (message: Message) => {
        try {
          const data = JSON.parse(message.body) as CodeUpdate
          this.callbacks.onCodeUpdate?.(data)
        } catch (e) {
          console.error('Failed to parse code update:', e)
        }
      }
    ))

    // Subscribe to typing events
    this.subscriptions.set('typing', this.client.subscribe(
      `/topic/room/${roomId}/typing`,
      (message: Message) => {
        try {
          const data = JSON.parse(message.body) as TypingEvent
          this.callbacks.onTyping?.(data)
        } catch (e) {
          console.error('Failed to parse typing event:', e)
        }
      }
    ))

    // Subscribe to user joined
    this.subscriptions.set('userJoined', this.client.subscribe(
      `/topic/room/${roomId}/user-joined`,
      (message: Message) => {
        try {
          const data = JSON.parse(message.body) as UserJoinedEvent
          this.callbacks.onUserJoined?.(data)
        } catch (e) {
          console.error('Failed to parse user joined:', e)
        }
      }
    ))

    // Subscribe to user left
    this.subscriptions.set('userLeft', this.client.subscribe(
      `/topic/room/${roomId}/user-left`,
      (message: Message) => {
        try {
          const data = JSON.parse(message.body) as UserLeftEvent
          this.callbacks.onUserLeft?.(data)
        } catch (e) {
          console.error('Failed to parse user left:', e)
        }
      }
    ))

    // Subscribe to language change
    this.subscriptions.set('language', this.client.subscribe(
      `/topic/room/${roomId}/language`,
      (message: Message) => {
        try {
          const data = JSON.parse(message.body) as { language?: string }
          if (data?.language) {
            this.callbacks.onLanguageChange?.(data.language)
          }
        } catch (e) {
          console.error('Failed to parse language change:', e)
        }
      }
    ))
  }

  private joinRoom(roomId: string, userName: string) {
    this.send('/app/room/{roomId}/join', { roomId, name: userName })
  }

  leaveRoom(roomId: string) {
    this.send('/app/room/{roomId}/leave', { roomId })
  }

  sendCodeUpdate(roomId: string, code: string, version: number) {
    this.send('/app/room/{roomId}/code', { roomId, code, version })
  }

  sendTyping(roomId: string, name: string, typing: boolean) {
    this.send('/app/room/{roomId}/typing', { roomId, name, typing })
  }

  sendLanguage(roomId: string, language: string) {
    this.send('/app/room/{roomId}/language', { roomId, language })
  }

  requestRoomState(roomId: string) {
    if (this.client?.connected) {
      this.client.subscribe(`/topic/room/${roomId}/state`, (message: Message) => {
        try {
          const data = JSON.parse(message.body) as Room
          this.callbacks.onRoomState?.(data)
        } catch (e) {
          console.error('Failed to parse room state:', e)
        }
      })
    }
  }

  private send(destination: string, body: object) {
    if (this.client?.connected) {
      const dest = destination.replace('{roomId}', this.roomId || '')
      this.client.publish({
        destination: dest,
        body: JSON.stringify(body),
      })
    }
  }

  disconnect() {
    if (this.client) {
      if (this.roomId) {
        try {
          this.leaveRoom(this.roomId)
        } catch (e) {
          // ignore
        }
      }
      this.subscriptions.forEach((sub) => {
        try {
          sub.unsubscribe()
        } catch (e) {
          // ignore
        }
      })
      this.subscriptions.clear()
      try {
        this.client.deactivate()
      } catch (e) {
        // ignore
      }
      this.client = null
      this.roomId = null
      this.userName = null
    }
  }

  isConnected(): boolean {
    return this.client?.connected ?? false
  }
}

export const stompService = new StompService()