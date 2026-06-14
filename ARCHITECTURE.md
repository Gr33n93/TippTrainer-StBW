# Architektur: TippTrainer StBW

## Zweck

Browserbasierter 10-Finger-Tipptrainer mit Fokus auf deutsche
Steuerberater-Prüfungsinhalte (Baden-Württemberg). Ziel: Bis zum
Prüfungstermin korrektes und schnelles Schreiben trainieren.

## Tech-Stack

- **HTML5** – Seitenstruktur, Single-Page-Application
- **CSS3** – Dark Theme, Responsive Design, CSS-Variablen für Theming
- **Vanilla JavaScript (ES6+)** – IIFE-Modul-Pattern, keine Frameworks
- **LocalStorage** – Persistenz für Fortschritt, Achievements, Kalenderdaten
- **Kein Backend** – Läuft komplett clientseitig, öffnen per `file://` oder HTTP
- **Keine Build-Tools für die Web-App** – Direktes Öffnen der `index.html` im Browser
- **Electron (optional)** – Wrapper für Linux-Desktop-Apps (AppImage/Flatpak), baut auf der unveränderten Web-App auf

## Verzeichnisstruktur

```
.
├── index.html                  # SPA-Einstiegspunkt
├── css/
│   ├── base/                   # Design-Tokens, Reset
│   │   ├── variables.css       # :root-Tokens (Farben, Radien, Schriften)
│   │   └── reset.css           # Universal-Reset, body
│   ├── layout/                 # App-Container, Sidebar
│   │   ├── app.css
│   │   └── sidebar.css         # Sidebar, XP-Bar, Navigation, Footer
│   ├── components/             # Wiederverwendbare UI-Komponenten
│   │   ├── view-container.css  # .view/.active-Schaltung
│   │   ├── buttons.css         # .btn-Modifikatoren
│   │   ├── toast.css           # Toast-Notifications
│   │   ├── empty-state.css     # Leer-Zustände
│   │   └── mobile-toggle.css   # Hamburger-Button
│   ├── views/                  # View-spezifische Styles
│   │   ├── dashboard.css
│   │   ├── levels.css
│   │   ├── typing.css
│   │   ├── result.css          # Result-Modal
│   │   ├── calendar.css
│   │   ├── achievements.css
│   │   ├── progress.css
│   │   └── settings.css
│   ├── animations.css          # Zentrale @keyframes
│   └── responsive.css          # Media-Queries
├── js/
│   ├── core/                   # Infrastruktur
│   │   ├── state.js            # Zentraler App-State (View, Topic, Level, ...)
│   │   ├── dom.js              # DOM-Helper, Stat-Card, Toast, Escaping
│   │   └── router.js           # SPA-View-Routing, Navigation
│   ├── engine/                 # Engine + Persistenz
│   │   ├── storage.js          # LocalStorage-Wrapper (CRUD, XP, Migration)
│   │   ├── typing.js           # Tipp-Engine (Zeichen-Vergleich, WPM, CPM)
│   │   └── (texts.js -> data/) # Text-API
│   ├── services/               # Geschäftslogik
│   │   ├── levels.js           # Level-System, Schwierigkeiten, XP-Berechnung
│   │   ├── calendar.js         # Übungskalender, Streaks
│   │   ├── progress.js         # Session-Historie, Statistiken
│   │   ├── achievements.js     # Achievement-System
│   │   ├── recommendation.js   # Difficulty-Empfehlung nach Übung
│   │   └── session-completion.js # Workflow nach Übungsabschluss
│   ├── views/                  # View-Module (DOM-Rendering)
│   │   ├── chrome.js           # Globale UI (XP, Countdown)
│   │   ├── dashboard.js
│   │   ├── levels.js
│   │   ├── typing.js           # Tipp-View + Engine-Anbindung
│   │   ├── result.js           # Result-Overlay
│   │   ├── calendar.js
│   │   ├── achievements.js
│   │   ├── progress.js
│   │   └── settings.js
│   └── app.js                  # Bootstrap (~60 Zeilen)
├── data/                       # Reine Daten-Module
│   ├── texts.js                # Text-API + 960 Basis-Texte
│   ├── texts-extra.js          # 960+ zusätzliche Texte
│   └── texts-sehrSchwer.js     # 320 Sehr-Schwer-Texte
├── electron/                   # Electron-Wrapper (Desktop-App)
│   ├── main.cjs                # Hauptprozess (BrowserWindow)
│   ├── preload.cjs             # Security-Layer
│   └── icon.png                # App-Icon (512x512)
├── build/                      # Build-Ressourcen
│   ├── icon.svg                # Vector-Quelle des Icons
│   ├── icon.png                # PNG-Variante (256x256)
│   ├── tipptrainer-stbw.desktop # Linux Desktop-Eintrag
│   └── de.gr33n93.TippTrainer.metainfo.xml # AppStream-Metadaten
├── electron-builder.yml        # Build-Konfiguration (Linux/Flatpak/AppImage)
├── ARCHITECTURE.md             # Dieses Dokument
├── PROGRESS.md                 # Projektfortschritt / Changelog
├── README.md                   # Öffentliche Projekt-Doku
├── CONTRIBUTING.md             # Beitrag-Leitfaden
├── LICENSE                     # MIT
└── .gitignore
```

