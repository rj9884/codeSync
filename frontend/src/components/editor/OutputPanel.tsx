import { X, Terminal, Trash2, Copy } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import type { ExecutionResponse } from '../../types'

interface OutputPanelProps {
  output: ExecutionResponse | null
  onClear: () => void
  onCopy: () => void
}

export function OutputPanel({ output, onClear, onCopy }: OutputPanelProps) {
  const [showOutput, setShowOutput] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (terminalRef.current && output) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  if (!output && !showOutput) return null

  const isError = output?.error && output.status !== 'Success'
  const isSuccess = output?.status === 'Success' && !output?.error

  return (
    <div className="flex flex-col border-l border-border bg-card min-w-[300px] max-w-[500px]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Output</span>
          {output && (
            <span className={cn(
              'px-2 py-0.5 text-xs rounded-full',
              isError && 'bg-destructive/10 text-destructive',
              isSuccess && 'bg-primary/10 text-primary',
              !isError && !isSuccess && 'bg-muted/50 text-muted-foreground'
            )}>
              {output.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {output && (
            <button
              onClick={onCopy}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
              title="Copy output"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
          {output && (
            <button
              onClick={onClear}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
              title="Clear output"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowOutput(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
            title="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm bg-background"
        style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
      >
        {output?.output && (
          <pre className="whitespace-pre-wrap text-foreground">{output.output}</pre>
        )}
        {output?.error && (
          <pre className="whitespace-pre-wrap text-destructive">{output.error}</pre>
        )}
        {!output && showOutput && (
          <p className="text-muted-foreground text-center py-8">
            Press Ctrl+Enter or click Run Code to execute
          </p>
        )}
        {output && output.executionTimeMs && (
          <div className="mt-4 pt-4 border-t border-border text-muted-foreground text-xs">
            Execution time: {output.executionTimeMs}ms
          </div>
        )}
      </div>
    </div>
  )
}