# Architektur

Dieses Dokument beschreibt die technischen Grenzen und den Datenfluss von TippTrainer StBW. Details,
die sich direkt aus einzelnen Funktionen ergeben, bleiben im Quellcode und in den Tests dokumentiert.

## Leitlinien

- Die Web-App muss ohne Build-Schritt per `file://` oder über einen einfachen HTTP-Server laufen.
- Fachlogik und Persistenz bleiben unabhängig vom DOM testbar.
- Es gibt kein Backend, keine Telemetrie und keine extern geladenen Laufzeitbibliotheken.
- Electron verpackt dieselbe Web-App und erweitert sie nicht um privilegierte Renderer-APIs.
- Nutzerdaten bleiben lokal und können nur bewusst als JSON-Datei exportiert werden.

## Verzeichnisstruktur

```text
.
├── index.html              Einstiegspunkt und statische Struktur der SPA
├── css/
│   ├── base/               Design-Tokens und Reset
│   ├── components/         Wiederverwendbare Bedienelemente
│   ├── layout/             Grundlayout und Navigation
│   ├── views/              Ansichtsbezogene Styles
│   ├── animations.css      Gemeinsame Animationen
│   └── responsive.css      Responsive Anpassungen
├── data/                   Text-API und Übungskorpus
├── js/
│   ├── core/               State, DOM-Helfer und Router
│   ├── engine/             Persistenz und Tipp-Engine
│   ├── services/           Fachlogik ohne View-Verantwortung
│   ├── views/              Rendering und Ereignisbindung
│   └── app.js              Initialisierung
├── electron/               Gehärtete Desktop-Hülle
├── build/                  Icons und Linux-Metadaten
├── tests/                  Node-, DOM-, Sicherheits- und Paketverträge
└── .github/workflows/      Quality- und Release-Pipeline
```

## Module und Abhängigkeiten

Die Browsermodule verwenden bewusst keine ES-Modulimporte. Dadurch funktioniert die Anwendung auch
beim direkten Öffnen der `index.html`. Die Reihenfolge der Skripte ist deshalb Teil des technischen
Vertrags:

```text
core/state, core/dom
        ↓
engine/storage, engine/typing
        ↓
data/texts, data/texts-extra, data/texts-sehrSchwer
        ↓
services/*
        ↓
core/router, views/*
        ↓
app.js
```

| Bereich       | Verantwortung                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| `js/core`     | Flüchtiger App-Zustand, sichere DOM-Helfer und Navigation                      |
| `js/engine`   | Validierte LocalStorage-Zugriffe und zustandsbasierte Zeichenauswertung        |
| `data`        | 960 Basistexte, 660 Ergänzungen und 320 Texte für „Sehr schwer“                |
| `js/services` | Level, XP, Kalender, Statistik, Leistungen, Empfehlungen und Session-Abschluss |
| `js/views`    | Rendering, Fokusführung und Eingabeereignisse                                  |
| `electron`    | Fenster, Navigationsschutz und Startprüfung                                    |

Der zusammengeführte Korpus umfasst 1.940 Texte in 4 Themen, 10 Leveln und 4 Schwierigkeitsstufen.
Jeder Auswahlpool wird beim Zusammenführen dedupliziert.

## Zustands- und Datenfluss

`State` enthält nur flüchtige Angaben zur Navigation, Übungsauswahl und angezeigten Kalendermonat.
Dauerhafte Daten verwaltet `Storage` unter dem Namensraum `tippTrainer_*`:

- Übungssitzungen und Kennzahlen
- freigeschaltete und bestandene Level
- Leistungen
- Kalenderdaten
- Einstellungen und Prüfungstermin
- XP und Nutzerlevel

Beim Abschluss einer Übung führt `SessionCompletion` die dauerhaften Änderungen in einer
Speichertransaktion aus:

```text
Typing
  → Session speichern
  → Kalendertag aktualisieren
  → Levelstatus prüfen
  → XP gutschreiben
  → Leistungen prüfen
```

Nach dem Transaktionsversuch berechnet der Service eine Schwierigkeitsempfehlung. `TypingView`
aktualisiert anschließend die globale XP-Anzeige und öffnet die Ergebnisansicht; ein Speicherfehler
wird dort sichtbar ausgewiesen.

