# RAG – Knowledge Base des Agents

## Wozu
Spezifisches Wissen das nicht im System Prompt steht:
Preise, Features, Einwand-Antworten, Steuer-Kontext.

---

## 1. Produktwissen

### Pläne & Preise

| Plan | Transaktionen | 1 Jahr | 2 Jahre | Lifetime |
|---|---|---|---|---|
| Free | 200 | $0 | $0 | $0 |
| Starter | 200 | $49 | $79 | $139 |
| Pro | 3.500 | $159 | $239 | $449 |
| Expert 20k | 20.000 | $239 | $379 | $1.099 |
| Expert 50k | 50.000 | $329 | – | – |
| Expert 100k | 100.000 | $429 | – | – |
| Unlimited | Unbegrenzt | $839 | $1.299 | $6.699 |

BTC-Zahlung: 5% Rabatt auf alle Pläne.

### Feature-Matrix

| Feature | Free | Starter | Pro | Expert | Unlimited |
|---|---|---|---|---|---|
| Portfolio Tracking | ✅ | ✅ | ✅ | ✅ | ✅ |
| 25+ Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| 300+ Exchanges & Wallets | ✅ | ✅ | ✅ | ✅ | ✅ |
| DeFi & NFT | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tax Reports | ❌ | ✅ | ✅ | ✅ | ✅ |
| Tax Options | ❌ | ✅ | ✅ | ✅ | ✅ |
| Auto-Sync (täglich) | ❌ | ❌ | ✅ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ | ✅ |
| Backups | ❌ | 2 | 5 | 10 | 20 |
| Priority Support | ❌ | ❌ | ❌ | ✅ | ✅ |
| Advanced Tools | ❌ | ❌ | ❌ | ❌ | ✅ |
| Expert Session | ❌ | ❌ | ❌ | ❌ | ✅ |

### Wann welchen Plan empfehlen?
- **< 200 Trades, kein Tax Report nötig:** Free
- **< 200 Trades, braucht Tax Report:** Starter ($49/Jahr)
- **200–3.500 Trades, aktiver Trader:** Pro ($159/Jahr) ← häufigstes Upgrade-Ziel
- **3.500–20.000 Trades:** Expert 20k ($239/Jahr)
- **20.000–50.000 Trades:** Expert 50k ($329/Jahr)
- **50.000–100.000 Trades:** Expert 100k ($429/Jahr)
- **100.000+ Trades, keine Limits:** Unlimited ($839/Jahr)
- **Langzeit-Trader, will nicht jährlich zahlen:** Lifetime-Option des jeweiligen Plans

---

## 2. Einwand-Bibliothek

> Sprechbare Antworten – max. 2 Sätze, natürliche Sprache für Voice.

| # | Einwand | Sprechbare Antwort |
|---|---|---|
| 1 | "Mein Steuerberater macht das" | "CoinTracking ersetzt deinen Berater nicht – es macht ihn günstiger. Deine Daten kommen als fertiger Report, er muss nichts mehr manuell aufarbeiten." |
| 2 | "Ich tracke in Excel" | "Excel funktioniert bis zu einem Punkt – aber bei mehreren Börsen und hunderten Trades passieren Fehler, die das Finanzamt nicht akzeptiert. CoinTracking macht das automatisch und fehlerfrei." |
| 3 | "Crypto wird nicht kontrolliert" | "Das stimmt seit 2026 nicht mehr – DAC8 verpflichtet alle Börsen, Transaktionen direkt ans Finanzamt zu melden. Wer keine Dokumentation hat, riskiert Nachzahlungen." |
| 4 | "Zu teuer" | "Pro kostet weniger als eine Latte pro Woche. Verglichen mit Steuerberater-Stunden oder einer Nachzahlung ist das nichts." |
| 5 | "Ich habe zu wenig Trades" | "Selbst bei wenigen Trades lohnt es sich – vor allem wenn du Verluste hast, die du steuerlich verrechnen kannst. Und der Free Plan reicht vielleicht sogar für den Anfang." |
| 6 | "Unterstützt ihr meine Börse?" | "Wir haben über 300 Exchanges und Wallets integriert – Binance, Kraken, Coinbase, alles dabei. Falls eine fehlt, geht's auch per CSV-Import." |
| 7 | "Ich gebe meine API-Keys nicht raus" | "Völlig verständlich. Die Keys sind read-only – wir können keine Coins bewegen. Und wenn dir das nicht reicht, nutzt du einfach CSV statt API." |
| 8 | "Muss ich das jedes Jahr zahlen?" | "Ja, aber du kannst jederzeit kündigen. Oder du nimmst Lifetime – einmal zahlen, für immer nutzen." |
| 9 | "Ich habe kaum Gewinn gemacht" | "Gerade dann lohnt es sich – Verluste kannst du mit zukünftigen Gewinnen verrechnen. Aber nur wenn du sie sauber dokumentiert hast." |
| 10 | "Ich vertraue keinem Online-Tool" | "Das verstehe ich. CoinTracking ist GDPR-konform und verschlüsselt. Du kannst auch erstmal anonym mit dem Free Plan reinschauen." |

---

## 3. Steuer-Kontext

### DAC8 (ab 2026)
- EU-weite Meldepflicht: Crypto-Börsen melden Transaktionsdaten automatisch an Steuerbehörden
- Betrifft alle EU-Bürger, auch bei nicht-EU Börsen
- Wer keine Dokumentation hat, riskiert Nachzahlungen und Bußgelder

### DACH-spezifisch
- Deutschland: Haltefrist 1 Jahr → danach steuerfrei (bei < 1 Jahr: Einkommensteuer)
- Österreich: Pauschalbesteuerung 27,5% auf Kryptogewinne
- Schweiz: Keine Kapitalertragssteuer für Privatanleger, aber Vermögenssteuer

---

## 4. Social Proof
- "Trusted by 1M+ users"
- Marktführer seit mehreren Jahren
- 300+ Exchange-Integrationen
- 25+ Steuer-Reports

---

## In der Web App
- Textfelder oder File-Upload (PDF/TXT) für RAG-Inhalte
- Inhalte werden vor dem Call in den Kontext geladen
- Getrennt vom System Prompt editierbar
- Mehrere Knowledge-Base-Dokumente parallel möglich

## Noch zu ergänzen
- [ ] Echte Sales-Skripte / Call-Aufzeichnungen vom Cointracking-Team
- [ ] Detaillierte Steuerfristen pro Land
- [ ] FAQ aus dem Cointracking Support-Desk
