# ⌨️ TippTrainer StBW

Browserbasierter 10-Finger-Tipptrainer mit Fokus auf Inhalte der
Steuerberaterprüfung (Steuerberater­kammer Baden-Württemberg). Trainiert
Tippgeschwindigkeit und -genauigkeit mit prüfungs­relevanten Fachtexten
aus Buchführung, Steuerrecht, Bilanzen/EÜR sowie Kosten- und
Leistungs­rechnung.

> **Hinweis:** Dieses Projekt ist eine Lern- und Tippübungs­applikation, nicht mit der
> Steuerberater­kammer Baden-Württemberg affiliiert und keine Steuer- oder Rechtsberatung. Rechtliche
> Inhalte können sich ändern und sollten mit aktuellen amtlichen Quellen abgeglichen werden.

## Features

- **4 Themenbereiche** (Buchführung, Steuerrecht, Bilanzen/EÜR, KLR) mit je 10 Leveln
- **4 Schwierigkeitsstufen** (leicht / normal / schwer / sehr schwer)
- **1.870+ unterschiedliche fachbezogene Übungstexte** ohne Wiederholungen im selben Auswahlpool
- **Echtzeit-Feedback** während des Tippens (WPM, CPM, Genauigkeit)
- **Gamification**: XP-System, 32 Achievements, Level-Freischaltungen
- **Übungskalender** mit Streak-Tracking (GitHub-Style-Heatmap)
- **Fortschritts­statistiken** mit Verlaufs­diagrammen
- **Konfigurierbares Prüfungs­datum** mit Countdown
- **Daten-Export/Import** (JSON) als Backup
- **Komplett clientseitig** – kein Backend, keine Tracking, läuft offline
- **Dark Theme** standardmäßig

## Schnellstart

Die App läuft auf zwei Arten:

### Variante 1: Im Browser (schnellster Weg)

```bash
# Option A: Direkt öffnen
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows

# Option B: Lokaler HTTP-Server (für konsistentere CORS-Bedingungen)
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

Alle Fortschritte werden lokal im `localStorage` des Browsers gespeichert.

### Variante 2: Als Linux-Desktop-App (AppImage)

Pre-kompilierte AppImages gibt es unter [Releases](https://github.com/Gr33n93/TippTrainer-StBW/releases).

**AppImage** (portable, keine Installation):

```bash
chmod +x TippTrainer-StBW-*.AppImage
./TippTrainer-StBW-*.AppImage
```

Ein Flatpak kann aus dem Quellcode gebaut werden; die Voraussetzungen stehen in
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

Die Desktop-App nutzt Electron als Chromium-Wrapper – die Web-App selbst bleibt unverändert. Fortschritte werden isoliert vom Browser gespeichert (Export/Import via Einstellungen zum Übertragen).

## Tastatur-Hinweis

Die App ist auf **deutsches QWERTZ-Layout** optimiert. Andere Layouts
(QWERTY, AZERTY, Dvorak) funktionieren prinzipiell, die Sonderzeichen
(§, %, €, &, etc.) liegen jedoch an anderen Positionen.

## Tech-Stack

- **HTML5** – Single-Page-Application
- **CSS3** – Dark Theme mit CSS Custom Properties, Responsive Design
- **Vanilla JavaScript (ES6+)** – IIFE-Modul-Pattern, keine Frameworks
- **LocalStorage** – Persistenz für Fortschritt, Achievements, Kalender
- **Keine externen Abhängigkeiten** – keine CDNs, keine Bibliotheken

## Projektstruktur

```
.
├── index.html              # SPA-Einstiegspunkt
├── css/                    # Stylesheets (Dark Theme, Layout, Views)
├── js/                     # JavaScript-Module
│   ├── core/               # State, Router, Utilities
│   ├── services/           # Levels, Calendar, Progress, Achievements
│   ├── views/              # View-Module (Dashboard, Typing, etc.)
│   ├── engine/             # Typing-Engine, Storage, Texts
│   └── app.js              # Bootstrap
├── data/                   # Text-Inhalte (gegliedert nach Schwierigkeit)
├── electron/               # Electron-Wrapper (Desktop-App)
│   ├── main.cjs            # Hauptprozess
│   ├── preload.cjs         # Security-Layer
│   └── icon.png            # App-Icon
├── build/                  # Build-Ressourcen (Icon, Desktop-Datei, Metainfo)
├── tests/                  # 125 Unit-, Integrations- und Sicherheitsregressionstests
├── electron-builder.yml    # Build-Konfiguration (Linux/Flatpak/AppImage)
├── .github/workflows/      # CI: Quality-Matrix + Desktop-App-Release
├── ARCHITECTURE.md         # Architektur-Dokumentation
├── PROGRESS.md             # Projektfortschritt / Changelog
└── LICENSE                 # MIT-Lizenz
```

Detaillierte Modul-Beschreibungen siehe [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Entwicklung

Die Web-App benötigt keinen Build-Step. Für die Entwicklung ist Node.js 22.22.2 oder neuer nötig:

```bash
npm ci                  # installiert ausschließlich die gelockten Dev-Werkzeuge
npm test                # 125 Unit- und Integrationstests
npm run test:coverage   # Tests plus Coverage-Grenzen
npm run verify          # Syntax, Lint, Format, Tests, Coverage und Security-Audit
```

Die App selbst hat **keine** Runtime-Abhängigkeiten – `npm install` ist
nur für Entwicklungs­werkzeuge nötig.

## Browser-Kompatibilität

Die App ist für aktuelle Browser mit modernen Web-APIs ausgelegt. Die automatisierte Suite prüft die
Geschäftslogik und den vollständigen DOM-Bootstrap; vor Releases bleibt ein manueller Smoke-Test in
Chromium und Firefox vorgesehen. Internet Explorer wird nicht unterstützt.

## Daten & Privatsphäre

- Alle Daten (Fortschritt, Statistiken, Einstellungen) liegen **ausschließlich lokal** im Browser.
- Es wird **keine Daten** an externe Server übertragen.
- Beim Löschen der Browser-Daten sind alle Fortschritte verloren – nutze
  den integrierten Export (Einstellungen → Daten → Exportieren) als Backup.

## Lizenz

[MIT](./LICENSE) – Copyright (c) 2026 gr33n93

## Beitragen

Fehler gefunden? Verbesserungs­vorschläge? Gerne als Issue oder Pull
Request auf GitHub.