## Modul-Verantwortlichkeiten

### `index.html`

- Single-Page-Application mit View-Containern
- Lädt alle CSS-Dateien via `<link>` (statt `@import`, für `file://`-Kompatibilität)
- Lädt alle JS-Module in strenger Abhängigkeits-Reihenfolge via `<script>`-Tags
- Enthält die statische HTML-Struktur für alle Views

### `css/`

- **Base**: Design-Tokens als CSS Custom Properties (`:root`), Universal-Reset
- **Layout**: App-Container, Sidebar (fixiert, 260px breit über `--sidebar-width`)
- **Components**: Wiederverwendbare Komponenten (Buttons, Toasts, Leer-Zustände)
- **Views**: Pro View eine eigene Datei (Dashboard, Levels, Typing, etc.)
- **Animations**: Zentrale `@keyframes` (vorher über Datei verstreut)
- **Responsive**: Media-Queries (768px Tablet, 480px Phone)
- **Wichtig**: Statt `@import` (welches bei `file://` CORS-Probleme macht)
  werden mehrere `<link>`-Tags verwendet.

### `js/core/` – Infrastruktur

#### `state.js`

- **Zentraler App-State** als Singleton
- Enthält: `view`, `topic`, `level`, `difficulty`, `calYear`, `calMonth`, `lastText`
- Zugriff über Getter/Setter (z. B. `State.topic = 'buchfuehrung'`)
- Vorher als Closure-Variablen in app.js gekapselt; jetzt explizit für
  modulübergreifenden Zugriff freigegeben.

#### `dom.js`

- DOM-Helper: `byId`, `all`, `escapeHtml`, `confirm`, `showToast`
- Rendering-Helper: `statCard` (Template), `classifyAccuracy`, `classifyWpm`
- Format-Helper: `formatDate` (de-DE), `formatTime` (m:ss)
- Löst die vorher in `app.js` mehrfach duplizierte Stat-Card-Templates auf.

#### `router.js`

- SPA-View-Routing
- Views registrieren sich via `Router.register(name, renderFn)`
- `Router.showView(name)` schaltet die `.active`-Klassen um und ruft Render-Fn auf
- Bindet die Sidebar-Navigation und Mobile-Toggle

### `js/engine/` – Persistenz und Tipp-Engine

#### `storage.js`

- LocalStorage-Wrapper mit JSON-Serialisierung
- Namespaced Keys (`tippTrainer_*`)
- Datenmodell:
    - `tippTrainer_progress`: Array aller Sessions
    - `tippTrainer_achievements`: Freigeschaltete Achievements mit Datum
    - `tippTrainer_levels`: Freigeschaltete Level pro Thema
    - `tippTrainer_settings`: Benutzereinstellungen (inkl. Prüfungsdatum)
    - `tippTrainer_calendar`: Kalenderdaten
    - `tippTrainer_xp`: XP-Punkte
- Fehlerbehandlung bei vollem Storage oder deaktiviertem LocalStorage
- Import-Validierung (Schema-Check) für Daten-Import

#### `typing.js`

- Tipp-Engine: Zeichen-weiser Vergleich Eingabe vs. Vorgabe
- Reiner Zustandsautomat mit Callbacks (`onChar`, `onFinish`, `onTimer`)
- Keine DOM-Kopplung – UI-Updates erfolgen über `getDisplayState()` beim Aufrufer
- Berechnet WPM (Wörter/Minute, 1 Wort = 5 Zeichen), CPM, Genauigkeit
- Timer-Verwaltung (Start bei erstem Tastendruck)

