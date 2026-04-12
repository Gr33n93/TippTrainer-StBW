# Architektur: TippTrainer StBW

## Zweck

Browserbasiertes 10-Finger-Tipptrainer mit Fokus auf deutsche Steuerberater-Prüfungsinhalte (Baden-Württemberg). Ziel: Bis 01.06.2026 korrektes und schnelles Schreiben trainieren.

## Tech-Stack

- **HTML5** – Seitenstruktur, Single-Page-Application
- **CSS3** – Dark Theme, Responsive Design, CSS-Variablen für Theming
- **Vanilla JavaScript (ES6+)** – Keine Frameworks, keine Build-Tools
- **LocalStorage** – Persistenz für Fortschritt, Achievements, Kalenderdaten
- **Kein Backend** – Läuft komplett clientseitig, öffnen per `file://` oder lokalem Server

## Verzeichnisstruktur

```
/
├── index.html                # Haupteinstiegspunkt (SPA)
├── css/
│   └── style.css             # Alle Styles (Dark Theme, Layout, Animationen)
├── js/
│   ├── app.js                # Hauptcontroller: Navigation, View-Rendering
│   ├── typing.js             # Tipp-Engine: Eingabe-Handling, WPM/CPM-Berechnung
│   ├── levels.js             # Level-System und Schwierigkeitsverwaltung
│   ├── texts.js              # Textinhalte nach Thema/Level/Schwierigkeit
│   ├── achievements.js       # Achievement-System: Freischaltung, Badges
│   ├── calendar.js           # Übungskalender: Monatsansicht, Streaks
│   ├── progress.js           # Fortschrittsverfolgung und Statistiken
│   └── storage.js            # LocalStorage-Wrapper (CRUD, Migration)
├── ARCHITECTURE.md           # Dieses Dokument
├── PROGRESS.md               # Projektfortschritt
└── .gitignore                # Git-Ignore-Regeln
```

## Modul-Verantwortlichkeiten

### `index.html`
- Single-Page-Application mit View-Containern
- Lädt alle CSS/JS-Dateien
- Enthält die statische HTML-Struktur für alle Views (Dashboard, Übung, Kalender, Achievements, Fortschritt, Einstellungen)

### `css/style.css`
- Dark Theme mit CSS Custom Properties
- Layout: Grid/Flexbox-basiert
- Tipp-Feedback-Animationen (grün/rot)
- Responsive Design
- View-Transitions

### `js/app.js`
- View-Management (SPA-Navigation ohne Reload)
- Event-Delegation für UI-Interaktionen
- Initialisierung aller Module beim Start
- Globale State-Koordination

### `js/typing.js`
- Tipp-Engine: Zeichen-weiser Vergleich Eingabe vs. Vorgabe
- Echtzeit-Feedback: grün (korrekt), rot (falsch), Cursor-Position
- WPM-Berechnung (Wörter pro Minute, 1 Wort = 5 Zeichen)
- CPM-Berechnung (Zeichen pro Minute)
- Genauigkeitsberechnung (Accuracy %)
- Timer-Verwaltung (Start bei erstem Tastendruck)
- Backspace-Handling

### `js/levels.js`
- 4 Themenbereiche: Buchführung, Steuerrecht, Bilanzen/EÜR, Kosten- und Leistungsrechnung
- 10 Level pro Themenbereich
- 3 Schwierigkeitsstufen: leicht, normal, schwer
- Level-Freischaltlogik basierend auf Genauigkeit + Geschwindigkeit
- Level-spezifische Schwellenwerte

### `js/texts.js`
- Texte nach `[thema][level][schwierigkeit]` organisiert
- Level 1-3: Einzelne Wörter und kurze Phrasen (Grundbegriffe)
- Level 4-6: Kurze Sätze und Definitionen
- Level 7-9: Ganze Absätze und Prüfungstexte
- Level 10: Komplexe Prüfungslösungen mit Sonderzeichen (§, %, €, etc.)
- Jede Schwierigkeitsstufe variiert Textlänge und Komplexität innerhalb des Levels

### `js/achievements.js`
- Achievement-Definitionen (ID, Name, Beschreibung, Icon, Bedingung)
- Freischaltlogik: Prüfung nach jeder Übung
- Achievement-Typen:
  - Geschwindigkeits-Meilensteine (40/60/80/100 WPM)
  - Genauigkeits-Meilensteine (95%/98%/100%)
  - Streak-Achievements (7/14/30/60 Tage)
  - Themen-Abschlüsse (alle Level eines Bereichs)
  - Zeitbasiert (Morgens/Abends üben)
  - Session-basiert (Dauer, Anzahl Übungen)

### `js/calendar.js`
- Monatsansicht mit Übungstagen
- Farbcodierung nach Übungsintensität (Zeit oder Anzahl)
- Streak-Berechnung (aktuell, längste)
- Monatsnavigation (vor/zurück)
- Prüft ob heute geübt wurde

