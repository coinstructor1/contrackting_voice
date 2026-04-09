# Offene Punkte & Nice-to-Haves

---

## Muss-Haves (blockieren den Start)

### Cointracking Produktdaten
- ~~Echte Preise aller Pläne eintragen~~ ✅
- ~~Was genau ist im Pro vs. Expert vs. Unlimited enthalten~~ ✅
- ~~Expert Preisstaffelung (20k/50k/100k) eingetragen~~ ✅
- ~~Unlimited Plan ($839/Jahr, $6.699 Lifetime) eingetragen~~ ✅

### Sales-Team Input
- ~~Top 5–10 häufigste Einwände + bewährte Antworten~~ ✅ via Research Agent (`research_output.md`)
- ~~Wie läuft ein typischer Sales Call ab?~~ ✅ Beispiel-Dialog erstellt (`research_output.md`)
- ~~Wie klingt ein guter Cointracking Seller?~~ ✅ Tonalität-Guide erstellt (`research_output.md`)
- ⚠️ **Aber:** Alles basiert auf AI-Research, nicht auf echten Daten. Deutlich besser wäre:
  - Echte Call-Aufzeichnungen vom Sales-Team als Referenz
  - Interne Sales-Skripte / Playbooks falls vorhanden
  - Feedback eines echten Cointracking-Sellers auf unseren Draft-Prompt

### Fonio Browser-Fähigkeit klären (erstmal zurückgestellt)
- Hat Fonio ein Browser-SDK oder Web-Embed?
- Falls nicht: Fonio fällt für die Web App weg (oder braucht separaten Ansatz)
- Quelle: fonio.ai Doku / Support fragen

---

## Vor dem ersten Test erledigen

### Error Handling Konzept
- Was passiert wenn Mikrofon-Zugriff verweigert wird?
- Connection-Abbruch während des Calls?
- Agent antwortet nicht / Timeout?
- Provider-API nicht erreichbar?

### Einwand-Antworten sprechbar machen
- RAG-Tabelle ist schriftlich formuliert, für Voice zu lang
- Kürzere, natürlichere Varianten erstellen (max 2 Sätze pro Antwort)
- Getestet werden durch laut Vorlesen

### Halluzinations-Handling definieren
- Agent darf "Das weiß ich nicht" sagen
- Bei unbekannten Fragen: an Support verweisen statt erfinden
- In System Prompt klar formulieren

### Kontext-Limits pro Provider klären
- Max Token-Budget für RAG pro Provider (OpenAI / ElevenLabs / Fonio)
- Daraus ergibt sich: wie groß darf die Knowledge Base sein?

### System Prompt verfeinern
- v1 ist ein Draft – nach erstem Testgespräch anpassen
- Tonalität mit echtem Cointracking-Seller abgleichen
- ~~Mehrere Varianten anlegen~~ ✅ (v1 standard / v2 aktiv / v3 beratend)

### RAG befüllen
- Steuerfristen & Relevanz je Markt (DE, AT, CH, international)
- Social Proof / Nutzerzahlen von Cointracking
- Antworten auf die häufigsten Support-Fragen

### Testing-Aufwand & Zeitplan
- 3 Provider × 3 Prompts × 4 Szenarien = viele Kombinationen
- Realistischen Testplan erstellen (welche Kombinationen zuerst?)
- Testpersonen rekrutieren

### Benchmark definieren
- Was ist ein "guter" Score? Schwellwerte festlegen
- Idealerweise: einen echten menschlichen Seller als Baseline testen

---

## Nice-to-Haves (kein Blocker, aber wertvoll)

### Call-Transkript Analyse
- Transkripte nach jedem Testgespräch auswerten
- Wo steigt der Gesprächsfluss ab? Wo wiederholt der Agent sich?

### Scoring direkt in der App
- Nach jedem Call: 1–5 Sterne + Freitextfeld für Feedback
- Ergebnisse exportierbar (CSV) für Auswertung

### Mehrsprachigkeit
- Erster Test auf Deutsch – aber Cointracking ist international
- Lohnt sich: Englischer System Prompt als zweite Variante testen

### Voice Cloning (ElevenLabs)
- Cointracking-Seller als Stimmvorlage aufnehmen (~10 Min Audio)
- Agent klingt dann wie ein echter Cointracking-Mitarbeiter

### A/B Prompt Testing
- Zwei Prompts gleichzeitig verfügbar in der UI
- Tester wählen blind → welcher Prompt gewinnt?

### Gesprächs-Auswertung via LLM
- Nach dem Call: GPT analysiert das Transkript automatisch
- Output: Bewertung nach den 6 Kriterien aus `05_test_design.md`