### `data/` – Text-Daten

#### `texts.js` (auch `js/engine/` zugehörig)

- Text-API: `getRandomText`, `getTexts`, `getAvailableLevels`, `getAllTopics`,
  `getTopicName`, `getTopicIcon`, `getTotalTextCount`
- Datenstruktur: `texts[topic][level][difficulty] = [text1, text2, ...]`
- 960 Basis-Texte (leicht/normal/schwer)
- Stellt `addTexts()` für Erweiterungs-Module bereit

#### `texts-extra.js` und `texts-sehrSchwer.js`

- Erweiterungs-Module, die ihre Texte via `apply()` in `Texts` einfügen
- `texts-extra.js`: 960+ zusätzliche Texte, 50 Fachwörter, 10 Satzrhythmus-Übungen, 7 Prüfungstexte
- `texts-sehrSchwer.js`: 320 Sehr-Schwer-Texte (4 Themen × 10 Level × 8 Texte, je 600–700 Zeichen)

### `js/services/` – Geschäftslogik

#### `levels.js`

- 4 Themenbereiche: Buchführung, Steuerrecht, Bilanzen/EÜR, Kosten- und Leistungsrechnung
- 10 Level pro Themenbereich
- 4 Schwierigkeitsstufen: leicht, normal, schwer, sehrSchwer
- Level-Freischaltlogik basierend auf Genauigkeit + Geschwindigkeit
- XP-Berechnung (`calculateXP`) und Level-Completion-Check (`checkLevelCompletion`)

#### `calendar.js`

- Monatsansicht mit Übungstagen
- Heatmap-Intensitäten (5 Stufen) über `--success-rgb` CSS-Variable
- Streak-Berechnung (aktuell, längste)
- `recordPractice(seconds)` registriert Übungstag

#### `progress.js`

- Historie aller Übungssessions
- Statistiken: `getOverallStats`, `getRecentSessions`, `getProgressForLevelDisplay`
- Countdown zum Prüfungsdatum (`getDaysUntilTarget`)

#### `achievements.js`

- 32 Achievements in 7 Kategorien (Meilensteine, Speed, Accuracy, Streaks, Themen, Zeit, Session)
- `checkAndUnlock(sessionData)` prüft nach jeder Session
- Liest State aus Storage, Calendar, Texts und Levels

#### `recommendation.js`

- Berechnet, ob nach einer Übung eine höhere Schwierigkeit empfohlen werden kann
- Prüft von der höchsten Stufe abwärts, welche Schwelle noch erreicht wird

#### `session-completion.js`

- Kapselt den gesamten Workflow nach Übungsabschluss:
    1. Session in Historie speichern (`Progress.addSession`)
    2. Kalender-Tag registrieren (`Calendar.recordPractice`)
    3. Level-Fortschritt prüfen (`Levels.checkLevelCompletion`)
    4. XP berechnen und gutschreiben (`Levels.calculateXP` + `Storage.addXP`)
    5. Achievements prüfen (`Achievements.checkAndUnlock`)
    6. Empfehlung berechnen (`Recommendation.recommend`)
- Gibt ein Ergebnis-Objekt zurück, das von der Result-View angezeigt wird

### `js/views/` – View-Module

Jedes View-Modul folgt dem gleichen Muster:

- IIFE-Pattern, exportiert `{ render }` und ggf. `{ bind }` oder weitere Funktionen
- Verwendet `Dom.*`-Helper für DOM-Zugriffe und Rendering
- Lesen/schreiben App-State über `State.*`
- Aufruf von Service-Modulen für Geschäftslogik

#### `chrome.js`

- Globale UI-Elemente außerhalb der Views: XP-Bar, Countdown-Badge, Settings-Label

#### `dashboard.js`

- Startseite mit Stat-Cards (Sessions, Ø WPM, Ø Accuracy, Beste WPM, Streak, Minuten)
- Themenkarten als Grid mit Klick-Handler
- Tabelle der letzten 5 Sessions

#### `levels.js`

- Schwierigkeits-Tabs (leicht/normal/schwer/sehrSchwer)
- 10 Level-Buttons pro Thema (locked/completed/open)
- Stat-Cards der letzten 3 freigeschalteten Level

#### `typing.js`

