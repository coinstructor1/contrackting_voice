# Test Design – Wie wir die Agents bewerten

## Ziel
Herausfinden: Welcher Provider ist am besten? Welcher Prompt konvertiert besser?

---

## Test-Szenarien (je 1 Tester pro Szenario)

| Szenario | Beschreibung |
|---|---|
| A – Interessierter Free-User | "Ich nutze CoinTracking gratis, mache ~200 Trades/Jahr" |
| B – Skeptiker | "Ich mache das in Excel, brauche das nicht" |
| C – Preissensitiver Nutzer | "Klingt gut, aber ist mir zu teuer" |
| D – Viel-Trader | "Ich habe 5 Exchanges und hunderte Trades pro Monat" |

---

## Bewertungskriterien (1–5 pro Kriterium)

| Kriterium | Was wird bewertet |
|---|---|
| **Natürlichkeit** | Klingt es wie ein echter Mensch? |
| **Latenz** | Wie schnell kommt die Antwort? |
| **Gesprächsführung** | Hält er den roten Faden? |
| **Einwandbehandlung** | Reagiert er sinnvoll auf Einwände? |
| **Closing** | Kommt er zu einem konkreten nächsten Schritt? |
| **Fehler** | Erfindet er Dinge? Bricht er ab? |

---

## Ablauf eines Tests
1. Provider wählen (OpenAI / ElevenLabs / Fonio)
2. Szenario spielen (~5 Min Gespräch)
3. Bewertungsbogen ausfüllen (direkt nach Call)
4. Transkript reviewen

## Auswertung
- Gleicher Prompt, gleicher Kontext → Provider-Vergleich
- Gleicher Provider, anderer Prompt → Prompt-Vergleich
- Mindestens 2 Tester pro Kombination für verlässliche Aussagen

## Output
→ Tabelle: Provider × Szenario × Kriterium = Score
→ Qualitative Notizen: Was hat überrascht? Wo hat es gehakt?

---

## Realistischer Testplan

Nicht alle Kombinationen auf einmal – priorisiert vorgehen:

**Phase 1 – Provider-Vergleich (gleicher Prompt v1, Szenario A)**
- OpenAI vs. ElevenLabs, je 2 Tester
- Ziel: Welcher Provider klingt besser?
- Aufwand: ~4 Gespräche à 5 Min = 20 Min

**Phase 2 – Prompt-Vergleich (bester Provider, alle 3 Prompts, Szenario A+B)**
- Ziel: Welcher Stil konvertiert besser?
- Aufwand: ~6 Gespräche = 30 Min

**Phase 3 – Alle Szenarien (bester Provider + Prompt)**
- Szenarien A–D, je 2 Tester
- Ziel: Wo versagt der Agent?
- Aufwand: ~8 Gespräche = 40 Min

**Gesamt: ~18 Testgespräche für valide Aussagen** (nicht 72)

---

## Benchmark: AI vs. Mensch

Um zu wissen ob der Agent gut genug ist, brauchen wir einen Vergleichswert.

**Option A (ideal):** Echter Cointracking-Seller spielt dieselben 4 Szenarien durch → selber Bewertungsbogen → direkter Score-Vergleich.

**Option B (pragmatisch):** Jemand aus dem Team spielt einen informierten Seller, ohne Skript.

**Ziel-Score:** AI Agent sollte ≥ 70% des menschlichen Scores erreichen um als "einsatzfähig für Erstqualifizierung" zu gelten.
