import { User, Users, Wifi, WifiOff } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { RoomUser } from '../../types'

interface UserListProps {
  users: RoomUser[]
  currentUserId?: string
}

const AVATAR_COLORS = [
  'bg-gray-900 dark:bg-gray-100',
  'bg-gray-700 dark:bg-gray-300',
  'bg-gray-600 dark:bg-gray-400',
  'bg-gray-800 dark:bg-gray-200',
]

export function UserList({ users, currentUserId }: UserListProps) {
  const getAvatarColor = (avatarId: number) => {
    return AVATAR_COLORS[(avatarId - 1) % AVATAR_COLORS.length]
  }

  const currentUser = users.find(u => u.sessionId === currentUserId)
  const otherUsers = users.filter(u => u.sessionId !== currentUserId)

  return (
    <div className="flex flex-col gap-4">
      {currentUser && (
        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-white font-medium text-sm', getAvatarColor(currentUser.avatarId))}>
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Wifi className="h-3 w-3" /> You (Current)
            </p>
          </div>
          {currentUser.isOwner && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
              Owner
            </span>
          )}
        </div>
      )}

      {otherUsers.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Team Members ({otherUsers.length})
          </h3>
          <div className="space-y-2">
            {otherUsers.map(user => (
              <div
                key={user.sessionId}
                className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-white font-medium text-sm', getAvatarColor(user.avatarId))}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-primary" /> Online
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No users in this room</p>
        </div>
      )}
    </div>
  )
}