- Eingabe-Handling (Backspace über `keydown`, Zeichen über `input` für Linux-Kompatibilität)
- Live-Update von WPM/Accuracy/Time
- Rendert den Text mit Status-Klassen (pending/current/correct/incorrect)
- Globaler Escape-Handler für Result-Overlay

#### `result.js`

- Baut das Result-Modal auf (Stats, XP, Achievements, Empfehlung)
- Bindet Weiter-Buttons (Nochmal, Nächster Text, Nächstes Level, Zurück)

#### `calendar.js`

- Monatskalender mit Heatmap-Farbcodierung
- Monatsnavigation (vor/zurück)
- Streak-Statistiken

#### `achievements.js`

- Achievement-Grid nach Kategorien gruppiert
- Zusammenfassung (X von Y freigeschaltet)

#### `progress.js`

- Filter-Dropdowns (Thema, Level, Schwierigkeit)
- Stat-Cards, WPM-/Accuracy-Diagramme (Balken, letzte 30 Sessions)
- Sessions-Tabelle (letzte 20)

#### `settings.js`

- Datepicker für Prüfungsdatum
- Export/Import (JSON-Backup)
- Reset (Level-Fortschritt, Alle Daten)

### `app.js` – Bootstrap

- Nur ~60 Zeilen, enthält ausschließlich `App.init()`
- Initialisierungs-Reihenfolge:
    1. Text-Daten mergen (`TextsExtra.apply`, `TextsSehrSchwer.apply`)
    2. Views beim Router registrieren
    3. Initiale UI-Setups (Kalender-Datum, Bindings, Filter)
    4. XP- und Countdown-Anzeige aktualisieren
    5. Dashboard anzeigen

### `electron/` – Desktop-App-Wrapper (optional)

Die Web-App bleibt unverändert – Electron ist nur ein Chrome-Wrapper.

#### `main.cjs`

- Hauptprozess (CommonJS, da `package.json` `"type": "module"` nutzt)
- Öffnet ein `BrowserWindow` (1280×800, min 800×600)
- Lädt `index.html` per `loadFile()` (kein HTTP-Server nötig)
- Externe Links werden im Standard-Browser geöffnet (`shell.openExternal`)
- Sicherheits-Settings: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`

#### `preload.cjs`

- Security-Layer zwischen Renderer und Main
- Aktuell keine Exports – die Web-App läuft pur im Browser-Kontext

### `build/` – Build-Ressourcen

- `icon.svg`/`icon.png`: App-Icon für Linux-Desktop-Integration
- `tipptrainer-stbw.desktop`: Linux Desktop-Eintrag (für App-Menüs)
- `de.gr33n93.TippTrainer.metainfo.xml`: AppStream-Metadaten (für Software-Center, Flatpak)

### `electron-builder.yml` – Build-Konfiguration

- Definiert Linux-Targets: AppImage, deb, tar.gz, flatpak
- App-ID: `de.gr33n93.TippTrainer` (Reverse-DNS)
- Flatpak-Runtime: `org.freedesktop.Platform//23.08` mit Electron-BaseApp
- Schließt Dev-Dateien (`node_modules`, `dist`, `*.md`, etc.) aus dem Paket aus

## Lade-Reihenfolge (`<script>`-Tags in `index.html`)

```
1. core/         (state, dom)           - Infrastruktur, keine Abhängigkeiten
2. engine/       (storage, typing)      - Persistenz, Engine
3. data/         (texts, texts-extra,   - Text-Daten
                  texts-sehrSchwer)
4. services/     (levels, calendar,     - Geschäftslogik (abhängig von Engine)
                  progress, achievements,
                  recommendation,
                  session-completion)
5. core/         (router)               - Router (kennt View-Module)
6. views/        (chrome, dashboard,    - Rendering
                  levels, typing,
                  result, calendar,
                  achievements, progress,
                  settings)
7. app.js                               - Bootstrap
```

Da ES6-`import`/`export` nicht genutzt wird (für `file://`-Kompatibilität),
ist die Reihenfolge **essenziell**. Der Browser kann die Abhängigkeiten
nicht selbst auflösen.

## Datenfluss

