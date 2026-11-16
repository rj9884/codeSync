import { Copy, Check, Terminal, Play, LogOut, ChevronRight } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
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
    <div className="flex flex-col border-b border-zinc-800 bg-zinc-950 text-white">
      {/* Top breadcrumb bar */}
      <div className="flex h-12 items-center justify-between border-b border-zinc-800/80 px-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link to="/collaborate" className="hover:text-white transition-colors">
            Collaborate
          </Link>
          <ChevronRight className="size-3 text-zinc-600" />
          <span className="text-zinc-200 font-medium">Codespace</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyRoomId}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
            title="Copy Room ID"
          >
            <Copy className="size-3" />
            <span className="font-mono text-[11px] text-zinc-400">{roomId}</span>
            {copied && <Check className="size-3 text-emerald-400" />}
          </button>

          <button
            onClick={onLeaveRoom}
            className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Leave Room"
          >
            <LogOut className="size-3" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* Main control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div>
          <h2 className="text-lg font-bold text-gray-200">CodeSync Codespace</h2>
          <p className="text-xs text-zinc-400">Press Ctrl+Enter or Ctrl+Alt+N to run code</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer"
              aria-haspopup="true"
              aria-expanded={showLanguageMenu}
            >
              <Terminal className="size-3.5 text-zinc-400" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.id === language)?.name || language}</span>
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onLanguageChange(lang.id)
                      setShowLanguageMenu(false)
                    }}
                    className={cn(
                      'w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-800 transition-colors text-zinc-300',
                      language === lang.id && 'bg-zinc-800 text-white font-semibold'
                    )}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Run Code Button */}
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow"
          >
            <Play className="size-3 fill-current" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
    </div>
  )
}
