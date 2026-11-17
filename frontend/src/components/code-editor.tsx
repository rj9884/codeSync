import { useState, useEffect, useRef, useCallback } from "react"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import toast from "react-hot-toast"
import { executionApi } from "@/services/api"

import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-java"
import "prismjs/components/prism-python"
import "prismjs/themes/prism-tomorrow.css"

export interface CodeEditorProps {
  value?: string
  language?: string
  onChange?: (value: string) => void
  roomId?: string
  typingUsers?: { name: string; timestamp?: number }[]
  onTyping?: (isTyping: boolean) => void
  output?: string | null
  onRunCode?: () => void
  isExecuting?: boolean
}

export function CodeEditor({
  value = "",
  language = "javascript",
  onChange,
  typingUsers = [],
  onTyping,
  output: externalOutput,
  onRunCode,
  isExecuting = false,
}: CodeEditorProps) {
  const [internalCode, setInternalCode] = useState(value)
  const [internalOutput, setInternalOutput] = useState<string>("")
  const [executing, setExecuting] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const codeRef = useRef(value)

  useEffect(() => {
    setInternalCode(value)
    codeRef.current = value
  }, [value])

  const getLanguageGrammar = (lang: string) => {
    switch (lang) {
      case "javascript":
      case "js":
        return Prism.languages.javascript || Prism.languages.markup
      case "jsx":
        return Prism.languages.jsx || Prism.languages.javascript || Prism.languages.markup
      case "typescript":
      case "ts":
        return Prism.languages.typescript || Prism.languages.javascript
      case "tsx":
        return Prism.languages.tsx || Prism.languages.typescript || Prism.languages.javascript
      case "css":
        return Prism.languages.css || Prism.languages.markup
      case "html":
        return Prism.languages.markup
      case "cpp":
      case "c++":
        return Prism.languages.cpp || Prism.languages.clike
      case "java":
        return Prism.languages.java || Prism.languages.clike
      case "python":
      case "py":
        return Prism.languages.python
      default:
        return Prism.languages[lang] || Prism.languages.javascript || Prism.languages.markup
    }
  }

  const handleValueChange = (newCode: string) => {
    setInternalCode(newCode)
    codeRef.current = newCode
    onChange?.(newCode)

    if (onTyping) {
      onTyping(true)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
        typingTimeoutRef.current = null
      }, 1500)
    }
  }

  const handleExecute = useCallback(async () => {
    if (onRunCode) {
      onRunCode()
      return
    }

    setExecuting(true)
    try {
      const response = await executionApi.execute({
        code: codeRef.current,
        language,
      })
      if (response.data.status === "Success") {
        toast.success("Code executed successfully!")
        setInternalOutput(response.data.output || "Code executed successfully (no output)")
      } else {
        toast.error("Execution failed")
        setInternalOutput(response.data.error || response.data.output || "Execution failed")
      }
    } catch (error) {
      toast.error("Failed to execute code")
      setInternalOutput(`Error: ${(error as Error).message}`)
    } finally {
      setExecuting(false)
    }
  }, [language, onRunCode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAltN = e.ctrlKey && e.altKey && e.key.toLowerCase() === "n"
      const isCtrlEnter = (e.ctrlKey || e.metaKey) && e.key === "Enter"

      if (isAltN || isCtrlEnter) {
        e.preventDefault()
        handleExecute()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleExecute])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const displayOutput = externalOutput !== undefined ? externalOutput : internalOutput

  return (
    <div className="flex h-full min-h-[500px]">
      <div className="w-3/4 h-full">
        <Editor
          value={internalCode}
          onValueChange={handleValueChange}
          highlight={(c) => {
            const grammar = getLanguageGrammar(language)
            return grammar ? Prism.highlight(c, grammar, language) : c
          }}
          padding={16}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 18,
            backgroundColor: "#2d2d2d",
            minHeight: "500px",
            height: "100%",
            color: "#ccc",
          }}
          className="min-h-[500px] h-full w-full"
        />
      </div>
      <div className="w-1/4 p-4 bg-[#2d2d2d] flex flex-col border-l border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 mb-2"> User Terminal </h2>
        <div className="h-60px typing-indicator border-t border-zinc-700/60">
          {(executing || isExecuting) && (
            <div className="text-xs text-zinc-400 py-1 font-mono">Running code...</div>
          )}
          {typingUsers.map((user) => (
            <div key={user.name} className="typing-user">
              <span>
                {user.name} is typing
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </span>
            </div>
          ))}
        </div>
        {displayOutput && (
          <div className="output-panel mt-4 flex-1 overflow-auto">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Output:</h3>
            <pre className="whitespace-pre-wrap text-zinc-100 font-mono text-sm bg-zinc-900/90 p-3 rounded-md border border-zinc-800">{displayOutput}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor
