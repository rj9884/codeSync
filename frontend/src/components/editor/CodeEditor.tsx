import { useEffect, useRef, useCallback } from 'react'
import { EditorView, basicSetup } from '@codemirror/basic-setup'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { Compartment, Extension, EditorState } from '@codemirror/state'

interface CodeEditorProps {
  roomId: string
  language: string
  initialCode: string
  version: number
  onCodeChange: (code: string, version: number) => void
  onRemoteUpdate?: (code: string, version: number) => void
  readOnly?: boolean
}

const LANGUAGE_EXTENSIONS: Record<string, Extension> = {
  javascript: javascript({ jsx: true }),
  jsx: javascript({ jsx: true }),
  typescript: javascript({ typescript: true, jsx: true }),
  tsx: javascript({ typescript: true, jsx: true }),
  python: python(),
  java: java(),
  cpp: cpp(),
  c: cpp(),
  html: html(),
  css: css(),
}

const darkTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '15px',
    backgroundColor: '#18181b',
    color: '#f4f4f5',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    lineHeight: '1.6',
  },
  '.cm-content': {
    padding: '12px 0',
    caretColor: '#ffffff',
  },
  '.cm-cursor': {
    borderLeftColor: '#ffffff',
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: '#3f3f46 !important',
  },
  '.cm-gutters': {
    backgroundColor: '#121215',
    borderRight: '1px solid #27272a',
    color: '#71717a',
  },
  '.cm-activeLine': {
    backgroundColor: '#27272a40',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#27272a80',
    color: '#e4e4e7',
  },
}, { dark: true })

export function CodeEditor({
  roomId,
  language,
  initialCode,
  version: initialVersion,
  onCodeChange,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const versionRef = useRef(initialVersion)
  const isInternalChangeRef = useRef(false)
  const onCodeChangeRef = useRef(onCodeChange)
  const languageCompartment = useRef(new Compartment())
  const readOnlyCompartment = useRef(new Compartment())

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange
  }, [onCodeChange])

  useEffect(() => {
    versionRef.current = initialVersion
  }, [initialVersion])

  const getLanguageExtension = useCallback((lang: string): Extension => {
    return LANGUAGE_EXTENSIONS[lang] || javascript()
  }, [])

  // Initialize CodeMirror instance once
  useEffect(() => {
    if (!editorRef.current) return

    const extensions = [
      basicSetup,
      darkTheme,
      languageCompartment.current.of(getLanguageExtension(language)),
      readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !isInternalChangeRef.current) {
          const code = update.state.doc.toString()
          const newVersion = versionRef.current + 1
          versionRef.current = newVersion
          onCodeChangeRef.current?.(code, newVersion)
        }
      }),
    ]

    const state = EditorState.create({
      doc: initialCode || '',
      extensions,
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [roomId])

  // Reconfigure language dynamically
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(getLanguageExtension(language)),
      })
    }
  }, [language, getLanguageExtension])

  // Sync external code changes when remote updates arrive
  useEffect(() => {
    if (!viewRef.current) return
    const currentCode = viewRef.current.state.doc.toString()
    if (initialCode !== undefined && initialCode !== currentCode) {
      isInternalChangeRef.current = true
      viewRef.current.dispatch({
        changes: { from: 0, to: currentCode.length, insert: initialCode },
      })
      isInternalChangeRef.current = false
    }
  }, [initialCode])

  return (
    <div
      ref={editorRef}
      className="h-full w-full flex-1 overflow-hidden"
    />
  )
}
