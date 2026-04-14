'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import TranscriptView, { type TranscriptMessage } from '@/components/TranscriptView'
import RatingForm from '@/components/RatingForm'
import ErrorBanner from '@/components/ErrorBanner'
import { createSession, updateSessionStatus, updateSessionEnd, addTranscript, type Provider, type Scenario } from '@/lib/supabase'
import { PROMPT_TEMPLATES, resolvePrompt } from '@/lib/prompts'
import { DEFAULT_RAG } from '@/lib/rag-content'
import { OPENAI_VOICES, DEFAULT_VOICE, DEFAULT_AGENT_NAME } from '@/lib/voices'
import { DEFAULT_MODEL } from '@/lib/models'
import { useOpenAICall } from '@/hooks/useOpenAICall'
import { useElevenLabsCall } from '@/hooks/useElevenLabsCall'

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error'

const DEFAULT_EL_AGENT_ID = 'agent_6801kp096a36egv9pyj48exq0y25'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function CallPage() {
  // Call state
  const [status, setStatus] = useState<CallStatus>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showRating, setShowRating] = useState(false)
  const [duration, setDuration] = useState(0)
  const [emailSent, setEmailSent] = useState(false)
  const [emailConfirm, setEmailConfirm] = useState<{ email: string; resolve: (v: boolean) => void } | null>(null)

  // Pre-call config
  const [provider, setProvider] = useState<Provider>('openai')
  const [openaiVoice, setOpenaiVoice] = useState(DEFAULT_VOICE)
  const [elevenlabsAgentId, setElevenlabsAgentId] = useState(DEFAULT_EL_AGENT_ID)
  const [promptVariant, setPromptVariant] = useState('v1')
  const [customPrompt, setCustomPrompt] = useState('')
  const [scenario, setScenario] = useState<Scenario>('A_interessiert')
  const [testerName, setTesterName] = useState('')

  // From config (rarely changed)
  const [agentName, setAgentName] = useState(DEFAULT_AGENT_NAME)
  const [openaiModel, setOpenaiModel] = useState(DEFAULT_MODEL)
  const [ragContent, setRagContent] = useState(DEFAULT_RAG)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionIdRef = useRef<string | null>(null)

  // Load from localStorage
  useEffect(() => {
    const v = (key: string) => localStorage.getItem(key)
    if (v('ct-openai-voice'))       setOpenaiVoice(v('ct-openai-voice')!)
    if (v('ct-elevenlabs-agent-id')) setElevenlabsAgentId(v('ct-elevenlabs-agent-id')!)
    if (v('ct-prompt-variant'))     setPromptVariant(v('ct-prompt-variant')!)
    if (v('ct-custom-prompt'))      setCustomPrompt(v('ct-custom-prompt')!)
    if (v('ct-agent-name'))         setAgentName(v('ct-agent-name')!)
    if (v('ct-openai-model'))       setOpenaiModel(v('ct-openai-model')!)
    if (v('ct-rag-content'))        setRagContent(v('ct-rag-content')!)
  }, [])

  // Persist quick-config to localStorage on change
  useEffect(() => { localStorage.setItem('ct-openai-voice', openaiVoice) }, [openaiVoice])
  useEffect(() => { localStorage.setItem('ct-elevenlabs-agent-id', elevenlabsAgentId) }, [elevenlabsAgentId])
  useEffect(() => { localStorage.setItem('ct-prompt-variant', promptVariant) }, [promptVariant])
  useEffect(() => { localStorage.setItem('ct-custom-prompt', customPrompt) }, [customPrompt])

  // Timer
  useEffect(() => {
    if (status === 'active') {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (status === 'idle') setDuration(0)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [status])

  // Resolve active system prompt
  function getSystemPrompt(): string {
    if (promptVariant === 'custom') return customPrompt
    const template = PROMPT_TEMPLATES.find((t) => t.id === promptVariant)
    return template ? resolvePrompt(template.content, agentName) : customPrompt
  }

  const addTranscriptMessage = useCallback(
    async (role: 'agent' | 'user', content: string) => {
      const msg: TranscriptMessage = { id: crypto.randomUUID(), role, content, timestamp: new Date() }
      setTranscripts((prev) => [...prev, msg])
      if (sessionIdRef.current) {
        await addTranscript(sessionIdRef.current, role, content).catch(console.error)
      }
    }, []
  )

  async function handleUnexpectedDisconnect() {
    setStatus('error')
    setError('Verbindung unterbrochen – das Transkript wurde gespeichert. Du kannst den Call neu starten.')
    if (sessionIdRef.current) {
      await updateSessionStatus(sessionIdRef.current, 'error').catch(console.error)
      await updateSessionEnd(sessionIdRef.current, { callDurationSeconds: duration }).catch(console.error)
    }
  }

  function requestEmailConfirm(normalizedEmail: string): Promise<boolean> {
    return new Promise((resolve) => setEmailConfirm({ email: normalizedEmail, resolve }))
  }

  const openAICall = useOpenAICall({
    onTranscript: addTranscriptMessage,
    onError: (msg) => { setError(msg); setStatus('error') },
    onDisconnect: handleUnexpectedDisconnect,
    onEmailSent: () => setEmailSent(true),
    onEmailConfirmRequest: requestEmailConfirm,
  })

  const elevenlabsCall = useElevenLabsCall({
    onTranscript: addTranscriptMessage,
    onError: (msg) => { setError(msg); setStatus('error') },
    onDisconnect: handleUnexpectedDisconnect,
    onEmailSent: () => setEmailSent(true),
    onEmailConfirmRequest: requestEmailConfirm,
  })

  async function handleStartCall() {
    setError(null)
    setTranscripts([])
    setDuration(0)
    setEmailSent(false)
    setEmailConfirm(null)
    setStatus('connecting')

    if (typeof RTCPeerConnection === 'undefined') {
      setError('Dein Browser unterstützt kein WebRTC. Bitte Chrome oder Firefox verwenden.')
      setStatus('error')
      return
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err) {
      const name = err instanceof Error ? err.name : ''
      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError('Kein Mikrofon gefunden. Bitte ein Audio-Eingabegerät anschließen.')
      } else if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError('Mikrofon-Zugriff verweigert. Bitte in den Browser-Einstellungen erlauben und die Seite neu laden.')
      } else {
        setError('Mikrofon konnte nicht gestartet werden. Bitte Gerät und Browser-Einstellungen prüfen.')
      }
      setStatus('error')
      return
    }

    const systemPrompt = getSystemPrompt()

    let sid: string
    try {
      const session = await createSession({
        provider,
        systemPrompt,
        ragContent,
        voiceId:       provider === 'openai' ? openaiVoice : null,
        agentName,
        promptVariant,
        model:         provider === 'openai' ? openaiModel : null,
        scenario,
        testerName:    testerName.trim() || null,
      })
      sid = session.id
      setSessionId(sid)
      sessionIdRef.current = sid
    } catch (err) {
      setError('Session konnte nicht erstellt werden. Supabase-Verbindung prüfen.')
      setStatus('error')
      console.error(err)
      return
    }

    try {
      if (provider === 'openai') {
        await openAICall.start(systemPrompt, ragContent, openaiVoice, openaiModel)
      } else {
        const firstMessage = `Hallo, mein Name ist ${agentName} von CoinTracking. Wie kann ich Ihnen heute helfen?`
        await elevenlabsCall.start(elevenlabsAgentId, systemPrompt, firstMessage)
      }
      setStatus('active')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler beim Verbinden'
      setError(msg)
      setStatus('error')
      await updateSessionStatus(sid, 'error').catch(console.error)
    }
  }

  async function handleEndCall() {
    if (provider === 'openai') openAICall.stop()
    else elevenlabsCall.stop()
    setStatus('ended')
    if (sessionIdRef.current) {
      await updateSessionStatus(sessionIdRef.current, 'completed').catch(console.error)
      await updateSessionEnd(sessionIdRef.current, { callDurationSeconds: duration }).catch(console.error)
    }
    setShowRating(true)
  }

  const isIdle = status === 'idle' || status === 'error'
  const isActive = status === 'active' || status === 'connecting'

  const statusLabel: Record<CallStatus, string> = {
    idle: 'Bereit', connecting: 'Verbinden...', active: 'Call läuft', ended: 'Beendet', error: 'Fehler',
  }
  const statusColor: Record<CallStatus, string> = {
    idle: 'text-ct-secondary', connecting: 'text-yellow-400', active: 'text-green-400',
    ended: 'text-ct-secondary', error: 'text-red-400',
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-2xl mx-auto w-full gap-6">

      {error && <div className="w-full"><ErrorBanner message={error} onDismiss={() => setError(null)} /></div>}

      {/* ── Pre-Call Config ── */}
      {isIdle && !showRating && (
        <div className="w-full rounded-xl border border-ct-border bg-ct-dark p-6 space-y-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-ct-label">Call konfigurieren</h2>

          {/* Provider */}
          <div className="space-y-1.5">
            <label className="text-xs text-ct-label font-medium uppercase tracking-wider">Provider</label>
            <div className="flex rounded-lg border border-ct-border overflow-hidden text-sm">
              {(['openai', 'elevenlabs'] as Provider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`flex-1 py-2 font-medium transition-colors ${
                    provider === p ? 'bg-ct-primary text-white' : 'bg-ct-darkest text-ct-secondary hover:text-white'
                  }`}
                >
                  {p === 'openai' ? 'OpenAI' : 'ElevenLabs'}
                </button>
              ))}
            </div>
          </div>

          {/* Voice / Agent ID */}
          {provider === 'openai' ? (
            <div className="space-y-1.5">
              <label className="text-xs text-ct-label font-medium uppercase tracking-wider">Voice</label>
              <select
                value={openaiVoice}
                onChange={(e) => setOpenaiVoice(e.target.value)}
                className="w-full rounded-lg border border-ct-border bg-ct-darkest px-3 py-2 text-sm text-white focus:border-ct-primary focus:outline-none"
              >
                {OPENAI_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>{v.label} – {v.description}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs text-ct-label font-medium uppercase tracking-wider">Agent-ID</label>
              <input
                type="text"
                value={elevenlabsAgentId}
                onChange={(e) => setElevenlabsAgentId(e.target.value.trim())}
                placeholder="agent_..."
                className="w-full rounded-lg border border-ct-border bg-ct-darkest px-3 py-2 text-sm text-white font-mono placeholder:text-ct-label focus:border-ct-primary focus:outline-none"
              />
            </div>
          )}

          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs text-ct-label font-medium uppercase tracking-wider">System Prompt</label>
            <select
              value={promptVariant}
              onChange={(e) => setPromptVariant(e.target.value)}
              className="w-full rounded-lg border border-ct-border bg-ct-darkest px-3 py-2 text-sm text-white focus:border-ct-primary focus:outline-none"
            >
              {PROMPT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
              <option value="custom">Custom</option>
            </select>
            {promptVariant === 'custom' && (
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="System Prompt eingeben..."
                rows={8}
                className="w-full rounded-lg border border-ct-border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-ct-label focus:border-ct-primary focus:outline-none resize-y font-mono leading-relaxed mt-2"
              />
            )}
          </div>

          {/* Scenario + Tester */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-ct-label font-medium uppercase tracking-wider">Szenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as Scenario)}
                className="w-full rounded-lg border border-ct-border bg-ct-darkest px-3 py-2 text-sm text-white focus:border-ct-primary focus:outline-none"
              >
                <option value="A_interessiert">A – Interessiert</option>
                <option value="B_skeptiker">B – Skeptiker</option>
                <option value="C_preissensitiv">C – Preissensitiv</option>
                <option value="D_vieltrader">D – Vieltrader</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-ct-label font-medium uppercase tracking-wider">Tester</label>
              <input
                type="text"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                placeholder="Dein Name"
                className="w-full rounded-lg border border-ct-border bg-ct-darkest px-3 py-2 text-sm text-white placeholder:text-ct-label focus:border-ct-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleStartCall}
            className="w-full rounded-lg bg-ct-primary hover:bg-ct-primary-hover text-white font-semibold py-3 transition-colors"
          >
            Call starten
          </button>

          <p className="text-xs text-ct-label text-center">
            RAG, Modell & Prompt-Inhalte unter{' '}
            <a href="/config" className="text-ct-primary hover:underline">/config</a>
          </p>
        </div>
      )}

      {/* ── Active Call ── */}
      {isActive && (
        <div className="w-full rounded-xl border border-ct-border bg-ct-dark p-8 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ct-label">
              {agentName} · {provider === 'openai' ? `OpenAI / ${openaiVoice}` : `ElevenLabs`}
            </span>
            <span className={`text-sm font-medium uppercase tracking-wider ${statusColor[status]}`}>
              {statusLabel[status]}
            </span>
            {status === 'active' && (
              <span className="text-3xl font-mono font-bold text-white">{formatDuration(duration)}</span>
            )}
          </div>

          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all ${
            status === 'active'
              ? 'bg-ct-primary shadow-[0_0_30px_rgba(26,144,217,0.4)] animate-pulse'
              : 'bg-ct-teal animate-pulse'
          }`}>
            🎙️
          </div>

          {emailSent && (
            <div className="w-full rounded-lg border border-ct-teal/40 bg-ct-teal/10 px-4 py-2 text-sm text-ct-teal text-center">
              Upgrade-Link wurde versendet
            </div>
          )}

          <button
            onClick={handleEndCall}
            className="rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 transition-colors"
          >
            Call beenden
          </button>
        </div>
      )}

      {/* ── Rating Form ── */}
      {showRating && sessionId && (
        <div className="w-full rounded-xl border border-ct-border bg-ct-dark p-8">
          <RatingForm
            sessionId={sessionId}
            emailAttempted={emailSent}
            onSubmitted={() => {
              setShowRating(false)
              setStatus('idle')
              setSessionId(null)
              sessionIdRef.current = null
              setTranscripts([])
            }}
          />
        </div>
      )}

      {/* ── Email Confirmation Modal ── */}
      {emailConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="rounded-xl border border-ct-border bg-ct-dark p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-ct-label">Agent möchte E-Mail senden</p>
              <p className="text-white font-semibold text-lg">{emailConfirm.email}</p>
              <p className="text-xs text-ct-secondary">Ist diese Adresse korrekt?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { emailConfirm.resolve(true); setEmailConfirm(null) }}
                className="flex-1 rounded-lg bg-ct-primary hover:bg-ct-primary-hover text-white font-semibold py-2.5 text-sm transition-colors"
              >
                Ja, absenden
              </button>
              <button
                onClick={() => { emailConfirm.resolve(false); setEmailConfirm(null) }}
                className="flex-1 rounded-lg border border-ct-border text-ct-secondary hover:text-white hover:border-ct-primary py-2.5 text-sm transition-colors"
              >
                Nein, korrigieren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Transcript ── */}
      {(status === 'active' || status === 'ended' || transcripts.length > 0) && !showRating && (
        <div className="w-full rounded-xl border border-ct-border bg-ct-dark p-6 space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-ct-label">Live Transkript</h2>
          <TranscriptView messages={transcripts} />
        </div>
      )}
    </div>
  )
}
