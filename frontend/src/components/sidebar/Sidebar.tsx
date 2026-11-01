import { Users, Code, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { UserList } from './UserList'
import { TypingIndicator } from './TypingIndicator'
import type { RoomUser, TypingUser } from '../../types'

interface SidebarProps {
  users: RoomUser[]
  typingUsers: TypingUser[]
  currentUserId?: string
  currentUserName: string
  onClose: () => void
  isOpen: boolean
}

export function Sidebar({
  users,
  typingUsers,
  currentUserId,
  currentUserName,
  onClose,
  isOpen,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static z-50 flex h-full flex-col bg-card border-r border-border transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <h2 className="font-semibold">Collaboration</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-2 mb-4 border-b border-border">
            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-t-lg transition-colors',
                activeTab === 'users'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Users className="h-4 w-4 inline mr-1" /> Users
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-t-lg transition-colors',
                activeTab === 'activity'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Code className="h-4 w-4 inline mr-1" /> Activity
            </button>
          </div>

          {activeTab === 'users' && (
            <UserList users={users} currentUserId={currentUserId} />
          )}

          {activeTab === 'activity' && (
            <div className="space-y-2">
              <TypingIndicator
                typingUsers={typingUsers}
                currentUserName={currentUserName}
              />
              <div className="text-center py-8 text-muted-foreground">
                <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}