```
Benutzer öffnet index.html
  → app.js initialisiert alle Module
  → storage.js lädt gespeicherten Zustand aus LocalStorage
  → TextsExtra/TextsSehrSchwer mergen ihre Texte in Texts

Benutzer wählt Thema (Dashboard-Klick)
  → State.topic wird gesetzt
  → Router.showView('levels')
  → LevelsView.render() zeigt Levelauswahl

Benutzer wählt Level + Schwierigkeit
  → Levels.checkLevelCompletion prüft Freischaltung
  → TypingView.start() holt Text aus Texts

Benutzer tippt
  → Typing.handleInput(char) verarbeitet jede Eingabe
  → TypingView.updateDisplay() rendert Status-Klassen
  → Live-WPM/Accuracy/Time werden aktualisiert

Übung abgeschlossen
  → Typing ruft TypingView.onFinish(stats) auf
  → SessionCompletion.complete(stats) orchestriert:
      - Progress.addSession
      - Calendar.recordPractice
      - Levels.checkLevelCompletion
      - Storage.addXP
      - Achievements.checkAndUnlock
      - Recommendation.recommend
  → ChromeView.updateXPDisplay() aktualisiert Sidebar
  → ResultView.show() zeigt Ergebnis-Overlay
  → Storage persistiert alles in LocalStorage
```

## Schwierigkeits- und Level-System

### Schwierigkeitsstufen

| Parameter                | Leicht              | Normal                | Schwer               | Sehr Schwer                 |
| ------------------------ | ------------------- | --------------------- | -------------------- | --------------------------- |
| Textlänge                | Kurz (20-40 Wörter) | Mittel (40-80 Wörter) | Lang (80-150 Wörter) | Sehr lang (600-700 Zeichen) |
| Min. Genauigkeit         | 85%                 | 90%                   | 95%                  | 97%                         |
| Min. WPM                 | 20                  | 35                    | 50                   | 75                          |
| XP-Belohnung             | 10-30               | 30-60                 | 60-100               | 100+                        |
| Sonderzeichen-Häufigkeit | Niedrig             | Mittel                | Hoch                 | Sehr hoch                   |

### Level-Fortschritt (pro Themenbereich)

- Level 1: Start immer freigeschaltet
- Level N+1 wird freigeschaltet wenn: Mindestens 1 Schwierigkeitsstufe im aktuellen Level bestanden
- Level 10: "Meister-Level" mit komplexen Prüfungslösungen

## Gamification

### XP-System

- XP pro Übung abhängig von Schwierigkeit, Genauigkeit und Geschwindigkeit
- Berechnung: `Levels.calculateXP(difficulty, accuracy, wpm, totalChars)`
- Level-Up bei XP-Schwellenwerten (`Storage.getXPThresholdForLevel`)
- Visueller XP-Balken in der Sidebar (`ChromeView.updateXPDisplay`)

### Achievements (32 in 7 Kategorien)

- **Meilensteine**: Erste Übung, 10/50/100/500 Übungen
- **Geschwindigkeit**: 40/60/80/100 WPM
- **Genauigkeit**: 95%/98%/100%
- **Streaks**: 3/7/14/30/50 Tage
- **Themen**: Bereichs-Abschlüsse
- **Zeit**: Morgens/Abends üben
- **Session**: Dauer, Anzahl Übungen, Extreme Challenge, Unfehlbar

## Externe Abhängigkeiten

- **Keine externen Bibliotheken oder CDNs**
- Alles wird mit Standard-Web-APIs implementiert
- Lokale Schriften (System-Fonts)

## Build / Test / Deploy

- **Kein Build-Prozess** – Direktes Öffnen der `index.html` im Browser
  (per `file://` oder lokalem HTTP-Server)
- **Test:** Manuell im Browser; optional `npm run lint` für Syntax-Check
- **Deploy:** Datei auf lokalen Rechner, öffnen per `file://`-Protokoll
  oder einfachem HTTP-Server (`python3 -m http.server`)

## Bekannte Risiken

- **LocalStorage-Limit:** ~5-10 MB pro Origin. Bei intensiver Nutzung über
  Monate kann Historie groß werden → Cleanup-Strategie oder Kompression
  implementieren.
- **Browser-Kompatibilität:** Keine IE-Unterstützung. Moderne Browser
  (Chrome, Firefox, Edge, Safari) werden unterstützt.
- **Tastatur-Layout:** Tool geht von deutschem QWERTZ-Layout aus. Andere
  Layouts werden nicht explizit unterstützt.
- **Datensicherheit:** Alle Daten liegen lokal. Kein Cloud-Backup. Bei
  Browser-Datenverlust sind Fortschritte weg → Export/Import-Funktion
  als Mitigation (in den Einstellungen).
