'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import ProviderSelector from '@/components/ProviderSelector'
import TranscriptView, { type TranscriptMessage } from '@/components/TranscriptView'
import RatingForm from '@/components/RatingForm'
import ErrorBanner from '@/components/ErrorBanner'
import { createSession, updateSessionStatus, addTranscript, type Provider } from '@/lib/supabase'
import { DEFAULT_PROMPT } from '@/lib/prompts'
import { DEFAULT_RAG } from '@/lib/rag-content'
import { DEFAULT_VOICE, DEFAULT_AGENT_NAME } from '@/lib/voices'
import { useOpenAICall } from '@/hooks/useOpenAICall'

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function CallPage() {
  const [provider, setProvider] = useState<Provider>('openai')
  const [status, setStatus] = useState<CallStatus>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showRating, setShowRating] = useState(false)
  const [duration, setDuration] = useState(0)
  const [systemPrompt, setSystemPromptState] = useState(DEFAULT_PROMPT)
  const [ragContent, setRagContentState] = useState(DEFAULT_RAG)
  const [agentName, setAgentName] = useState(DEFAULT_AGENT_NAME)
  const [promptVariant, setPromptVariant] = useState('v1')
  // Provider-spezifische Voices – getrennt gespeichert
  const [openaiVoice, setOpenaiVoice] = useState(DEFAULT_VOICE)
  const [elevenlabsVoice, setElevenlabsVoice] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionIdRef = useRef<string | null>(null)

  const addTranscriptMessage = useCallback(
    async (role: 'agent' | 'user', content: string) => {
      const msg: TranscriptMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
      }
      setTranscripts((prev) => [...prev, msg])
      if (sessionIdRef.current) {
        await addTranscript(sessionIdRef.current, role, content).catch(console.error)
      }
    },
    []
  )

  const openAICall = useOpenAICall({
    onTranscript: addTranscriptMessage,
    onError: (msg) => {
      setError(msg)
      setStatus('error')
    },
  })

  // Read config from localStorage
  useEffect(() => {
    const savedPrompt      = localStorage.getItem('ct-system-prompt')
    const savedRag         = localStorage.getItem('ct-rag-content')
    const savedName        = localStorage.getItem('ct-agent-name')
    const savedOpenaiVoice = localStorage.getItem('ct-openai-voice')
    const savedElVoice     = localStorage.getItem('ct-elevenlabs-voice')
    const savedVariant     = localStorage.getItem('ct-prompt-variant')
    if (savedPrompt)      setSystemPromptState(savedPrompt)
    if (savedRag)         setRagContentState(savedRag)
    if (savedName)        setAgentName(savedName)
    if (savedOpenaiVoice) setOpenaiVoice(savedOpenaiVoice)
    if (savedElVoice)     setElevenlabsVoice(savedElVoice)
    if (savedVariant)     setPromptVariant(savedVariant)
  }, [])

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

  // Aktive Voice-Info je nach gewähltem Provider
  const activeVoiceLabel =
    provider === 'openai'
      ? openaiVoice
      : elevenlabsVoice ?? 'Folgt in Phase 4'

  async function handleStartCall() {
    setError(null)
    setTranscripts([])
    setDuration(0)
    setStatus('connecting')

    // Mikrofon-Check
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError('Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.')
      setStatus('error')
      return
    }

    // Supabase Session erstellen
    let sid: string
    try {
      const session = await createSession({
        provider,
        systemPrompt,
        ragContent,
        voiceId:       provider === 'openai' ? openaiVoice : elevenlabsVoice,
        agentName,
        promptVariant,
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

    // Provider-spezifischen Call starten
    try {
      if (provider === 'openai') {
        await startOpenAICall(sid, systemPrompt, ragContent)
      } else {
        await startElevenLabsCall(sid, systemPrompt, ragContent)
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
    stopActiveCall()
    setStatus('ended')
    if (sessionIdRef.current) {
      await updateSessionStatus(sessionIdRef.current, 'completed').catch(console.error)
    }
    setShowRating(true)
  }

  // ─── OpenAI Realtime ─────────────────────────────────────────────────────
  async function startOpenAICall(_sid: string, prompt: string, rag: string) {
    await openAICall.start(prompt, rag, openaiVoice)
  }

  // ─── ElevenLabs (Phase 4) ────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function startElevenLabsCall(_sid: string, _prompt: string, _rag: string) {
    // TODO: Phase 4 – ElevenLabs Integration
    throw new Error('ElevenLabs Integration folgt in Phase 4')
  }

  function stopActiveCall() {
    if (provider === 'openai') openAICall.stop()
    // ElevenLabs: Phase 4
  }

  const statusLabel: Record<CallStatus, string> = {
    idle:       'Bereit',
    connecting: 'Verbinden...',
    active:     'Call läuft',
    ended:      'Beendet',
    error:      'Fehler',
  }

  const statusColor: Record<CallStatus, string> = {
    idle:       'text-ct-secondary',
    connecting: 'text-yellow-400',
    active:     'text-green-400',
    ended:      'text-ct-secondary',
    error:      'text-red-400',
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-2xl mx-auto w-full gap-6">

      {/* Provider Selector */}
      <div className="w-full flex items-center gap-4">
        <span className="text-sm text-ct-secondary shrink-0">Provider:</span>
        <ProviderSelector
          value={provider}
          onChange={setProvider}
          disabled={status === 'active' || status === 'connecting'}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="w-full">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Call Card */}
      {!showRating && (
        <div className="w-full rounded-xl border border-ct-border bg-ct-dark p-8 flex flex-col items-center gap-6">

          {/* Agent Info */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ct-label">
              Agent: {agentName}
            </span>
            <span className="text-xs text-ct-label">
              {provider === 'openai' ? 'OpenAI' : 'ElevenLabs'} · Voice:{' '}
              <span className={elevenlabsVoice === null && provider === 'elevenlabs' ? 'text-yellow-500' : 'text-ct-primary'}>
                {activeVoiceLabel}
              </span>
            </span>
            <span className={`text-sm font-medium uppercase tracking-wider mt-1 ${statusColor[status]}`}>
              {statusLabel[status]}
            </span>
            {status === 'active' && (
              <span className="text-3xl font-mono font-bold text-white">
                {formatDuration(duration)}
              </span>
            )}
          </div>

          {/* Mic Icon */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all ${
              status === 'active'
                ? 'bg-ct-primary shadow-[0_0_30px_rgba(26,144,217,0.4)] animate-pulse'
                : status === 'connecting'
                ? 'bg-ct-teal animate-pulse'
                : 'bg-ct-darkest'
            }`}
          >
            🎙️
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {(status === 'idle' || status === 'error' || status === 'ended') && (
              <button
                onClick={handleStartCall}
                className="rounded-lg bg-ct-primary hover:bg-ct-primary-hover text-white font-semibold px-8 py-3 transition-colors"
              >
                Call starten
              </button>
            )}
            {(status === 'active' || status === 'connecting') && (
              <button
                onClick={handleEndCall}
                className="rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 transition-colors"
              >
                Call beenden
              </button>
            )}
          </div>

          {/* Config link */}
          {status === 'idle' && (
            <p className="text-xs text-ct-label">
              Voice & Prompt konfigurierbar unter{' '}
              <a href="/config" className="text-ct-primary hover:underline">/config</a>
            </p>
          )}
        </div>
      )}

      {/* Rating Form */}
      {showRating && sessionId && (
        <div className="w-full rounded-xl border border-ct-border bg-ct-dark p-8">
          <RatingForm
            sessionId={sessionId}
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

      {/* Transcript */}
      {(status === 'active' || status === 'ended' || transcripts.length > 0) && !showRating && (
        <div className="w-full rounded-xl border border-ct-border bg-ct-dark p-6 space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-ct-label">
            Live Transkript
          </h2>
          <TranscriptView messages={transcripts} />
        </div>
      )}
    </div>
  )
}
