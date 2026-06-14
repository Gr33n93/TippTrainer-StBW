# ⌨️ TippTrainer StBW

Browserbasierter 10-Finger-Tipptrainer mit Fokus auf Inhalte der
Steuerberaterprüfung (Steuerberater­kammer Baden-Württemberg). Trainiert
Tippgeschwindigkeit und -genauigkeit mit prüfungs­relevanten Fachtexten
aus Buchführung, Steuerrecht, Bilanzen/EÜR sowie Kosten- und
Leistungs­rechnung.

> **Hinweis:** Dieses Projekt ist eine Lern- und Übungs­applikation und
> nicht mit der Steuerberater­kammer Baden-Württemberg affiliiert.

## Features

- **4 Themenbereiche** (Buchführung, Steuerrecht, Bilanzen/EÜR, KLR) mit je 10 Leveln
- **4 Schwierigkeitsstufen** (leicht / normal / schwer / sehr schwer)
- **2.240+ Prüfungstexte** mit fachlich korrektem Inhalt
- **Echtzeit-Feedback** während des Tippens (WPM, CPM, Genauigkeit)
- **Gamification**: XP-System, 32 Achievements, Level-Freischaltungen
- **Übungskalender** mit Streak-Tracking (GitHub-Style-Heatmap)
- **Fortschritts­statistiken** mit Verlaufs­diagrammen
- **Konfigurierbares Prüfungs­datum** mit Countdown
- **Daten-Export/Import** (JSON) als Backup
- **Komplett clientseitig** – kein Backend, keine Tracking, läuft offline
- **Dark Theme** standardmäßig

## Schnellstart

Die App läuft auf drei Arten:

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

### Variante 2: Als Linux-Desktop-App (AppImage / Flatpak)

Pre-kompilierte Pakete gibt es unter [Releases](https://github.com/Gr33n93/TippTrainer-StBW/releases).

**AppImage** (portable, keine Installation):

```bash
chmod +x TippTrainer-StBW-*.AppImage
./TippTrainer-StBW-*.AppImage
```

**Flatpak**:

```bash
flatpak install --user TippTrainer-StBW-*.flatpak
flatpak run de.gr33n93.TippTrainer
```

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
├── electron-builder.yml    # Build-Konfiguration (Linux/Flatpak/AppImage)
├── .github/workflows/      # CI: Lint + Desktop-App-Build
├── ARCHITECTURE.md         # Architektur-Dokumentation
├── PROGRESS.md             # Projektfortschritt / Changelog
└── LICENSE                 # MIT-Lizenz
```

Detaillierte Modul-Beschreibungen siehe [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Entwicklung

Es gibt keinen Build-Step. Für Linting und Formatierung (optional):

```bash
npm install        # installiert dev-only Tools (ESLint, Prettier)
npm run lint       # JS-Linting
npm run format     # Auto-Formatierung
```

Die App selbst hat **keine** Runtime-Abhängigkeiten – `npm install` ist
nur für Entwicklungs­werkzeuge nötig.

## Browser-Kompatibilität

Getestet auf aktuellen Versionen von:

- Chrome / Chromium
- Firefox
- Edge
- Safari

Internet Explorer wird nicht unterstützt.

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
