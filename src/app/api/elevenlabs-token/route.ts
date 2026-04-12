import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { agentId } = await req.json()

  if (!agentId) {
    return Response.json({ error: 'agentId fehlt' }, { status: 400 })
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
    {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY ?? '',
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    return Response.json({ error }, { status: response.status })
  }

  const data = await response.json()
  return Response.json({ signedUrl: data.signed_url })
}
