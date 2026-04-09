# AI Voice Sales Agent – MVP

## Was wir bauen
Web App im Browser. Nutzer führt ein Verkaufsgespräch mit einem AI Voice Agent.
Zwei Agents parallel verfügbar – gleicher Prompt, gleicher Kontext, unterschiedlicher Provider.
(Fonio zurückgestellt – kein Browser-SDK, nur Telefonie-API)

## Ziel
- Drei Voice Provider gegeneinander testen (Qualität, Latenz, Natürlichkeit)
- Verschiedene System Prompts und RAG-Inhalte live testen
- Herausfinden was mit AI Voice im Sales funktioniert und was nicht

## Provider
| Provider | Region | Grund |
|---|---|---|
| OpenAI Realtime API | Rest of World | Maximale Kontrolle |
| ElevenLabs Conv. AI | Rest of World | Beste Voice-Qualität |
| Fonio.ai | DACH | DSGVO-konform |

## Tech Stack
- **Frontend/Backend:** Next.js
- **Datenbank:** Supabase (Transkripte, Sessions, Bewertungen)
- **API Keys:** .env (OpenAI, ElevenLabs, Fonio)
- **Audio:** WebRTC/WebSocket, browser-based, kein Telefonie-Stack

```
User öffnet Link → Mikrofon-Zugriff → WebRTC/WebSocket → AI Agent → Antwort
```

## MVP Features
- [ ] Agent auswählen (OpenAI / ElevenLabs)
- [ ] System Prompt editierbar in der UI
- [ ] RAG-Inhalte in der UI befüllbar (Text-Input oder File Upload)
- [ ] Call starten / beenden
- [ ] Transkript des Gesprächs anzeigen (Supabase)
- [ ] Call-Bewertung nach Gespräch
- [ ] Error Handling (Mikrofon, Connection, Agent-Fehler)

## Was der Agent verkauft
→ Cointracking Free → Pro/Expert/Unlimited Upgrade (siehe `02_cointracking_sales.md`)

## Nach dem Call
→ Agent bietet an, Upgrade-Link per Email zu schicken

## Dokumente
- `01_technologie.md` – Provider Vergleich
- `02_cointracking_sales.md` – Was verkauft wird, Sales Pitch
- `03_system_prompt.md` – System Prompt des Agents
- `04_rag.md` – Knowledge Base Inhalte
- `05_test_design.md` – Wie wir die Agents bewerten
- `06_ai_voice_grenzen.md` – Was AI Voice kann / nicht kann
