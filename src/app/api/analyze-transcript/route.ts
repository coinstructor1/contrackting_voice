import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

const SCENARIO_LABELS: Record<string, string> = {
  A_interessiert:  'A – Interessiert (aufgeschlossen, neugierig)',
  B_skeptiker:     'B – Skeptiker (kritisch, zögerlich)',
  C_preissensitiv: 'C – Preissensitiv (kostenbewusst)',
  D_vieltrader:    'D – Vieltrader (erfahren, hohe Transaktionszahl)',
}

const OUTCOME_LABELS: Record<string, string> = {
  interested: 'Interessiert',
  declined:   'Abgelehnt',
  followup:   'Follow-up vereinbart',
  aborted:    'Abgebrochen',
}

function buildPrompt(
  transcriptText: string,
  context: {
    scenario: string | null
    outcome: string | null
    duration: number | null
    ragContent: string | null
    testerNotes: string | null
    rating: {
      naturalness: number
      latency: number
      conversation_flow: number
      objection_handling: number
      closing: number
      errors: number
    } | null
    emailAttempted: boolean
    emailAttempts: number | null
  }
): string {
  const contextLines: string[] = []

  if (context.scenario) {
    contextLines.push(`Tester-Szenario: ${SCENARIO_LABELS[context.scenario] ?? context.scenario}`)
  }
  if (context.outcome) {
    contextLines.push(`Gesprächsergebnis (vom Tester): ${OUTCOME_LABELS[context.outcome] ?? context.outcome}`)
  }
  if (context.duration) {
    const m = Math.floor(context.duration / 60)
    const s = context.duration % 60
    contextLines.push(`Gesprächsdauer: ${m}:${s.toString().padStart(2, '0')} min`)
  }
  if (context.rating) {
    const r = context.rating
    contextLines.push(`Tester-Bewertung (1–5):
  - Natürlichkeit: ${r.naturalness}
  - Latenz: ${r.latency}
  - Gesprächsführung: ${r.conversation_flow}
  - Einwandbehandlung: ${r.objection_handling}
  - Closing: ${r.closing}
  - Fehler: ${r.errors}`)
  }
  if (context.testerNotes) {
    contextLines.push(`Notizen vom Tester: "${context.testerNotes}"`)
  }

  const ragSection = context.ragContent
    ? `\nFAKTEN-BASIS (RAG – was der Agent wissen sollte):\n${context.ragContent}\n`
    : ''
  if (context.emailAttempted) {
    const attempts = context.emailAttempts
    if (attempts === 1) {
      contextLines.push('E-Mail-Versand: Agent hat die Adresse beim ersten Versuch korrekt erkannt.')
    } else if (attempts && attempts > 1) {
      contextLines.push(`E-Mail-Versand: Agent brauchte ${attempts} Versuche um die Adresse korrekt zu erfassen.`)
    } else {
      contextLines.push('E-Mail-Versand: E-Mail wurde im Gespräch versucht.')
    }
  }

  const contextSection = contextLines.length > 0
    ? `\nKONTEXT (vom Tester nach dem Call erfasst):\n${contextLines.join('\n')}\n`
    : ''

  return `Analysiere das folgende Sales-Call Transkript eines AI Voice Agents für CoinTracking (Krypto-Steuer-Software).
${ragSection}${contextSection}
TRANSKRIPT:
${transcriptText}

Nutze die Fakten-Basis um Halluzinationen zu erkennen: Wenn der Agent Preise, Features oder Infos nennt die nicht in der Fakten-Basis stehen oder davon abweichen, ist das ein Fehler. Nutze den Kontext um deine Analyse zu schärfen – z.B. wenn der Tester "Closing" niedrig bewertet hat, schaue gezielt wo das Closing schwach war.

Bewerte folgendes und antworte ausschließlich als JSON-Objekt mit diesen Feldern:
{
  "summary": "1-2 Sätze: Was war das Gespräch?",
  "objections": ["Einwand 1", "Einwand 2"],
  "objections_handled": true,
  "reached_closing": false,
  "errors": ["Fehler 1", "Fehler 2"],
  "dropoff": "An welcher Stelle war der Agent am schwächsten?",
  "highlight": "Was hat der Agent besonders gut gemacht?",
  "verdict": "ok"
}

Regeln:
- verdict ist genau einer von: "strong", "ok", "weak"
- objections_handled: true wenn Einwände überzeugend behandelt wurden
- reached_closing: true wenn Agent einen konkreten nächsten Schritt vorgeschlagen hat
- errors: Halluzinationen, falsche Preise, Wiederholungen, Abbrüche (leeres Array wenn keine)
- Antworte nur mit dem JSON, kein zusätzlicher Text`
}

