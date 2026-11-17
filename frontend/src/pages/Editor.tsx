import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { AppSidebar } from "@/components/app-sidebar"
import { CodeEditor } from "@/components/code-editor"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStompClient } from "@/hooks/useStompClient"
import { useTyping } from "@/hooks/useTyping"
import { useRoom } from "@/hooks/useRoom"
import { executionApi } from "@/services/api"
import type { CodeUpdate, Room, RoomUser, TypingEvent } from "@/types"

export function EditorPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  // Initialize current user & room ID
  const [currentUser, setCurrentUser] = useState<{ roomId: string; name: string }>(() => {
    const stored = localStorage.getItem("currentUser") || localStorage.getItem("codesync_user")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          roomId: roomId || parsed.roomId || "1",
          name: parsed.name || "Anonymous",
        }
      } catch (e) {
        // ignore
      }
    }
    const defaultUser = { roomId: roomId || "1", name: "Anonymous" }
    localStorage.setItem("currentUser", JSON.stringify(defaultUser))
    localStorage.setItem("codesync_user", JSON.stringify(defaultUser))
    return defaultUser
  })

  const effectiveRoomId = roomId || currentUser.roomId || "1"

  useEffect(() => {
    if (currentUser.roomId !== effectiveRoomId) {
      const updated = { ...currentUser, roomId: effectiveRoomId }
      setCurrentUser(updated)
      localStorage.setItem("currentUser", JSON.stringify(updated))
      localStorage.setItem("codesync_user", JSON.stringify(updated))
    }
  }, [effectiveRoomId])

  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleRoomUpdate = useCallback((updatedRoom: Room) => {
    if (updatedRoom.language) {
      setLanguage((prev) => (prev !== updatedRoom.language ? updatedRoom.language : prev))
    }
    if (updatedRoom.code !== undefined) {
      setCode(updatedRoom.code)
    }
  }, [])

  const { room, updateCode, addUser, removeUser, setRoomState } = useRoom({
    roomId: effectiveRoomId,
    onRoomUpdate: handleRoomUpdate,
  })

  useEffect(() => {
    if (room?.code !== undefined) {
      setCode(room.code)
    }
    if (room?.language) {
      setLanguage(room.language)
    }
  }, [room?.code, room?.language])

  const handleCodeUpdate = useCallback(
    (update: CodeUpdate) => {
      if (update.version > (room?.version || 0)) {
        updateCode(update.code, update.version)
        setCode(update.code)
      }
    },
    [room?.version, updateCode]
  )

  const handleUserJoined = useCallback(
    (user: RoomUser) => {
      addUser(user)
    },
    [addUser]
  )

  const handleUserLeft = useCallback(
    (event: { sessionId: string }) => {
      removeUser(event.sessionId)
    },
    [removeUser]
  )

  const handleRoomState = useCallback(
    (roomState: Room) => {
      if (roomState) {
        setRoomState(roomState)
        if (roomState.language) {
          setLanguage((prev) => (prev !== roomState.language ? roomState.language : prev))
        }
        if (roomState.code !== undefined) {
          setCode(roomState.code)
        }
      }
    },
    [setRoomState]
  )

  const typingHandlerRef = useRef<(event: TypingEvent) => void>(() => {})

  const { sendCodeUpdate, sendTyping, sendLanguage } = useStompClient({
    roomId: effectiveRoomId,
    userName: currentUser.name,
    onCodeUpdate: handleCodeUpdate,
    onTyping: (event) => typingHandlerRef.current(event),
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
    onRoomState: handleRoomState,
    onLanguageChange: (newLang) => setLanguage(newLang),
    onConnect: () => toast.success("Connected to room"),
    onDisconnect: () => toast.error("Disconnected from room"),
    onError: (error) => toast.error(error),
  })

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setLanguage(newLang)
      sendLanguage(newLang)
    },
    [sendLanguage]
  )

  const { typingUsers, setTyping, handleTypingEvent } = useTyping(sendTyping, currentUser.name)
  useEffect(() => {
    typingHandlerRef.current = handleTypingEvent
  }, [handleTypingEvent])

  const teamMembers = useMemo(() => {
    const list = room?.users ? Object.values(room.users) : []
    if (list.length === 0 || !list.some((u) => u.name === currentUser.name)) {
      return [
        { id: 1, name: currentUser.name || "Anonymous", avatarId: 1 },
        ...list.map((u, i) => ({ id: i + 2, name: u.name, avatarId: u.avatarId || (i % 4) + 1 })),
      ]
    }
    return list.map((u, i) => ({
      id: i + 1,
      name: u.name,
      avatarId: u.avatarId || (i % 4) + 1,
    }))
  }, [room?.users, currentUser.name])

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode)
      const nextVersion = (room?.version || 0) + 1
      updateCode(newCode, nextVersion)
      sendCodeUpdate(newCode, nextVersion)
    },
    [room?.version, updateCode, sendCodeUpdate]
  )

  const handleRunCode = useCallback(async () => {
    if (isRunning) return
    setIsRunning(true)

    try {
      const response = await executionApi.execute({
        code,
        language,
      })

      if (response.data.status === "Success") {
        toast.success("Code executed successfully!")
        setOutput(response.data.output || "Code executed successfully (no output)")
      } else {
        toast.error("Execution failed")
        setOutput(response.data.error || response.data.output || "Execution failed")
      }
    } catch (error) {
      toast.error("Failed to execute code")
      setOutput(`Error: ${(error as Error).message}`)
    } finally {
      setIsRunning(false)
    }
  }, [code, language, isRunning])

  const handleLeaveRoom = useCallback(() => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("codesync_user")
    toast.success("You have left the room")
    navigate("/")
  }, [navigate])

  return (
    <SidebarProvider>
      <AppSidebar
        roomId={effectiveRoomId}
        members={teamMembers}
        onLeaveRoom={handleLeaveRoom}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:inline-flex">
                <BreadcrumbLink asChild>
                  <Link to="/collaborate">Collaborate</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:inline-flex" />
              <BreadcrumbItem>
                <BreadcrumbPage>Codespace</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">&lt;CodeSync/&gt; Codespace</h2>
              <div className="text-l text-gray-800 dark:text-gray-200 mb-2">
                Press Ctrl+Alt+N to run code
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="jsx">JSX</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="tsx">TSX</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-md overflow-hidden">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language={language}
                roomId={effectiveRoomId}
                typingUsers={typingUsers}
                onTyping={setTyping}
                output={output}
                onRunCode={handleRunCode}
                isExecuting={isRunning}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default EditorPage
