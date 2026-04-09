# Technologie – Voice Provider

## Entscheidung
- **DACH → Fonio.ai** (DSGVO, Server Nürnberg)
- **Rest of World → OpenAI Realtime API oder ElevenLabs** (günstig, beste Qualität)
- **Kein Telefonie-Stack nötig** – alles läuft browser-basiert (WebRTC/WebSocket)

## Provider im Vergleich

| | OpenAI Realtime API | ElevenLabs Conv. AI | Fonio.ai |
|---|---|---|---|
| **Latenz** | ~300–600ms | ~300–500ms | ~500ms |
| **Voice-Qualität** | Gut | Sehr gut | Gut |
| **Browser SDK** | ✅ WebSocket | ✅ offizielles SDK | ⚠️ prüfen |
| **System Prompt** | ✅ voll flexibel | ✅ voll flexibel | eingeschränkt |
| **RAG / Knowledge Base** | selbst bauen | eingebaut | begrenzt |
| **Voice Cloning** | ❌ | ✅ | ❌ |
| **Kosten/Min** | ~$0.10–0.30 | ~$0.08–0.10 | ~€0.15 |
| **DSGVO** | ❌ US-Server | ❌ US-Server | ✅ DE-Server |

## Offene Fragen
- [ ] Fonio: Browser-Embed / SDK verfügbar? (vor Implementierung prüfen)
- [ ] ElevenLabs Plan (Creator für usage-based Billing empfohlen)