export async function POST(req: NextRequest) {
  const { session_id } = await req.json()
  console.log('[analyze-transcript] Start for session:', session_id)

  if (!session_id) {
    return Response.json({ error: 'session_id fehlt' }, { status: 400 })
  }

  // Alle Daten parallel laden
  const [transcriptsRes, sessionRes, ratingRes] = await Promise.all([
    supabase.from('transcripts').select('role, content').eq('session_id', session_id).order('timestamp'),
    supabase.from('sessions').select('scenario, outcome, call_duration_seconds, rag_content').eq('id', session_id).single(),
    supabase.from('ratings').select('naturalness, latency, conversation_flow, objection_handling, closing, errors, notes, email_attempted, email_attempts').eq('session_id', session_id).maybeSingle(),
  ])

  if (transcriptsRes.error) {
    console.error('[analyze-transcript] Supabase fetch error:', transcriptsRes.error)
    return Response.json({ error: 'Supabase-Fehler beim Laden der Transkripte' }, { status: 500 })
  }

  if (!transcriptsRes.data?.length) {
    console.warn('[analyze-transcript] No transcripts found for session:', session_id)
    return Response.json({ error: 'Keine Transkripte gefunden' }, { status: 404 })
  }

  console.log('[analyze-transcript] Transcripts:', transcriptsRes.data.length, '| Rating:', !!ratingRes.data, '| Session:', !!sessionRes.data)

  const transcriptText = transcriptsRes.data
    .map((t) => `${t.role === 'agent' ? 'Agent' : 'Kunde'}: ${t.content}`)
    .join('\n')

  const session = sessionRes.data
  const rating = ratingRes.data

  const prompt = buildPrompt(transcriptText, {
    scenario:      session?.scenario ?? null,
    outcome:       session?.outcome ?? null,
    duration:      session?.call_duration_seconds ?? null,
    ragContent:    session?.rag_content ?? null,
    testerNotes:   rating?.notes ?? null,
    rating:        rating ? {
      naturalness:        rating.naturalness,
      latency:            rating.latency,
      conversation_flow:  rating.conversation_flow,
      objection_handling: rating.objection_handling,
      closing:            rating.closing,
      errors:             rating.errors,
    } : null,
    emailAttempted: rating?.email_attempted ?? false,
    emailAttempts:  rating?.email_attempts ?? null,
  })

  console.log('[analyze-transcript] Calling OpenAI GPT-4o...')
  const llmRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!llmRes.ok) {
    const errText = await llmRes.text()
    console.error('[analyze-transcript] OpenAI error:', llmRes.status, errText)
    return Response.json({ error: `LLM-Auswertung fehlgeschlagen: ${llmRes.status}` }, { status: 500 })
  }

  const llmData = await llmRes.json()
  console.log('[analyze-transcript] OpenAI response received')

  let analysis: Record<string, unknown>
  try {
    analysis = JSON.parse(llmData.choices[0].message.content)
    console.log('[analyze-transcript] Parsed analysis:', analysis)
  } catch (e) {
    console.error('[analyze-transcript] JSON parse error:', e, 'Raw:', llmData.choices?.[0]?.message?.content)
    return Response.json({ error: 'LLM-Antwort konnte nicht geparst werden' }, { status: 500 })
  }

  // Evtl. vorhandene Analyse löschen (re-analyse support)
  await supabase.from('transcript_analysis').delete().eq('session_id', session_id)

  const { data: saved, error: saveError } = await supabase
    .from('transcript_analysis')
    .insert({
      session_id,
      summary:              analysis.summary ?? null,
      objections_raised:    analysis.objections ?? [],
      objections_handled:   analysis.objections_handled ?? null,
      reached_closing:      analysis.reached_closing ?? null,
      agent_errors:         analysis.errors ?? [],
      conversation_dropoff: analysis.dropoff ?? null,
      highlight:            analysis.highlight ?? null,
      overall_verdict:      analysis.verdict ?? null,
    })
    .select()
    .single()

  if (saveError) {
    console.error('[analyze-transcript] Supabase save error:', saveError)
    return Response.json({ error: 'Speichern fehlgeschlagen', detail: saveError.message }, { status: 500 })
  }

  console.log('[analyze-transcript] Saved successfully:', saved?.id)
  return Response.json(saved)
}
