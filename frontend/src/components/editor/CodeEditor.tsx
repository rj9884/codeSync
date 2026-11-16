import { useEffect, useRef, useCallback, useState } from 'react'
import { EditorView, basicSetup } from '@codemirror/basic-setup'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { collab, CollabConfig } from '@codemirror/collab'
import { Compartment, Extension } from '@codemirror/state'
import { EditorState } from '@codemirror/state'

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
  typescript: javascript({ typescript: true, jsx: true }),
  python: python(),
  java: java(),
  cpp: cpp(),
  html: html(),
  css: css(),
}

export function CodeEditor({
  roomId,
  language,
  initialCode,
  version: initialVersion,
  onCodeChange,
  onRemoteUpdate,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const versionRef = useRef(initialVersion)
  const languageCompartment = useRef(new Compartment())
  const collabCompartment = useRef(new Compartment())
  const [clientId] = useState(() => Math.floor(Math.random() * 1000000))
  const pendingChangesRef = useRef<{ code: string; version: number } | null>(null)
  const isComposingRef = useRef(false)

  // Create collab config
  const collabConfig: CollabConfig = {
    clientID: clientId,
    sendUpdates: (updates) => {
      const newState = viewRef.current!.state.apply(updates)
      const code = newState.doc.toString()
      pendingChangesRef.current = { code, version: versionRef.current }
    },
  }

  // Get language extension
  const getLanguageExtension = useCallback((lang: string): Extension => {
    return LANGUAGE_EXTENSIONS[lang] || javascript()
  }, [])

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return

    const extensions = [
      basicSetup,
      languageCompartment.current.of(getLanguageExtension(language)),
      collabCompartment.current.of(collab(collabConfig)),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !isComposingRef.current) {
          const code = update.state.doc.toString()
          const newVersion = versionRef.current + 1
          versionRef.current = newVersion
          onCodeChange(code, newVersion)
        }
      }),
      EditorView.domEventHandlers({
        compositionstart: () => { isComposingRef.current = true },
        compositionend: (e) => {
          isComposingRef.current = false
          const view = viewRef.current
          if (view) {
            const code = view.state.doc.toString()
            const newVersion = versionRef.current + 1
            versionRef.current = newVersion
            onCodeChange(code, newVersion)
          }
        },
      }),
    ]

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true))
    }

    const state = EditorState.create({
      doc: initialCode,
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
  }, [roomId, initialCode, readOnly, getLanguageExtension, language, onCodeChange])

  // Handle language changes
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(getLanguageExtension(language))
      })
    }
  }, [language, getLanguageExtension])

  // Handle remote updates
  useEffect(() => {
    if (onRemoteUpdate && pendingChangesRef.current) {
      const { code, version } = pendingChangesRef.current
      onRemoteUpdate(code, version)
      pendingChangesRef.current = null
    }
  }, [onRemoteUpdate])

  // Expose method to receive remote changes
  const receiveRemoteUpdate = useCallback((code: string, version: number) => {
    if (viewRef.current && version > versionRef.current) {
      const view = viewRef.current
      const currentDoc = view.state.doc.toString()
      if (currentDoc !== code) {
        // Calculate the diff and apply as a transaction
        const transaction = view.state.update({
          changes: { from: 0, to: currentDoc.length, insert: code }
        })
        view.dispatch(transaction)
        versionRef.current = version
      }
    }
  }, [])

  // Focus method
  const focus = useCallback(() => {
    viewRef.current?.focus()
  }, [])

  return (
    <div
      ref={editorRef}
      className="cm-editor flex-1 border border-border rounded-lg bg-background"
      data-client-id={clientId}
    />
  )
}

// Helper component for remote cursors (simplified)
export function RemoteCursors({ users, currentUserId }: { users: Array<{ sessionId: string; name: string; avatarId: number }>; currentUserId?: string }) {
  // This would integrate with CodeMirror's remote cursor support
  // Simplified for now
  return null
}