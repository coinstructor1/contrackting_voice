# Error Handling Konzept

## Fehler-Kategorien

### 1. Mikrofon / Browser
| Fehler | Ursache | Was die App tut |
|---|---|---|
| Mikrofon verweigert | User klickt "Blockieren" | Klare Anleitung anzeigen wie Zugriff erlaubt wird, Call startet nicht |
| Kein Mikrofon gefunden | Kein Audio-Input-Gerät | Fehlermeldung + Hinweis Gerät zu prüfen |
| Browser nicht unterstützt | Kein WebRTC | Hinweis: "Bitte Chrome oder Firefox nutzen" |

### 2. Verbindung / API
| Fehler | Ursache | Was die App tut |
|---|---|---|
| Provider nicht erreichbar | API down, Rate Limit, falscher Key | Toast-Meldung, anderen Provider vorschlagen |
| Connection während Call abbricht | Netzwerk, Timeout | Kurze Reconnect-Versuche (3x), dann Call beenden + Transkript bis dahin speichern |
| Zu hohe Latenz | Netzwerkprobleme | Hinweis in UI, Call läuft weiter |

### 3. Agent-Fehler
| Fehler | Ursache | Was die App tut |
|---|---|---|
| Keine Antwort nach X Sekunden | LLM-Timeout | Agent sagt "Einen Moment..." und versucht nochmal |
| Halluzination / falsche Preise | LLM erfindet Infos | Über System Prompt steuern ("Wenn unsicher, sag es") |
| Agent bricht ab | Unbekannter Fehler | Fallback-Satz: "Entschuldigung, ich bin kurz unterbrochen worden. Wo waren wir?" |

---

## Implementierung in Next.js

### Mikrofon Check (vor Call-Start)
```
1. getUserMedia() aufrufen
2. Bei Fehler: Permission-Error-Screen anzeigen
3. Bei Erfolg: "Start Call" Button aktivieren
```

### Connection Handling
```
1. WebSocket/WebRTC mit Retry-Logik (exponential backoff)
2. Bei Abbruch: Transkript bis dahin in Supabase speichern
3. User informieren: "Verbindung verloren – Gespräch wurde gespeichert"
```

### Provider-Fehler
```
1. API-Call mit Timeout (z.B. 10 Sekunden)
2. Bei Fehler: Error-State in UI, Provider-Wechsel möglich
3. Alle Fehler in Supabase loggen (für Debugging)
```

---

## UX-Prinzipien
- Fehler immer in einfacher Sprache erklären (kein technisches Kauderwelsch)
- Immer einen konkreten nächsten Schritt anbieten
- Laufende Gespräche nie einfach abbrechen ohne zu speichern
- Fehler-Logs in Supabase für spätere Analyse
