# 01 – Technologie-Vergleich: AI Voice Agent Stack

> Ziel: Die drei Ansätze OpenAI Realtime API, ElevenLabs Conversational AI und Fonio.ai gegeneinander testen, um den besten Stack für einen AI Sales Caller (Cointracking-Use-Case) zu identifizieren.

> **Architektur-Entscheidung:** Kein Telefonie-Layer nötig. Das Produkt ist ein **Browser-basierter Google Meet Ersatz** – der Prospect öffnet einen Link und spricht direkt im Browser mit dem AI Agent (WebRTC/WebSocket). Dadurch entfällt Twilio, SIP, etc. komplett.

## Deployment-Strategie nach Region

| Region | Stack | Grund |
|---|---|---|
| **DACH** | Fonio.ai | DSGVO-konform, Server in Deutschland |
| **Rest of World** | ElevenLabs oder OpenAI Realtime API | Günstig, beste Qualität, Browser-SDK vorhanden |

---

## Übersicht

| Kriterium | OpenAI Realtime API | ElevenLabs Conv. AI | Fonio.ai |
|---|---|---|---|
| **Typ** | Developer API (low-level) | Developer API + No-Code | Managed SaaS / No-Code |
| **Ansatz** | Selbst bauen | Hybrid | Out-of-the-Box |
| **Latenz** | ~300–600ms | ~300–500ms | ~500ms (lokale Server DE) |
| **Stimmenqualität** | Gut (GPT-4o Voice) | Sehr gut (eigene TTS-Engine) | Gut |
| **Telefonie nötig?** | ❌ nicht nötig (Browser) | ❌ nicht nötig (Browser) | ❌ nicht nötig (Browser) |
| **Browser SDK** | ✅ WebRTC/WebSocket | ✅ offizielles Browser SDK | ⚠️ prüfen |
| **Custom System Prompt** | ✅ voll flexibel | ✅ voll flexibel | ✅ eingeschränkter |
| **RAG / Kontext** | ✅ selbst integrieren | ✅ Knowledge Base eingebaut | ⚠️ begrenzt |
| **Preis pro Minute** | ~$0.10–0.30 (inkl. Stack) | ~$0.08–0.10 | ~€0.15 |
| **DSGVO / DACH** | ⚠️ US-Server | ⚠️ US-Server | ✅ Server in Nürnberg |
| **Technischer Aufwand** | Hoch | Mittel | Niedrig |
| **Outbound Calls** | ❌ (nur Audio-Stream) | ✅ | ✅ |

---

## Details pro Plattform

### 1. OpenAI Realtime API

**Was es ist:**
Die Realtime API ermöglicht eine bidirektionale Audio-Verbindung direkt mit GPT-4o – Text und Sprache in einem Stream, ohne separaten STT/TTS-Layer.

**Vorteile:**
- Maximale Flexibilität und Kontrolle über System Prompt, Gesprächsflow, RAG-Integration
- Sehr niedrige Latenz da STT → LLM → TTS in einem Schritt
- Günstig als reiner API-Layer

**Nachteile:**
- Keine eingebaute Wissensdatenbank
- Deutlich mehr Entwicklungsaufwand
- Server in den USA (DSGVO-relevant für DACH)

**Kosten (Browser-only, kein Telephony):**
- Audio Input: ~$0.06/min
- Audio Output: ~$0.24/min
- **Gesamt: ~$0.10–0.30/min** je nach Gesprächslänge & System Prompt Größe

**Gut geeignet wenn:** Maximale Kontrolle gewünscht, eigenes Dev-Team vorhanden

---

### 2. ElevenLabs Conversational AI

**Was es ist:**
ElevenLabs hat ihre bekannte TTS-Engine um einen vollständigen Conversational AI Layer erweitert – inkl. Telefonie, Knowledge Base und Agent Builder.

**Vorteile:**
- Beste Stimmenqualität der drei Optionen
- Eingebaute Telefonie (Outbound & Inbound)
- Knowledge Base direkt integrierbar (für RAG-ähnlichen Kontext)
- Eigene Voice Cloning Funktion → ideal für Cointracking-Ton/Stil
- Preis wurde März 2026 um 50% gesenkt

**Nachteile:**
- LLM-Kosten werden aktuell noch von ElevenLabs absorbiert, aber nicht dauerhaft
- Server in den USA (DSGVO-relevant)
- Weniger Kontrolle als raw OpenAI API

**Kosten:**
- ~$0.08–0.10/min (Silence wird zu 95% nicht berechnet)
- Creator Plan: usage-based Billing möglich
- Enterprise: günstiger auf Anfrage

**Gut geeignet wenn:** Schneller Start, beste Voice-Qualität, Voice Cloning für Cointracking-Stil

---

### 3. Fonio.ai

**Was es ist:**
Österreichisches/Deutsches SaaS-Produkt (Vienna), speziell für den DACH-Markt gebaut. Managed Platform ohne eigene Entwicklung nötig.

**Vorteile:**
- Server in Nürnberg → DSGVO-konform out-of-the-box
- Kein technischer Aufwand, schnell einsatzbereit
- 30-Tage Geld-zurück-Garantie
- Gut für erste Tests im DACH-Markt

**Nachteile:**
- Deutlich weniger Flexibilität bei System Prompt & RAG
- Stimmenqualität und Customization eingeschränkter
- €0.15/min + €9/Rufnummer + Setup-Kosten
- Ab €85/Monat Grundgebühr

**Gut geeignet wenn:** Schneller Proof-of-Concept ohne Dev-Aufwand, DSGVO ist wichtig, DACH-Fokus

---

## Empfehlung für Test-Setup

Da alle drei getestet werden sollen, macht folgende Aufteilung Sinn:

```
Test A: OpenAI Realtime API (Browser/WebSocket)
→ Maximale Kontrolle, selbst gebaut, Rest-of-World

Test B: ElevenLabs Conversational AI (Browser SDK)
→ Beste Voice Quality, Voice Cloning, Rest-of-World

Test C: Fonio.ai (Browser, falls SDK vorhanden)
→ DSGVO-sicher, DACH-Markt
```

> Alle drei Tests laufen als einfache Web-App im Browser – kein Telefonie-Layer nötig.

### Bewertungskriterien für den Test:
1. **Natürlichkeit** – Klingt es wie ein echter Sales Caller?
2. **Latenz** – Wie schnell antwortet der Agent?
3. **Einwandbehandlung** – Kann er flexibel auf Einwände reagieren?
4. **Gesprächsführung** – Hält er den roten Faden?
5. **Kosten pro Gespräch** – Was kostet ein 5-Min Call?
6. **Aufbauaufwand** – Wie lange bis zur ersten Demo?

---

## Offene Fragen / Nächste Schritte

- [ ] OpenAI API-Zugang vorhanden?
- [ ] ElevenLabs Account (welcher Plan)?
- [ ] Fonio: prüfen ob Browser-SDK / Embed verfügbar ist
- [ ] Fonio Trial starten (30 Tage Geld-zurück)
- [ ] → Weiter mit **02_demo_app_architektur.md**