Importdateien werden vollständig validiert. Schlägt eine Teiloperation fehl, wird der vorherige
Zustand wiederhergestellt. Ein Export enthält eine Formatversion, sämtliche Datenbereiche und einen
Zeitstempel.

## Level und Auswertung

Ein Level gilt in einer Schwierigkeitsstufe als bestanden, wenn beide Grenzwerte erreicht sind:

| Schwierigkeit | Genauigkeit | WPM | Basis-XP |
| ------------- | ----------: | --: | -------: |
| Leicht        |        85 % |  20 |       10 |
| Normal        |        90 % |  35 |       30 |
| Schwer        |        95 % |  50 |       60 |
| Sehr schwer   |        97 % |  75 |      100 |

Zur Basis kommen textlängenabhängige, Genauigkeits- und Geschwindigkeitsboni. Ein nicht bestandener
Versuch erhält 5 XP. Bestwerte für Tempo und Genauigkeit werden unabhängig voneinander erhalten.

## Oberfläche

Die Desktop-Navigation ist 284 Pixel breit. Das Layout passt Raster und Inhalte bei 1.050, 860, 768
und 540 Pixeln an; unter 768 Pixeln wird die Sidebar zu einem tastaturbedienbaren Drawer. Eine
zusätzliche Höhenregel verdichtet die Navigation auf kleinen Displays.

Sichtbare Zustände besitzen Fokuskennzeichnungen. Diagramme sind als beschriftete Listen erreichbar,
Dialoge halten den Fokus innerhalb ihres Inhalts, und reduzierte Bewegung wird über
`prefers-reduced-motion` berücksichtigt.

## Sicherheitsgrenzen

Der Electron-Renderer läuft mit `contextIsolation: true`, deaktivierter Node-Integration und aktiver
Sandbox. Das Preload-Skript stellt keine API bereit. Berechtigungsanfragen werden abgewiesen;
Top-Level-Navigation bleibt auf die lokale Anwendung beschränkt. Externe HTTP- und HTTPS-Links öffnen
im Standardbrowser.

Eine restriktive Content Security Policy verbietet externe Skripte, Netzwerkzugriffe, Frames und
Objekte. Dynamische Inhalte werden escaped oder über `textContent` gesetzt. Sicherheitsrelevante
Importdaten durchlaufen dieselben Schemaregeln wie intern gespeicherte Daten. Beim Import werden sie
strikt als vollständiger Datensatz geprüft; beim Lesen lokaler Bestandsdaten greifen sichere
Standardwerte und Filter.

## Qualität und Veröffentlichung

`npm run verify` bündelt Syntaxprüfung, ESLint, Formatkontrolle, Node-Tests, Coverage-Grenzen und
`npm audit`. Verbindliche Mindestwerte sind 90 % Zeilen-, 80 % Branch- und 85 %
Funktionsabdeckung.

Der Quality-Workflow prüft Node 22 und 24. Zusätzlich validiert Ubuntu 22.04 die AppStream- und
Desktop-Metadaten; ein nachgelagerter Job baut die Electron-App, untersucht das ASAR, testet mehrere
Viewports und startet die gepackte Binärdatei.

Der Release-Workflow baut das x86-64-AppImage erst nach einer Wiederholung der zentralen Prüfungen.
Bei einem Tag werden Paketversion, Tag und Zugehörigkeit zu `main` abgeglichen. GitHub veröffentlicht
anschließend das AppImage zusammen mit `SHA256SUMS.txt`.

## Bekannte Grenzen

- Browserdaten und Desktop-Daten liegen in getrennten Speichern; der Transfer erfolgt per Export und
  Import.
- Eine vollständige automatisierte Engine-Matrix aus Chromium, Firefox und WebKit besteht nicht.
- Das Zeichenmaterial ist für deutsches QWERTZ ausgelegt.
- Fachtexte ersetzen keine aktuellen amtlichen Quellen; ein vollständiges juristisches Inhaltsaudit
  bleibt eine fortlaufende Aufgabe.
