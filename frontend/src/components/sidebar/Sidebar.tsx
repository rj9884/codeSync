import { GalleryVerticalEnd, X, Copy, LogOut } from 'lucide-react'
import { cn } from '../../utils/cn'
import { AnimatedTooltip } from '../ui/animated-tooltip'
import type { RoomUser, TypingUser } from '../../types'

interface SidebarProps {
  users: RoomUser[]
  typingUsers: TypingUser[]
  currentUserId?: string
  currentUserName: string
  onClose: () => void
  isOpen: boolean
  onCopyRoomId?: () => void
  onLeaveRoom?: () => void
}

const profileImages = [
  'https://plus.unsplash.com/premium_photo-1731327688406-51dbb887c658?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1732757787135-ce2ad37bb72c?q=80&w=1354&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1722696650716-6ba24ffadce0?q=80&w=1347&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1731681926154-9fb4a306fe5a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

export function Sidebar({
  users,
  typingUsers,
  currentUserId,
  currentUserName,
  onClose,
  isOpen,
  onCopyRoomId,
  onLeaveRoom,
}: SidebarProps) {
  const tooltipItems = users.map((u, i) => ({
    id: i + 1,
    name: u.name || 'Anonymous',
    image: profileImages[((u.avatarId || (i + 1)) - 1) % profileImages.length],
  }))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static z-50 flex h-full flex-col bg-zinc-950 border-r border-zinc-800 text-white transition-all duration-300 ease-in-out w-64 shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-black font-bold">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="font-semibold text-gray-200 text-base">&lt;CodeSync/&gt;</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Team Members ({users.length})
            </h3>
            {users.length > 0 ? (
              <div className="py-2">
                <AnimatedTooltip items={tooltipItems} />
              </div>
            ) : (
              <div className="text-xs text-zinc-500 py-2">No team members yet</div>
            )}
          </div>

          <div className="border-t border-zinc-850 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Online ({users.length})
            </h4>
            <div className="space-y-1.5">
              {users.map((user) => (
                <div
                  key={user.sessionId}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-900 text-xs text-zinc-300 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="truncate flex-1">{user.name}</span>
                  {user.name === currentUserName && (
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          {onCopyRoomId && (
            <button
              onClick={onCopyRoomId}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            >
              <Copy className="size-3.5" />
              Copy Room ID
            </button>
          )}
          {onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-zinc-900/60 border border-zinc-800 hover:bg-red-950/40 hover:border-red-900/50 hover:text-red-300 text-zinc-400 transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Leave Room
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
