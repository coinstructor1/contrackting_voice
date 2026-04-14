'use client'

import { useEffect, useRef, useState } from 'react'
import { PROMPT_TEMPLATES, DEFAULT_PROMPT, resolvePrompt } from '@/lib/prompts'
import { DEFAULT_RAG } from '@/lib/rag-content'
import { DEFAULT_AGENT_NAME } from '@/lib/voices'
import { OPENAI_REALTIME_MODELS, DEFAULT_MODEL, tierIcon } from '@/lib/models'

type SaveState = 'idle' | 'saved' | 'error'

export default function ConfigPage() {
  const [agentName, setAgentName] = useState(DEFAULT_AGENT_NAME)
  const [openaiModel, setOpenaiModel] = useState(DEFAULT_MODEL)
  const [ragContent, setRagContent] = useState(DEFAULT_RAG)
  const [selectedTemplate, setSelectedTemplate] = useState('v1')
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const v = (key: string) => localStorage.getItem(key)
    if (v('ct-agent-name'))    setAgentName(v('ct-agent-name')!)
    if (v('ct-openai-model'))  setOpenaiModel(v('ct-openai-model')!)
    if (v('ct-rag-content'))   setRagContent(v('ct-rag-content')!)
    if (v('ct-prompt-variant')) setSelectedTemplate(v('ct-prompt-variant')!)
    if (v('ct-system-prompt')) setSystemPrompt(v('ct-system-prompt')!)
    else setSystemPrompt(resolvePrompt(DEFAULT_PROMPT, v('ct-agent-name') ?? DEFAULT_AGENT_NAME))
  }, [])

  function handleTemplateChange(templateId: string) {
    setSelectedTemplate(templateId)
    const template = PROMPT_TEMPLATES.find((t) => t.id === templateId)
    if (template) setSystemPrompt(resolvePrompt(template.content, agentName))
  }

  function handleAgentNameChange(name: string) {
    setAgentName(name)
    if (selectedTemplate !== 'custom') {
      const template = PROMPT_TEMPLATES.find((t) => t.id === selectedTemplate)
      if (template) setSystemPrompt(resolvePrompt(template.content, name))
    }
  }

  function handleSave() {
    try {
      localStorage.setItem('ct-agent-name',     agentName)
      localStorage.setItem('ct-openai-model',   openaiModel)
      localStorage.setItem('ct-rag-content',    ragContent)
      localStorage.setItem('ct-prompt-variant', selectedTemplate)
      localStorage.setItem('ct-system-prompt',  systemPrompt)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  function handleReset() {
    const name = DEFAULT_AGENT_NAME
    setAgentName(name)
    setOpenaiModel(DEFAULT_MODEL)
    setRagContent(DEFAULT_RAG)
    setSelectedTemplate('v1')
    setSystemPrompt(resolvePrompt(DEFAULT_PROMPT, name))
    ;['ct-agent-name','ct-openai-model','ct-rag-content','ct-prompt-variant','ct-system-prompt'].forEach(
      (k) => localStorage.removeItem(k)
    )
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setRagContent((prev) => prev + '\n\n---\n\n' + (ev.target?.result as string))
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8 gap-8">

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ct-label">Konfiguration</p>
        <h1 className="text-2xl font-bold text-white">Erweiterte Einstellungen</h1>
        <p className="text-sm text-ct-secondary">
          Provider, Voice und Prompt-Variante wählst du direkt vor jedem Call auf der{' '}
          <a href="/call" className="text-ct-primary hover:underline">Call-Seite</a>.
        </p>
      </div>

      {/* Agent Name */}
      <section className="space-y-4 rounded-xl border border-ct-border bg-ct-dark p-6">
        <h2 className="font-semibold text-white">Agent-Name</h2>
        <input
          type="text"
          value={agentName}
          onChange={(e) => handleAgentNameChange(e.target.value)}
          placeholder="z.B. Luca"
          className="w-full rounded-lg border border-ct-border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-ct-label focus:border-ct-primary focus:outline-none"
        />
        <p className="text-xs text-ct-label">Wird im System Prompt als {'{{'+'AGENT_NAME'+'}}'} eingesetzt.</p>
      </section>

      {/* OpenAI Model */}
      <section className="space-y-4 rounded-xl border border-ct-border bg-ct-dark p-6">
        <div>
          <h2 className="font-semibold text-white">OpenAI Model</h2>
          <p className="text-xs text-ct-secondary mt-0.5">Nur Realtime-fähige Modelle.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OPENAI_REALTIME_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setOpenaiModel(m.id)}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                openaiModel === m.id
                  ? 'border-ct-primary bg-ct-primary/10 text-white'
                  : 'border-ct-border text-ct-secondary hover:border-ct-primary/50 hover:text-white'
              }`}
            >
              <span className="text-sm mt-0.5 shrink-0">{tierIcon(m.tier)}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-xs text-ct-label mt-0.5">{m.description}</p>
                <p className="text-xs text-ct-label/60 mt-0.5 font-mono truncate">{m.id}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-ct-label">
          ★ beste Qualität · ◆ ausgewogen · ◇ günstig &nbsp;|&nbsp;
          Aktuell: <span className="text-ct-primary font-medium">{openaiModel}</span>
        </p>
      </section>

      {/* System Prompt */}
      <section className="space-y-4 rounded-xl border border-ct-border bg-ct-dark p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Prompt-Templates bearbeiten</h2>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="rounded-lg border border-ct-border bg-ct-darkest text-sm text-ct-secondary px-3 py-1.5 focus:border-ct-primary focus:outline-none"
          >
            {PROMPT_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <textarea
          value={systemPrompt}
          onChange={(e) => { setSystemPrompt(e.target.value); setSelectedTemplate('custom') }}
          rows={16}
          className="w-full rounded-lg border border-ct-border bg-white/5 px-4 py-3 text-sm text-white focus:border-ct-primary focus:outline-none resize-y font-mono leading-relaxed"
        />
        <p className="text-xs text-ct-label">{systemPrompt.length} Zeichen</p>
      </section>

      {/* RAG */}
      <section className="space-y-4 rounded-xl border border-ct-border bg-ct-dark p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">RAG – Knowledge Base</h2>
            <p className="text-xs text-ct-secondary mt-0.5">Produkt-Wissen das der Agent kennen soll</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-ct-border text-sm text-ct-secondary px-3 py-1.5 hover:text-white hover:border-ct-primary transition-colors"
          >
            + Datei laden
          </button>
          <input ref={fileInputRef} type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
        </div>
        <textarea
          value={ragContent}
          onChange={(e) => setRagContent(e.target.value)}
          rows={20}
          className="w-full rounded-lg border border-ct-border bg-white/5 px-4 py-3 text-sm text-white focus:border-ct-primary focus:outline-none resize-y font-mono leading-relaxed"
        />
        <p className="text-xs text-ct-label">{ragContent.length} Zeichen</p>
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
            saveState === 'saved' ? 'bg-green-600 text-white'
            : saveState === 'error' ? 'bg-red-600 text-white'
            : 'bg-ct-primary hover:bg-ct-primary-hover text-white'
          }`}
        >
          {saveState === 'saved' ? '✓ Gespeichert' : saveState === 'error' ? 'Fehler' : 'Speichern'}
        </button>
      </div>
    </div>
  )
}
