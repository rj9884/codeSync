import { cn } from '../../utils/cn'
import type { TypingUser } from '../../hooks/useTyping'

interface TypingIndicatorProps {
  typingUsers: TypingUser[]
  currentUserName: string
}

export function TypingIndicator({ typingUsers, currentUserName }: TypingIndicatorProps) {
  const otherTypingUsers = typingUsers.filter(u => u.name !== currentUserName)

  if (otherTypingUsers.length === 0) return null

  const getTypingText = () => {
    const names = otherTypingUsers.map(u => u.name)
    if (names.length === 1) {
      return `${names[0]} is typing`
    } else if (names.length === 2) {
      return `${names[0]} and ${names[1]} are typing`
    } else {
      return `${names[0]}, ${names[1]} and ${names.length - 2} others are typing`
    }
  }

  return (
    <div className={cn('flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg animate-slide-in')}>
      <div className="typing-dots text-primary">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
      <span className="text-sm font-medium text-primary">{getTypingText()}</span>
    </div>
  )
}