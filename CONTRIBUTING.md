# Beitragen

Danke, dass du zu **TippTrainer StBW** beitragen möchtest! Dieses Dokument
beschreibt den Entwicklungs-Workflow.

## Schnellstart für Entwickler

```bash
# Repository klonen
git clone https://github.com/Gr33n93/TippTrainer-StBW.git
cd TippTrainer-StBW

# Dev-Abhaengigkeiten installieren (Lint, Format, Electron, Build-Tools)
npm install

# App im Browser testen
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
# oder: python3 -m http.server 8000
```

Die App hat **keine Runtime-Abhängigkeiten** – `npm install` ist nur für
die Entwicklungs-Werkzeuge (ESLint, Prettier, Electron, electron-builder) nötig.

## Desktop-App bauen (Linux)

### Variante A: Lokal bauen

Voraussetzung für Flatpak-Builds:

```bash
# Debian/Ubuntu
sudo apt-get install flatpak flatpak-builder
flatpak remote-add --user --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install --user -y flathub \
    org.freedesktop.Platform//23.08 \
    org.freedesktop.Sdk//23.08 \
    org.electronjs.Electron2.BaseApp//23.08
```

Dann:

```bash
# Alle Linux-Targets (AppImage, deb, tar.gz, flatpak)
npm run dist:linux

# Nur ein Target
npm run dist:appimage
npm run dist:flatpak
```

Ergebnisse liegen in `dist-electron/`. Für Tests ohne finales Paket:

```bash
npm run pack            # nur entpackt (schneller)
npm start               # App direkt in Electron starten (ohne Build)
```

### Variante B: Via GitHub Actions (empfohlen)

1. **Tag erstellen:** `git tag v1.0.0 && git push origin v1.0.0`
2. **CI baut automatisch:** Workflow `Build Desktop App` startet
3. **Artefakte herunterladen:** Im Tab "Actions" → Run → "Artifacts"
4. **Oder Release:** Bei Tags wird automatisch ein GitHub-Release mit Downloads erstellt

## Code-Qualität

Vor jedem Commit bitte ausführen:

```bash
npm run check          # ESLint + Prettier-Check kombiniert
npm run lint:fix       # ESLint-Auto-Fixes
npm run format         # Dateien mit Prettier formatieren
```

## Code-Konventionen

- **JavaScript**: IIFE-Modul-Pattern (keine ES6-Module, um `file://`-Kompatibilität zu bewahren)
- **Einrückung**: 4 Spaces (siehe `.editorconfig`)
- **Namen**:
    - Module: `PascalCase` (`Storage`, `LevelsView`)
    - Funktionen/Variablen: `camelCase`
    - Private Helper: `_`-Präfix (`_key`, `_getState`)
- **Style**:
    - Single Quotes für Strings
    - Kein trailing Comma
    - Semikolons immer
- **Datei-Organisation**:
    - `js/core/` – Infrastruktur (State, Dom, Router)
    - `js/engine/` – Persistenz und Tipp-Engine
    - `js/services/` – Geschäftslogik (keine DOM-Kopplung)
    - `js/views/` – DOM-Rendering und UI-Events
    - `data/` – Reine Text-Daten

## Architektur

Siehe [`ARCHITECTURE.md`](./ARCHITECTURE.md) für die detaillierte
Modul-Übersicht und Datenfluss-Beschreibung.

## Pull Requests

1. Feature-Branch erstellen (`git checkout -b feature/mein-feature`)
2. Logische Commits mit klaren Messages (Konventional Commits bevorzugt):
    - `feat:` neues Feature
    - `fix:` Bugfix
    - `refactor:` Code-Umstrukturierung ohne Verhaltensänderung
    - `docs:` Dokumentation
    - `chore:` Build, Tooling, CI
3. `npm run check` muss ohne Fehler durchlaufen
4. PR mit klarer Beschreibung des Changes erstellen

## Issues

Bitte nur Issues mit folgenden Angaben erstellen:

- Klare Beschreibung des Problems/Wunschs
- Schritte zur Reproduktion (bei Bugs)
- Erwartetes vs. tatsächliches Verhalten
- Browser + Version

## Lizenz

Durch das Einreichen von Beiträgen stimmst du zu, dass diese unter der
[MIT-Lizenz](./LICENSE) veröffentlicht werden.
