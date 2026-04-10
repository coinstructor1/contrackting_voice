'use client'

import { useEffect, useRef, useState } from 'react'
import { PROMPT_TEMPLATES, DEFAULT_PROMPT, resolvePrompt } from '@/lib/prompts'
import { DEFAULT_RAG } from '@/lib/rag-content'
import { OPENAI_VOICES, DEFAULT_VOICE, DEFAULT_AGENT_NAME } from '@/lib/voices'

type SaveState = 'idle' | 'saved' | 'error'
type VoiceTab = 'openai' | 'elevenlabs'

const GENDER_LABELS = {
  männlich: '♂',
  weiblich: '♀',
  neutral:  '◎',
}

export default function ConfigPage() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT)
  const [ragContent, setRagContent] = useState(DEFAULT_RAG)
  const [selectedTemplate, setSelectedTemplate] = useState('v1')
  const [agentName, setAgentName] = useState(DEFAULT_AGENT_NAME)
  const [openaiVoice, setOpenaiVoice] = useState(DEFAULT_VOICE)
  const [voiceTab, setVoiceTab] = useState<VoiceTab>('openai')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedPrompt      = localStorage.getItem('ct-system-prompt')
    const savedRag         = localStorage.getItem('ct-rag-content')
    const savedName        = localStorage.getItem('ct-agent-name')
    const savedOpenaiVoice = localStorage.getItem('ct-openai-voice')
    const savedVariant     = localStorage.getItem('ct-prompt-variant')
    const name = savedName ?? DEFAULT_AGENT_NAME
    if (savedName)        setAgentName(savedName)
    if (savedOpenaiVoice) setOpenaiVoice(savedOpenaiVoice)
    if (savedVariant)     setSelectedTemplate(savedVariant)
    if (savedRag)         setRagContent(savedRag)
    // Prompt: gespeicherte Version laden, sonst Default mit aufgelöstem Namen
    if (savedPrompt) {
      setSystemPrompt(savedPrompt)
    } else {
      setSystemPrompt(resolvePrompt(DEFAULT_PROMPT, name))
    }
  }, [])

  function handleTemplateChange(templateId: string) {
    setSelectedTemplate(templateId)
    const template = PROMPT_TEMPLATES.find((t) => t.id === templateId)
    if (template) setSystemPrompt(resolvePrompt(template.content, agentName))
  }

  function handleAgentNameChange(name: string) {
    setAgentName(name)
    // Platzhalter im aktuellen Prompt live ersetzen (nur bei Standard-Templates)
    if (selectedTemplate !== 'custom') {
      const template = PROMPT_TEMPLATES.find((t) => t.id === selectedTemplate)
      if (template) setSystemPrompt(resolvePrompt(template.content, name))
    }
  }

  function handleSave() {
    try {
      localStorage.setItem('ct-system-prompt',  systemPrompt)
      localStorage.setItem('ct-rag-content',    ragContent)
      localStorage.setItem('ct-agent-name',     agentName)
      localStorage.setItem('ct-openai-voice',   openaiVoice)
      localStorage.setItem('ct-prompt-variant', selectedTemplate)
      // ct-elevenlabs-voice wird in Phase 4 ergänzt
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  function handleReset() {
    setSystemPrompt(resolvePrompt(DEFAULT_PROMPT, DEFAULT_AGENT_NAME))
    setRagContent(DEFAULT_RAG)
    setAgentName(DEFAULT_AGENT_NAME)
    setOpenaiVoice(DEFAULT_VOICE)
    setSelectedTemplate('v1')
    localStorage.removeItem('ct-system-prompt')
    localStorage.removeItem('ct-rag-content')
    localStorage.removeItem('ct-agent-name')
    localStorage.removeItem('ct-openai-voice')
    localStorage.removeItem('ct-prompt-variant')
    localStorage.removeItem('ct-elevenlabs-voice')
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
    e.target.value = ''
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8 gap-8">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ct-label">
          Konfiguration
        </p>
        <h1 className="text-2xl font-bold text-white">Agent & Prompts</h1>
        <p className="text-sm text-ct-secondary">
          Änderungen werden im Browser gespeichert und beim nächsten Call verwendet.
        </p>
      </div>

      {/* Agent Voice & Name */}
      <section className="space-y-5 rounded-xl border border-ct-border bg-ct-dark p-6">
        <h2 className="font-semibold text-white">Agent – Voice & Name</h2>

        {/* Agent Name – gilt für beide Provider */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ct-secondary">
            Agent-Name <span className="text-ct-label">(gilt für beide Provider)</span>
          </label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => handleAgentNameChange(e.target.value)}
            placeholder="z.B. Luca"
            className="w-full rounded-lg border border-ct-border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-ct-label focus:border-ct-primary focus:outline-none"
          />
        </div>

        {/* Provider Tabs für Voice */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-ct-secondary">Voice</label>
            <div className="flex rounded-lg border border-ct-border overflow-hidden text-xs">
              {(['openai', 'elevenlabs'] as VoiceTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setVoiceTab(tab)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    voiceTab === tab
                      ? 'bg-ct-primary text-white'
                      : 'bg-ct-dark text-ct-secondary hover:text-white'
                  }`}
                >
                  {tab === 'openai' ? 'OpenAI' : 'ElevenLabs'}
                </button>
              ))}
            </div>
          </div>

          {/* OpenAI Voices */}
          {voiceTab === 'openai' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OPENAI_VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setOpenaiVoice(v.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-all ${
                      openaiVoice === v.id
                        ? 'border-ct-primary bg-ct-primary/10 text-white'
                        : 'border-ct-border text-ct-secondary hover:border-ct-primary/50 hover:text-white'
                    }`}
                  >
                    <span className="text-xs text-ct-label w-4 shrink-0">
                      {GENDER_LABELS[v.gender]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-none">{v.label}</p>
                      <p className="text-xs text-ct-label mt-0.5 truncate">{v.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-ct-label">
                ♂ männlich · ♀ weiblich · ◎ neutral &nbsp;|&nbsp;
                Aktuell: <span className="text-ct-primary font-medium">{openaiVoice}</span>
              </p>
            </div>
          )}

          {/* ElevenLabs – Placeholder Phase 4 */}
          {voiceTab === 'elevenlabs' && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ct-border py-10 text-center">
              <span className="text-2xl">🔜</span>
              <p className="text-sm font-medium text-ct-secondary">Folgt in Phase 4</p>
              <p className="text-xs text-ct-label max-w-xs">
                ElevenLabs Voices werden in Phase 4 integriert. Die Auswahl funktioniert
                dann über Agent-ID oder Voice-ID aus dem ElevenLabs Dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

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
              <option key={t.id} value={t.id}>{t.label}</option>
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
        <p className="text-xs text-ct-label">{systemPrompt.length} Zeichen</p>
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
