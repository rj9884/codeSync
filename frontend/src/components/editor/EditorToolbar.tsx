import { Copy, Check, X, Terminal } from 'lucide-react'
import { useState, useCallback } from 'react'
import { cn } from '../../utils/cn'
import type { Language } from '../../types'
import { SUPPORTED_LANGUAGES } from '../../types'

interface EditorToolbarProps {
  language: string
  onLanguageChange: (language: string) => void
  roomId: string
  onCopyRoomId: () => void
  onLeaveRoom: () => void
  onRunCode: () => void
  isRunning: boolean
}

export function EditorToolbar({
  language,
  onLanguageChange,
  roomId,
  onCopyRoomId,
  onLeaveRoom,
  onRunCode,
  isRunning,
}: EditorToolbarProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyRoomId = useCallback(async () => {
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    onCopyRoomId()
    setTimeout(() => setCopied(false), 2000)
  }, [roomId, onCopyRoomId])

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            aria-haspopup="true"
            aria-expanded={showLanguageMenu}
          >
            <Terminal className="h-4 w-4" />
            <span>{SUPPORTED_LANGUAGES.find(l => l.id === language)?.name || language}</span>
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-popover border border-border rounded-lg shadow-lg py-1">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onLanguageChange(lang.id)
                    setShowLanguageMenu(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors',
                    language === lang.id && 'bg-accent text-accent-foreground'
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleCopyRoomId}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          title="Copy Room ID"
        >
          <Copy className="h-4 w-4" />
          <span className="font-mono text-xs">{roomId}</span>
          {copied && <Check className="h-4 w-4 text-green-500" />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Terminal className="h-4 w-4" />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>

        <button
          onClick={onLeaveRoom}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Leave Room"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  )
}