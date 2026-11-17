import { X, Terminal, Trash2, Copy } from 'lucide-react'
import { useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import type { ExecutionResponse, TypingUser } from '../../types'

interface OutputPanelProps {
  output: ExecutionResponse | null
  typingUsers?: TypingUser[]
  onClear: () => void
  onCopy: () => void
  onClose?: () => void
}

export function OutputPanel({ output, typingUsers = [], onClear, onCopy, onClose }: OutputPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current && output) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const isError = output?.error && output.status !== 'Success'
  const isSuccess = output?.status === 'Success' && !output?.error

  return (
    <div className="flex flex-col border-l border-zinc-800 bg-zinc-950 min-w-[320px] max-w-[480px] w-80 text-white">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-zinc-400" />
          <span className="font-semibold text-xs tracking-wide uppercase text-zinc-300">User Terminal</span>
          {output && (
            <span
              className={cn(
                'px-2 py-0.5 text-[10px] font-semibold rounded-full',
                isError && 'bg-red-500/10 text-red-400 border border-red-500/20',
                isSuccess && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                !isError && !isSuccess && 'bg-zinc-800 text-zinc-400'
              )}
            >
              {output.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {output && (
            <button
              onClick={onCopy}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Copy output"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
          {output && (
            <button
              onClick={onClear}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Clear output"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Close panel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Typing indicator banner in terminal */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-850">
          {typingUsers.map((user) => (
            <div key={user.name} className="flex items-center gap-2 text-xs text-zinc-300">
              <span>{user.name} is typing</span>
              <div className="typing-dots inline-flex gap-1">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-xs bg-black text-zinc-200"
        style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
      >
        {output?.output && (
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Output:</h3>
            <pre className="whitespace-pre-wrap text-emerald-300">{output.output}</pre>
          </div>
        )}
        {output?.error && (
          <div className="space-y-1 mt-2">
            <h3 className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-1">Error:</h3>
            <pre className="whitespace-pre-wrap text-red-400">{output.error}</pre>
          </div>
        )}
        {!output && (
          <div className="text-zinc-600 text-center py-12 flex flex-col items-center justify-center">
            <Terminal className="size-8 mb-2 opacity-30" />
            <p className="text-xs">Press Ctrl+Enter or Ctrl+Alt+N to run code</p>
          </div>
        )}
        {output && output.executionTimeMs !== undefined && output.executionTimeMs > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-900 text-zinc-500 text-[10px]">
            Execution time: {output.executionTimeMs}ms
          </div>
        )}
      </div>
    </div>
  )
}
