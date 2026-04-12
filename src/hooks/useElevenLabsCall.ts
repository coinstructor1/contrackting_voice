import { useRef } from 'react'
import { Conversation } from '@elevenlabs/client'

interface ElevenLabsCallCallbacks {
  onTranscript: (role: 'agent' | 'user', content: string) => void
  onError: (message: string) => void
}

export function useElevenLabsCall({ onTranscript, onError }: ElevenLabsCallCallbacks) {
  const conversationRef = useRef<{ endSession: () => Promise<void> } | null>(null)

  async function start(agentId: string, systemPrompt: string, firstMessage?: string): Promise<void> {
    // 1. Signed URL vom Server holen
    const tokenRes = await fetch('/api/elevenlabs-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId }),
    })

    if (!tokenRes.ok) {
      const { error } = await tokenRes.json()
      throw new Error(`ElevenLabs Token-Fehler: ${error ?? tokenRes.statusText}`)
    }

    const { signedUrl } = await tokenRes.json()

    // 2. Conversation Session starten
    const conversation = await Conversation.startSession({
      signedUrl,
      overrides: {
        agent: {
          prompt: { prompt: systemPrompt },
          ...(firstMessage ? { firstMessage } : {}),
        },
      },
      onMessage: ({ message, role }) => {
        onTranscript(role === 'agent' ? 'agent' : 'user', message)
      },
      onError: (msg) => {
        onError(typeof msg === 'string' ? msg : 'ElevenLabs Fehler')
      },
      onDisconnect: () => {
        conversationRef.current = null
      },
    })

    conversationRef.current = conversation
  }

  function stop() {
    conversationRef.current?.endSession().catch(console.error)
    conversationRef.current = null
  }

  return { start, stop }
}
