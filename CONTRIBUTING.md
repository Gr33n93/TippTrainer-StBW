# Beitragen

Danke, dass du zu **TippTrainer StBW** beitragen möchtest! Dieses Dokument
beschreibt den Entwicklungs-Workflow.

## Schnellstart für Entwickler

```bash
# Repository klonen
git clone https://github.com/Gr33n93/TippTrainer-StBW.git
cd TippTrainer-StBW

# Dev-Abhaengigkeiten installieren (Lint, Format, Electron, Build-Tools)
npm ci

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
    org.freedesktop.Platform//25.08 \
    org.freedesktop.Sdk//25.08 \
    org.electronjs.Electron2.BaseApp//25.08
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

1. **Release-Branch vorbereiten:** `npm run verify` ausführen und dieselbe neue Version in
   `package.json`, `package-lock.json` und den AppStream-Metadaten eintragen
2. **Release-PR prüfen:** Pull Request öffnen und alle erforderlichen Quality-Checks abwarten
3. **Nach `main` mergen:** anschließend auch die Checks des Merge-Commits abwarten
4. **Release-Build testen:** Workflow `Release AppImage` über "Run workflow" manuell auf
   `main` starten, das AppImage-Artefakt herunterladen und die Datei `SHA256SUMS.txt` prüfen
5. **Commit abgleichen:** sicherstellen, dass lokales `main`, `origin/main` und der geprüfte
   Workflow-Commit dieselbe SHA besitzen
6. **Neuen annotierten Tag erstellen:** `git tag -a vX.Y.Z -m "Release vX.Y.Z"` und mit
   `git push origin vX.Y.Z` veröffentlichen; vorhandene oder bereits veröffentlichte Tags nie
   verschieben oder wiederverwenden
7. **Tag-Workflow abwarten:** Der Tag startet `Release AppImage` und erstellt den GitHub-Release
8. **Release prüfen:** AppImage und `SHA256SUMS.txt` aus dem Release herunterladen und die
   SHA-256-Prüfsumme nochmals lokal verifizieren

## Code-Qualität

Vor jedem Commit bitte ausführen:

```bash
npm run check          # ESLint + Prettier-Check kombiniert
npm test               # Unit- und Integrationstests
npm run test:coverage  # Testlauf mit verbindlichen Coverage-Grenzen
npm run verify         # vollständiges lokales CI-Gate inklusive Security-Audit
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
3. `npm run verify` muss ohne Fehler durchlaufen
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
