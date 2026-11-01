import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle, CheckCircle, Copy, X, Terminal } from 'lucide-react'
import toast from 'react-hot-toast'
import { CodeEditor } from '../components/editor/CodeEditor'
import { EditorToolbar } from '../components/editor/EditorToolbar'
import { OutputPanel } from '../components/editor/OutputPanel'
import { Sidebar } from '../components/sidebar/Sidebar'
import { useStompClient } from '../hooks/useStompClient'
import { useTyping } from '../hooks/useTyping'
import { usePresence } from '../hooks/usePresence'
import { useRoom } from '../hooks/useRoom'
import { executionApi } from '../services/api'
import { roomApi } from '../services/api'
import type { Room, RoomUser, ExecutionResponse, TypingUser, CodeUpdate } from '../types'
import { SUPPORTED_LANGUAGES } from '../types'

export function EditorPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const editorFocusedRef = useRef(false)

  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState<{ roomId: string; name: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('codesync_user')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
    }
  }, [])

  // Redirect if no user or roomId mismatch
  useEffect(() => {
    if (currentUser && roomId && currentUser.roomId !== roomId) {
      navigate(`/editor/${currentUser.roomId}`)
    }
    if (!currentUser && roomId !== 'new') {
      navigate('/')
    }
  }, [currentUser, roomId, navigate])

  // Room hook
  const { room, loading: roomLoading, error: roomError, updateCode, addUser, removeUser } = useRoom({
    roomId: roomId || '',
    onRoomUpdate: (updatedRoom) => {
      if (updatedRoom.language) setLanguage(updatedRoom.language)
    },
  })

  // STOMP client
  const { connected, sendCodeUpdate, sendTyping } = useStompClient({
    roomId: roomId || '',
    userName: currentUser?.name || '',
    onCodeUpdate: (update: CodeUpdate) => {
      if (update.version > (room?.version || 0)) {
        updateCode(update.code, update.version)
      }
    },
    onTyping: (event) => {
      handleTypingEvent(event)
    },
    onUserJoined: (user) => {
      addUser(user)
    },
    onUserLeft: (event) => {
      removeUser(event.sessionId)
    },
    onRoomState: (roomState) => {
      if (roomState) {
        updateCode(roomState.code, roomState.version)
        if (roomState.language) setLanguage(roomState.language)
        Object.values(roomState.users).forEach(addUser)
      }
    },
    onConnect: () => toast.success('Connected to room'),
    onDisconnect: () => toast.error('Disconnected from room'),
    onError: (error) => toast.error(error),
  })

  // Typing hook
  const { typingUsers, setTyping, handleTypingEvent } = useTyping(sendTyping, currentUser?.name || '')

  // Presence hook
  const { users, otherUsers, handleUserJoined, handleUserLeft } = usePresence(
    room ? Object.values(room.users) : [],
    currentUser ? undefined : undefined
  )

  // Handle code execution
  const handleRunCode = useCallback(async () => {
    if (!room || isRunning) return

    setIsRunning(true)
    setOutput(null)
    setShowOutput(true)

    try {
      const response = await executionApi.execute({
        code: room.code,
        language,
      })

      setOutput(response.data)
      if (response.data.status === 'Success') {
        toast.success('Code executed successfully')
      } else {
        toast.error('Execution failed')
      }
    } catch (error) {
      setOutput({
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        status: 'Error',
        executionTimeMs: 0,
      })
      toast.error('Failed to execute code')
    } finally {
      setIsRunning(false)
    }
  }, [room, language, isRunning])

  // Handle code change from editor
  const handleCodeChange = useCallback((code: string, version: number) => {
    updateCode(code, version)
    sendCodeUpdate(code, version)
    setTyping(true)
  }, [updateCode, sendCodeUpdate, setTyping])

  // Handle remote code update
  const handleRemoteUpdate = useCallback((code: string, version: number) => {
    updateCode(code, version)
  }, [updateCode])

  // Keyboard shortcut for running code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRunCode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRunCode])

  // Copy room ID
  const handleCopyRoomId = useCallback(async () => {
    if (roomId) {
      await navigator.clipboard.writeText(roomId)
      toast.success('Room ID copied')
    }
  }, [roomId])

  // Leave room
  const handleLeaveRoom = useCallback(() => {
    localStorage.removeItem('codesync_user')
    navigate('/')
  }, [navigate])

  // Show loading state
  if (roomLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show error state
  if (roomError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load room</h2>
          <p className="text-muted-foreground mb-4">{roomError}</p>
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <EditorToolbar
          language={language}
          onLanguageChange={setLanguage}
          roomId={roomId || ''}
          onCopyRoomId={handleCopyRoomId}
          onLeaveRoom={handleLeaveRoom}
          onRunCode={handleRunCode}
          isRunning={isRunning}
        />

        {/* Editor + Output */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className={cn(
            'flex flex-col flex-1 min-w-0',
            showOutput ? 'lg:w-2/3' : 'lg:w-full'
          )}>
            <CodeEditor
              roomId={roomId || ''}
              language={language}
              initialCode={room.code}
              version={room.version}
              onCodeChange={handleCodeChange}
              onRemoteUpdate={handleRemoteUpdate}
            />
          </div>

          {/* Output Panel */}
          {showOutput && (
            <OutputPanel
              output={output}
              onClear={() => setOutput(null)}
              onCopy={() => {
                if (output?.output) {
                  navigator.clipboard.writeText(output.output)
                  toast.success('Output copied')
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        users={users}
        typingUsers={typingUsers}
        currentUserId={currentUser ? undefined : undefined}
        currentUserName={currentUser?.name || ''}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />

      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Users className="h-6 w-6" />
      </button>
    </div>
  )
}

// Need to import cn
import { cn } from '../utils/cn'
import { Users } from 'lucide-react'