### `js/progress.js`
- Historie aller Übungssessions (Datum, Level, Schwierigkeit, WPM, Genauigkeit, Dauer)
- Fortschrittsgraphen: WPM und Genauigkeit über Zeit
- Vergleich gleicher Level/Schwierigkeit
- Zusammenfassung pro Themenbereich
- Countdown bis 01.06.2026

### `js/storage.js`
- LocalStorage-Wrapper mit JSON-Serialisierung
- Namespaced Keys (`tippTrainer_*`)
- Datenmodell:
  - `tippTrainer_progress`: Array aller Sessions
  - `tippTrainer_achievements`: Freigeschaltete Achievements mit Datum
  - `tippTrainer_levels`: Freigeschaltete Level pro Thema
  - `tippTrainer_settings`: Benutzereinstellungen
  - `tippTrainer_calendar`: Kalenderdaten
- Fehlerbehandlung bei vollem Storage oder deaktiviertem LocalStorage

## Datenfluss

```
Benutzer öffnet index.html
  → app.js initialisiert alle Module
  → storage.js lädt gespeicherten Zustand aus LocalStorage

Benutzer wählt Thema/Level/Schwierigkeit
  → levels.js prüft Freischaltung
  → texts.js liefert passenden Text

Benutzer tippt
  → typing.js verarbeitet jeden Tastendruck
  → Echtzeit-Feedback (grün/rot) im DOM
  → WPM/CPM/Accuracy werden kontinuierlich aktualisiert

Übung abgeschlossen
  → typing.js liefert Ergebnis an app.js
  → progress.js speichert Session in Historie
  → achievements.js prüft neue Achievements
  → levels.js prüft Level-Freischaltung
  → calendar.js registriert Übungstag
  → storage.js persistiert alles in LocalStorage

Benutzer navigiert zu Kalender/Fortschritt/Achievements
  → app.js rendert jeweilige View mit aktuellen Daten
```

## Schwierigkeits- und Level-System

### Schwierigkeitsstufen

| Parameter | Leicht | Normal | Schwer |
|-----------|--------|--------|--------|
| Textlänge | Kurz (20-40 Wörter) | Mittel (40-80 Wörter) | Lang (80-150 Wörter) |
| Min. Genauigkeit zum Freischalten | 85% | 90% | 95% |
| Min. WPM zum Freischalten | 20 | 35 | 50 |
| XP-Belohnung | 10-30 | 30-60 | 60-100 |
| Sonderzeichen-Häufigkeit | Niedrig | Mittel | Hoch |

### Level-Fortschritt (pro Themenbereich)

- Level 1: Start immer freigeschaltet
- Level N+1 wird freigeschaltet wenn: Mindestens 1 Schwierigkeitsstufe im aktuellen Level bestanden
- Level 10: "Meister-Level" mit komplexen Prüfungslösungen

## Gamification

### XP-System
- XP pro Übung abhängig von Schwierigkeit, Genauigkeit und Geschwindigkeit
- Level-Up bei XP-Schwellenwerten (Benutzerlevel, nicht Themen-Level)
- Visueller XP-Balken im Dashboard

### Achievements (Beispiele)
- "Erste Tippversuche" – Erste Übung abgeschlossen
- "Fehlerfrei" – Übung mit 100% Genauigkeit
- "Blitzschreiber" – 60 WPM erreicht
- "Steuer-Guru" – Alle Steuerrecht-Level bestanden
- "7-Tage-Streak" – 7 Tage hintereinander geübt
- "Perfektionist" – 10 Übungen am Stück ≥98% Genauigkeit

## Externe Abhaengigkeiten

- **Keine externen Bibliotheken oder CDNs**
- Alles wird mit Standard-Web-APIs implementiert
- Lokale Schriften (System-Fonts)

## Build / Test / Deploy

- **Kein Build-Prozess** – Direktes Öffnen der `index.html` im Browser
- **Test:** Manuell im Browser, optional lokale Tests mit Node.js
- **Deploy:** Datei auf lokalen Rechner, öffnen per `file://`-Protokoll oder einfachem HTTP-Server

## Bekannte Risiken

- **LocalStorage-Limit:** ~5-10 MB pro Origin. Bei intensiver Nutzung über Monate kann Historie groß werden → Cleanup-Strategie oder Kompression implementieren.
- **Browser-Kompatibilität:** Keine IE-Unterstützung. Moderne Browser (Chrome, Firefox, Edge, Safari) werden unterstützt.
- **Tastatur-Layout:** Tool geht von deutschem QWERTZ-Layout aus. Andere Layouts werden nicht explizit unterstützt.
- **Datensicherheit:** Alle Daten liegen lokal. Kein Cloud-Backup. Bei Browser-Datenverlust sind Fortschritte weg → Export/Import-Funktion als Mitigation.
