'use client'

import { useEffect, useRef, useState } from 'react'
import { PROMPT_TEMPLATES, DEFAULT_PROMPT } from '@/lib/prompts'
import { DEFAULT_RAG } from '@/lib/rag-content'

type SaveState = 'idle' | 'saved' | 'error'

export default function ConfigPage() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT)
  const [ragContent, setRagContent] = useState(DEFAULT_RAG)
  const [selectedTemplate, setSelectedTemplate] = useState('v1')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem('ct-system-prompt')
    const savedRag = localStorage.getItem('ct-rag-content')
    if (savedPrompt) setSystemPrompt(savedPrompt)
    if (savedRag) setRagContent(savedRag)
  }, [])

  function handleTemplateChange(templateId: string) {
    setSelectedTemplate(templateId)
    const template = PROMPT_TEMPLATES.find((t) => t.id === templateId)
    if (template) setSystemPrompt(template.content)
  }

  function handleSave() {
    try {
      localStorage.setItem('ct-system-prompt', systemPrompt)
      localStorage.setItem('ct-rag-content', ragContent)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  function handleReset() {
    setSystemPrompt(DEFAULT_PROMPT)
    setRagContent(DEFAULT_RAG)
    setSelectedTemplate('v1')
    localStorage.removeItem('ct-system-prompt')
    localStorage.removeItem('ct-rag-content')
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setRagContent((prev) => prev + '\n\n---\n\n' + text)
    }
    reader.readAsText(file)
    // Reset so same file can be re-uploaded
    e.target.value = ''
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8 gap-8">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ct-label">
          Konfiguration
        </p>
        <h1 className="text-2xl font-bold text-white">System Prompt & RAG</h1>
        <p className="text-sm text-ct-secondary">
          Änderungen werden im Browser gespeichert und beim nächsten Call verwendet.
        </p>
      </div>

      {/* System Prompt */}
      <section className="space-y-4 rounded-xl border border-ct-border bg-ct-dark p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">System Prompt</h2>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="rounded-lg border border-ct-border bg-ct-darkest text-sm text-ct-secondary px-3 py-1.5 focus:border-ct-primary focus:outline-none"
          >
            {PROMPT_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>

        <textarea
          value={systemPrompt}
          onChange={(e) => {
            setSystemPrompt(e.target.value)
            setSelectedTemplate('custom')
          }}
          rows={16}
          className="w-full rounded-lg border border-ct-border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-ct-secondary focus:border-ct-primary focus:outline-none resize-y font-mono leading-relaxed"
        />

        <p className="text-xs text-ct-label">
          {systemPrompt.length} Zeichen
        </p>
      </section>

      {/* RAG Content */}
      <section className="space-y-4 rounded-xl border border-ct-border bg-ct-dark p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">RAG – Knowledge Base</h2>
            <p className="text-xs text-ct-secondary mt-0.5">
              Produkt-Wissen das der Agent kennen soll (Preise, Einwände, Steuern)
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-ct-border text-sm text-ct-secondary px-3 py-1.5 hover:text-white hover:border-ct-primary transition-colors"
          >
            + Datei laden
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <textarea
          value={ragContent}
          onChange={(e) => setRagContent(e.target.value)}
          rows={20}
          className="w-full rounded-lg border border-ct-border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-ct-secondary focus:border-ct-primary focus:outline-none resize-y font-mono leading-relaxed"
        />

        <p className="text-xs text-ct-label">
          {ragContent.length} Zeichen
        </p>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pb-8">
        <button
          onClick={handleReset}
          className="rounded-lg border border-ct-border text-sm text-ct-secondary px-4 py-2.5 hover:text-white hover:border-ct-primary transition-colors"
        >
          Zurücksetzen
        </button>

        <button
          onClick={handleSave}
          className={`rounded-lg font-semibold px-8 py-2.5 text-sm transition-colors ${
            saveState === 'saved'
              ? 'bg-green-600 text-white'
              : saveState === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-ct-primary hover:bg-ct-primary-hover text-white'
          }`}
        >
          {saveState === 'saved' ? '✓ Gespeichert' : saveState === 'error' ? 'Fehler' : 'Speichern'}
        </button>
      </div>
    </div>
  )
}
