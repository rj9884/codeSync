import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, Users } from 'lucide-react'
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
import type { ExecutionResponse, CodeUpdate } from '../types'
import { cn } from '../utils/cn'

export function EditorPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const effectiveRoomId = roomId || 'default'

  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOutput, setShowOutput] = useState(true)

  // Synchronously initialize current user from localStorage
  const [currentUser, setCurrentUser] = useState<{ roomId: string; name: string }>(() => {
    const stored = localStorage.getItem('codesync_user') || localStorage.getItem('currentUser')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          roomId: effectiveRoomId,
          name: parsed.name || 'Anonymous',
        }
      } catch (e) {
        // ignore
      }
    }
    const defaultUser = { roomId: effectiveRoomId, name: 'Anonymous' }
    localStorage.setItem('codesync_user', JSON.stringify(defaultUser))
    localStorage.setItem('currentUser', JSON.stringify(defaultUser))
    return defaultUser
  })

  // Synchronize localStorage when roomId or user changes
  useEffect(() => {
    if (currentUser.roomId !== effectiveRoomId) {
      const updated = { ...currentUser, roomId: effectiveRoomId }
      setCurrentUser(updated)
      localStorage.setItem('codesync_user', JSON.stringify(updated))
      localStorage.setItem('currentUser', JSON.stringify(updated))
    }
  }, [effectiveRoomId, currentUser])

  // Room hook
  const { room, loading: roomLoading, updateCode, addUser, removeUser } = useRoom({
    roomId: effectiveRoomId,
    onRoomUpdate: (updatedRoom) => {
      if (updatedRoom.language) setLanguage(updatedRoom.language)
    },
  })

  // STOMP client
  const { sendCodeUpdate, sendTyping } = useStompClient({
    roomId: effectiveRoomId,
    userName: currentUser.name,
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
        if (roomState.users) {
          Object.values(roomState.users).forEach(addUser)
        }
      }
    },
    onConnect: () => toast.success('Connected to room'),
    onDisconnect: () => toast.error('Disconnected from room'),
    onError: (error) => toast.error(error),
  })

  // Typing hook
  const { typingUsers, setTyping, handleTypingEvent } = useTyping(sendTyping, currentUser.name)

  // Presence hook
  const { users } = usePresence(
    room && room.users ? Object.values(room.users) : [],
    undefined
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
        toast.success('Code executed successfully!')
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

  // Keyboard shortcuts for running code: Ctrl+Enter OR Ctrl+Alt+N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      const isEnter = e.key === 'Enter'
      const isAltN = e.altKey && e.key.toLowerCase() === 'n'

      if ((isCtrlOrCmd && isEnter) || (e.ctrlKey && isAltN)) {
        e.preventDefault()
        handleRunCode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRunCode])

  // Copy room ID
  const handleCopyRoomId = useCallback(async () => {
    if (effectiveRoomId) {
      await navigator.clipboard.writeText(effectiveRoomId)
      toast.success('Room ID copied to clipboard')
    }
  }, [effectiveRoomId])

  // Leave room
  const handleLeaveRoom = useCallback(() => {
    localStorage.removeItem('codesync_user')
    localStorage.removeItem('currentUser')
    toast('You have left the room')
    navigate('/')
  }, [navigate])

  // Show loading state
  if (roomLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        users={users}
        typingUsers={typingUsers}
        currentUserName={currentUser.name}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
        onCopyRoomId={handleCopyRoomId}
        onLeaveRoom={handleLeaveRoom}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        {/* Toolbar */}
        <EditorToolbar
          language={language}
          onLanguageChange={setLanguage}
          roomId={effectiveRoomId}
          onCopyRoomId={handleCopyRoomId}
          onLeaveRoom={handleLeaveRoom}
          onRunCode={handleRunCode}
          isRunning={isRunning}
        />

        {/* Editor + Output Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Container */}
          <div className={cn(
            'flex flex-col flex-1 min-w-0 bg-[#2d2d2d]',
            showOutput ? 'w-full' : 'w-full'
          )}>
            <CodeEditor
              roomId={effectiveRoomId}
              language={language}
              initialCode={room?.code || ''}
              version={room?.version || 0}
              onCodeChange={handleCodeChange}
              onRemoteUpdate={handleRemoteUpdate}
            />
          </div>

          {/* User Terminal / Output Panel */}
          {showOutput && (
            <OutputPanel
              output={output}
              typingUsers={typingUsers}
              onClear={() => setOutput(null)}
              onClose={() => setShowOutput(false)}
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

      {/* Mobile sidebar toggle button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-white text-black rounded-full shadow-lg cursor-pointer"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Users className="h-6 w-6" />
      </button>
    </div>
  )
}
