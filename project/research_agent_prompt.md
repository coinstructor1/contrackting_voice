# Research Agent Prompt – Cointracking Sales Voice & Einwände

## Auftrag

Nutze diesen Prompt als Input für einen Research Agent (z.B. Claude, Perplexity, etc.) der das Cointracking Sales-Team simuliert und die Wissenslücken für den AI Voice Agent füllt.

---

## Prompt

```
Du bist ein Research Agent. Dein Auftrag: Finde heraus wie ein erstklassiger Sales-Call für CoinTracking.info ablaufen würde.

KONTEXT:
CoinTracking.info ist ein Crypto Portfolio Tracker & Steuer-Rechner. Das Ziel der Sales Calls ist es, Free-User oder Interessenten zu einem Upgrade auf Pro ($159/Jahr), Expert ($239/Jahr) oder Lifetime ($449–$1.099) zu bewegen.

Zielgruppe: Crypto-Trader im DACH-Raum und international, die ihre Steuerpflichten erfüllen müssen.

---

AUFGABE 1 – HÄUFIGE EINWÄNDE
Recherchiere und erstelle eine Liste der 10 häufigsten Einwände die ein potenzieller Kunde in einem Sales-Call für ein Crypto-Steuer-Tool bringen würde. Für jeden Einwand:

- Der Einwand als wörtliches Zitat (wie ein Kunde es sagen würde)
- Eine überzeugende aber ehrliche Antwort (2–3 Sätze, natürlich gesprochen)
- Die Strategie dahinter (z.B. "Reframing", "Social Proof", "Risiko aufzeigen")

Beziehe dabei auch Einwände ein die spezifisch für Crypto-Steuer-Software sind:
- "Mein Steuerberater macht das"
- "Ich tracke das in Excel"
- "Crypto wird eh nicht kontrolliert"
- "Zu teuer"
- "Ich habe zu wenig Trades"

---

AUFGABE 2 – TONALITÄT & SPRECHSTIL
Beschreibe wie ein idealer CoinTracking Sales-Berater klingt. Beantworte:

- Welcher Ton? (formell/informell, Du/Sie, locker/seriös)
- Wie lang sind seine Sätze? (kurz & knackig vs. ausführlich)
- Wie geht er mit Stille um?
- Wie reagiert er wenn der Kunde abschweift?
- Was unterscheidet ihn von einem typischen Cold Caller?
- Wie klingt die Begrüßung?
- Wie klingt das Closing?

Gib konkrete Beispielsätze für jeden Punkt.

---

AUFGABE 3 – GESPRÄCHSABLAUF
Erstelle einen realistischen Gesprächsablauf für einen 5-Minuten Sales Call. Schreibe es als Dialog zwischen Agent (A) und Kunde (K). Der Kunde ist ein Free-User mit ~500 Trades der sein Portfolio manuell trackt.

Der Dialog soll zeigen:
- Natürliche Begrüßung
- Qualifizierungsfragen
- Pain Point Discovery
- Passende Plan-Empfehlung
- Mindestens 2 Einwände + Behandlung
- Konkretes Closing

---

AUFGABE 4 – ANTI-PATTERNS
Was sollte ein AI Voice Sales Agent auf keinen Fall tun? Liste 5–10 Verhaltensweisen die Kunden in Sales Calls sofort abschrecken, speziell im Kontext von:
- AI-generierter Sprache (was fällt auf?)
- Crypto/Finanz-Produkte (Vertrauen ist kritisch)
- DACH-Markt (kulturelle Besonderheiten)

---

FORMAT:
- Schreibe alles auf Deutsch
- Nutze gesprochene Sprache, keine Marketing-Floskeln
- Sei konkret, keine generischen Sales-Tipps
- Jede Aufgabe als eigener Abschnitt
```

---

## Wie nutzen

1. Diesen Prompt in einen Research Agent geben (Claude, Perplexity, o.ä.)
2. Output reviewen
3. Einwand-Bibliothek → in `04_rag.md` eintragen
4. Tonalität & Gesprächsablauf → `03_system_prompt.md` verfeinern
5. Anti-Patterns → in `06_ai_voice_grenzen.md` ergänzen
