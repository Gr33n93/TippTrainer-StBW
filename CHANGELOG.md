# Änderungsverlauf

Alle wesentlichen Änderungen an TippTrainer StBW werden hier zusammengefasst. Das Format orientiert
sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/); die Versionsnummern folgen
[Semantic Versioning](https://semver.org/lang/de/).

## [Unveröffentlicht]

### Hinzugefügt

- Screenshots der aktuellen Desktop-Oberfläche
- Ko-fi-Verweis und GitHub-Funding-Konfiguration
- Vorlage für Funktionswünsche

### Geändert

- Öffentliche Dokumentation, Projektbeschreibung und GitHub-Metadaten überarbeitet
- Technische Angaben zu Textbestand, Tests, Browserunterstützung und Architektur korrigiert

## [1.1.1] – 2026-09-06

### Hinzugefügt

- Neues responsives Prüfungsatelier mit überarbeiteter Navigation, Tabellen, Diagrammen und Kalender
- 160 automatisierte Node-Tests sowie separate Electron-Layout-, Klick- und Paketprüfungen
- AppImage-Prüfsumme und reproduzierbarer Release-Dry-Run

### Geändert

- Electron, electron-builder, ESLint, Prettier und weitere Entwicklungswerkzeuge aktualisiert
- Textkorpus auf vier vollständig belegte Schwierigkeitsstufen erweitert und pro Auswahlpool
  dedupliziert
- Release-Pipeline auf Node 22 und 24 sowie Ubuntu 22.04 abgesichert

### Behoben

- Fehler bei Unicode-Eingaben, Timern, XP, Bestwerten, Kalenderwochen und Zeitzonen
- Atomarer Datenimport mit vollständiger Validierung und Rollback
- Fokusführung, Kontraste und Bedienung auf schmalen Bildschirmen
- AppStream-Kompatibilität mit der in Ubuntu 22.04 enthaltenen Validator-Version

### Sicherheit

- Electron-Renderer mit Sandbox, Navigationssperre und restriktiver CSP gehärtet
- Persistente HTML-Injektion und unvalidierte Importzustände verhindert
- Abhängigkeitsschwachstellen auf null bekannte npm-Befunde reduziert

Der öffentliche Tag `v1.1.0` erzeugte wegen einer AppStream-Inkompatibilität weder Binärartefakt noch
GitHub-Release. Er blieb unverändert; `v1.1.1` ist der ausgelieferte Folgerelease.

## [1.0.0] – 2026-06-14

### Hinzugefügt

- Erste öffentliche Version mit vier Themenbereichen und zehn Leveln
- Tipp-Engine mit Live-Werten für Geschwindigkeit und Genauigkeit
- Lokale Speicherung, XP, Leistungen, Kalender und Fortschrittsansichten
- JSON-Export und -Import des Lernstands
- Linux-Paketierung mit Electron

[Unveröffentlicht]: https://github.com/Gr33n93/TippTrainer-StBW/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/Gr33n93/TippTrainer-StBW/releases/tag/v1.1.1
[1.0.0]: https://github.com/Gr33n93/TippTrainer-StBW/releases/tag/v1.0.0
