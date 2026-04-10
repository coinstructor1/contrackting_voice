import { NextRequest } from 'next/server'
import { DEFAULT_MODEL } from '@/lib/models'

export async function POST(req: NextRequest) {
  const { systemPrompt, ragContent, voice, model } = await req.json()

  const selectedModel = model ?? DEFAULT_MODEL

  const instructions = [systemPrompt, ragContent]
    .filter(Boolean)
    .join('\n\n---\n\n')

  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: selectedModel,
      voice: voice ?? 'echo',
      instructions,
      input_audio_transcription: { model: 'whisper-1' },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 600,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    return Response.json({ error }, { status: response.status })
  }

  const data = await response.json()
  // Model zurückgeben damit der Hook die WebRTC-URL korrekt bauen kann
  return Response.json({ token: data.client_secret.value, model: selectedModel })
}
