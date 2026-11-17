import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export function SidebarOptInForm({
  roomId,
  onLeaveRoom,
}: {
  roomId?: string
  onLeaveRoom?: () => void
}) {
  const navigate = useNavigate()

  const handleCopyRoomId = () => {
    let idToCopy = roomId
    if (!idToCopy) {
      const currentUserData = localStorage.getItem("currentUser") || localStorage.getItem("codesync_user")
      if (currentUserData) {
        try {
          idToCopy = JSON.parse(currentUserData).roomId
        } catch (e) {
          // ignore
        }
      }
    }

    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy)
      toast.success("Room ID copied to clipboard")
    } else {
      toast.error("NO Room ID Found")
    }
  }

  const handleLeaveRoom = () => {
    if (onLeaveRoom) {
      onLeaveRoom()
      return
    }

    const currentUserData = localStorage.getItem("currentUser") || localStorage.getItem("codesync_user")
    if (currentUserData) {
      try {
        const { roomId: storedRoomId, name } = JSON.parse(currentUserData)
        if (storedRoomId) {
          const roomDataKey = `room-${storedRoomId}`
          const roomData = localStorage.getItem(roomDataKey)
          if (roomData) {
            const members = JSON.parse(roomData).members.filter(
              (member: { name: string }) => member.name !== name
            )
            localStorage.setItem(roomDataKey, JSON.stringify({ members }))
          }
        }
      } catch (e) {
        // ignore
      }
      localStorage.removeItem("currentUser")
      localStorage.removeItem("codesync_user")
    }
    toast.success("You have left the room")
    navigate("/")
  }

  return (
    <Card className="shadow-none">
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent className="grid gap-2.5 p-4">
          <Button
            type="button"
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none cursor-pointer"
            size="sm"
            onClick={handleCopyRoomId}
          >
            Copy Room ID
          </Button>
          <Button
            type="button"
            className="w-full bg-sidebar-foreground text-sidebar-primary-foreground shadow-none cursor-pointer"
            size="sm"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
