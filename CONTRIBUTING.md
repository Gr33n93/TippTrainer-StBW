# Beitragen

Fehlerberichte, konkrete Verbesserungsvorschläge und nachvollziehbare Pull Requests sind willkommen.
Bitte prüfe vor größeren Änderungen kurz die vorhandenen Issues, damit Arbeit nicht doppelt entsteht.

## Lokale Einrichtung

Voraussetzungen:

- Node.js 22.22.2 oder neuer
- npm mit Unterstützung für Lockfile-Version 3
- Linux für die veröffentlichten Paketziele

```bash
git clone https://github.com/Gr33n93/TippTrainer-StBW.git
cd TippTrainer-StBW
npm ci
python3 -m http.server 8000
```

Die Web-App ist anschließend unter `http://localhost:8000` erreichbar. Sie besitzt keine
Laufzeitabhängigkeiten; `npm ci` installiert ausschließlich Entwicklungs- und Paketwerkzeuge.

## Qualitätsprüfungen

```bash
npm run syntax-check     # JavaScript-Syntax
npm run lint             # ESLint
npm run format:check     # Prettier ohne Änderungen
npm test                 # Node- und DOM-Tests
npm run test:coverage    # Tests mit verbindlichen Coverage-Grenzen
npm run verify           # vollständiges lokales Quality-Gate
```

`npm run test:layout` startet Electron und prüft Ansichten, Viewports, Zoom und echte Klicks. Der Test
benötigt lokal eine grafische Sitzung; unter Linux läuft er in GitHub Actions auf einem virtuellen
Display.

Änderungen an Logik, Persistenz, Metadaten oder Workflows benötigen passende Regressionstests. Bei
reinen Textänderungen müssen mindestens Formatkontrolle und Dokumentationsverträge erfolgreich sein.

## Codekonventionen

- Vier Leerzeichen Einrückung, Semikolons und einfache Anführungszeichen in JavaScript
- IIFE-Module für die Browser-App, damit `file://` weiterhin unterstützt wird
- Fachlogik in `js/services`, DOM-Code in `js/views`
- Persistenz ausschließlich über `js/engine/storage.js`
- Nutzerinhalte nie ungeprüft als HTML rendern
- Bestehende Design-Tokens und responsive Breakpoints verwenden

ESLint und Prettier sind maßgeblich. Automatische Korrekturen können mit `npm run lint:fix` und
`npm run format` angewendet werden.

## Pull Requests

1. Einen kleinen, thematisch geschlossenen Branch anlegen.
2. Commits eindeutig benennen; Conventional Commits wie `fix:`, `feat:`, `docs:` und `chore:` sind
   bevorzugt.
3. `npm run verify` ausführen und UI-Änderungen zusätzlich mit Tastatur und schmalem Viewport prüfen.
4. Im Pull Request Zweck, Prüfung und mögliche Daten- oder Kompatibilitätsrisiken beschreiben.
5. Erst mergen, wenn die verpflichtenden GitHub-Checks grün sind.

## Linux-Pakete bauen

```bash
npm run pack              # entpackte Electron-App
npm run dist:appimage     # AppImage
npm run dist:linux        # AppImage, deb, tar.gz und Flatpak
```

Für Flatpak werden `flatpak` und `flatpak-builder` sowie die in `electron-builder.yml` angegebenen
Freedesktop- und Electron-Runtimes benötigt. Build-Ergebnisse liegen unter `dist-electron/` und
gehören nicht ins Repository.

## Veröffentlichung

1. Version in `package.json`, `package-lock.json` und AppStream-Metadaten synchron aktualisieren.
2. Release-Änderungen per Pull Request prüfen und mergen.
3. Die Checks des neuen `main`-Commits vollständig abwarten.
4. `Release AppImage` manuell auf `main` ausführen; AppImage herunterladen und
   `sha256sum --check SHA256SUMS.txt` ausführen.
5. Lokales `main`, `origin/main` und Workflow-SHA abgleichen.
6. Einen neuen annotierten Tag `vX.Y.Z` erstellen und pushen. Veröffentlichte Tags werden nie
   verschoben oder wiederverwendet.
7. Tag-Workflow, GitHub-Release, Assets und Prüfsumme kontrollieren.

## Meldungen

Für Fehler und Funktionswünsche stehen strukturierte Issue-Vorlagen bereit. Sicherheitslücken gehören
nicht in öffentliche Issues; verwende dafür die in [SECURITY.md](SECURITY.md) beschriebene private
Meldung.

Mit einem Beitrag erklärst du dich damit einverstanden, dass er unter der
[MIT-Lizenz](LICENSE) veröffentlicht wird.
