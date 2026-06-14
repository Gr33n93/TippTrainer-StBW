'use strict';

const Texts = (() => {
    const TOPICS = {
        BUCHFUEHRUNG: 'buchfuehrung',
        STEUERRECHT: 'steuerrecht',
        BILANZEN: 'bilanzen',
        KLR: 'klr'
    };

    const TOPIC_NAMES = {
        buchfuehrung: 'Buchführung',
        steuerrecht: 'Steuerrecht',
        bilanzen: 'Bilanzen / EÜR',
        klr: 'Kosten- und Leistungsrechnung'
    };

    const TOPIC_ICONS = {
        buchfuehrung: '📒',
        steuerrecht: '⚖️',
        bilanzen: '📊',
        klr: '📈'
    };

    const DIFFICULTY_NAMES = {
        leicht: 'Leicht',
        normal: 'Normal',
        schwer: 'Schwer',
        sehrSchwer: 'Sehr Schwer'
    };

    const texts = {
        buchfuehrung: {
            1: {
                leicht: [
                    'Soll und Haben',
                    'Konto und Bilanz',
                    'Umsatz und Ertrag',
                    'Aufwand und Ertrag',
                    'Kasse und Bank',
                    'Guthaben und Schulden',
                    'Einnahme und Ausgabe',
                    'Bestand und Zugang',
                    'Miete und Zinsen',
                    'Ware und Einkauf'
                ],
                normal: [
                    'Die Buchführung dient der Erfassung aller Geschäftsvorfälle.',
                    'Jeder Beleg muss chronologisch erfasst werden.',
                    'Das Inventar zeigt alle Vermögensgegenstände.',
                    'Die Bilanz zeigt die Finanzlage des Unternehmens.',
                    'Offene Posten müssen regelmäßig abgestimmt werden.',
                    'Der Kontenrahmen strukturiert alle Kontenarten.',
                    'Steuerberater prüfen die Buchführung jährlich.',
                    'Umsatzsteuer wird auf alle steuerbaren Umsätze erhoben.',
                    'Der Jahresabschluss umfasst Bilanz und GuV.',
                    'Rückstellungen werden für ungewisse Verbindlichkeiten gebildet.'
                ],
                schwer: [
                    'Die doppelte Buchführung ist die Grundlage der Finanzbuchhaltung eines jeden Unternehmens und verlangt eine exakte Zuordnung jedes Geschäftsvorfalls auf Soll- und Habenseite.',
                    'Sämtliche Geschäftsvorfälle müssen gemäß den Grundsätzen ordnungsmäßiger Buchführung zeitnah, vollständig und fehlerfrei erfasst und dokumentiert werden.',
                    'Der Unterschied zwischen Betriebsausgaben und Werbungskosten ist für die steuerliche Gewinnermittlung von entscheidender Bedeutung und muss sauber getrennt werden.',
                    'Bei der Bewertung von Vermögensgegenständen sind die Vorschriften des Handelsgesetzbuchs und der Abgabenordnung strikt zu beachten und anzuwenden.'
                ]
            },
            2: {
                leicht: [
                    'Soll an Bank',
                    'Bank an Haben',
                    'Kasse an Eigenkapital',
                    'Wareneingang an Verbindlichkeiten',
                    'Forderungen an Umsatzerlöse',
                    'Bank an Darlehen',
                    'Miete an Bank',
                    'Gehalt an Bank',
                    'Abschreibung an Anlagevermögen',
                    'Umsatzsteuer an Bank'
                ],
                normal: [
                    'Buchungssatz: Bank an Erlöse aus Warenverkäufen.',
                    'Der Buchungssatz lautet: Wareneingang an Verbindlichkeiten aus Lieferungen.',
                    'Abschreibungen werden auf das Anlagevermögen gebucht.',
                    'Die Umsatzsteuer ist als Verbindlichkeit gegenüber dem Finanzamt zu erfassen.',
                    'Eigenkapital wird bei Gesellschaftsgründung ins Konto eingestellt.',
                    'Der Kassenbestand muss täglich mit dem Kassenbuch übereinstimmen.',
                    'Rückläufige Forderungen sind als Aufwand zu verbuchen.',
                    'Privateinlagen erhöhen das Eigenkapital des Unternehmens.',
                    'Die Vorsteuer aus Eingangsrechnungen darf abgezogen werden.',
                    'Jahresabschlussbuchungen erfolgen zum Stichtag am 31. Dezember.'
                ],
                schwer: [
                    'Der zusammengesetzte Buchungssatz lautet: Büromöbel an Bank und Vorsteuer, wobei die Vorsteuer separat auszuweisen und an das Finanzamt abzuführen ist.',
                    'Bei der Bewertung von Forderungen ist ein Einzelwertberichtigungsbedarf zu prüfen und gegebenenfalls durch entsprechende Buchungssätze im Jahresabschluss zu berücksichtigen.',
                    'Die Umkehrung eines Buchungssatzes (Stornobuchung) muss zwingend mit demselben Betrag und denselben Konten erfolgen, um die Buchführung nicht zu verfälschen.',
                    'Bei teilbaren Geschäftsvorfällen sind die einzelnen Bestandteile auf separate Konten zu buchen und müssen sich in der Summe exakt mit dem Gesamtbetrag decken.'
                ]
            },
            3: {
                leicht: [
                    'Konto 1000 Kasse',
                    'Konto 1200 Bank',
                    'Konto 1400 Forderungen',
                    'Konto 1600 Verbindlichkeiten',
                    'Konto 2000 Eigenkapital',
                    'Konto 3000 Umsatzerlöse',
                    'Konto 4000 Wareneingang',
                    'Konto 5700 Miete',
                    'Konto 6300 Gehälter',
                    'Konto 1700 Umsatzsteuer'
                ],
                normal: [
                    'Im Kontenrahmen werden alle Konten systematisch geordnet.',
                    'Bestandskonten zeigen den Stand von Vermögen und Schulden.',
                    'Erfolgskonten erfassen Aufwand und Ertrag des Geschäftsjahres.',
                    'Der Saldo ergibt sich aus der Differenz von Soll und Haben.',
                    'Die T-Konten-Form visualisiert die Buchungen übersichtlich.',
                    'Schlussbilanzkonten werden am Jahresende erstellt.',
                    'Die Kontenklassen sind im Industriekontenrahmen standardisiert.',
                    'Gemischte Konten müssen am Jahresende aufgelöst werden.',
                    'Ergänzungskonten dienen der Korrektur von Hauptkonten.',
                    'Der Kontenplan wird individuell auf das Unternehmen angepasst.'
                ],
                schwer: [
                    'Der Industriekontenrahmen gliedert sich in Kontenklassen von null bis neun, wobei Klasse null für die Abschlusskonten und Klasse eins für das Anlagevermögen reserviert sind.',
                    'Bei der Erstellung des Kontenplans muss das Unternehmen eine sinnvolle Auswahl aus dem Kontenrahmen treffen und diese um betriebsspezifische Konten ergänzen, falls dies erforderlich ist.',
                    'Die richtige Zuordnung von Geschäftsvorfällen zu Konten verlangt fundierte Kenntnisse der Bilanzierungsregeln und der Systematik des verwendeten Kontenrahmens.',
                    'Transitorische Posten müssen am Jahresende durch zeitliche Abgrenzung auf separate Konten gebucht werden, um den periodengerechten Erfolg zu ermitteln.'
                ]
            },
            4: {
                leicht: [
                    'Umsatzsteuer 19 Prozent',
                    'Vorsteuer abziehbar',
                    'Steuerbefreite Umsätze',
                    'Kleinunternehmerregelung',
                    'Steuerbarer Umsatz',
                    'Steuerschuldnerschaft',
                    'Umsatzsteuervoranmeldung',
                    'Zahlungsziel 30 Tage',
                    'Skonto 2 Prozent',
                    'Zielkauf auf Rechnung'
                ],
                normal: [
                    'Die Umsatzsteuer beträgt regulär 19 Prozent des Nettobetrags.',
                    'Vorsteuer aus Eingangsrechnungen darf gegen Umsatzsteuer verrechnet werden.',
                    'Der Kleinunternehmer kann nach Paragraf 19 UStG auf Umsatzsteuer verzichten.',
                    'Bei Zielkauf erhält der Käufer ein Zahlungsziel von meist 30 Tagen.',
                    'Skonto ist ein Preisnachlass für Zahlung vor Fälligkeit.',
                    'Die Umsatzsteuervoranmeldung ist monatlich oder vierteljährlich abzugeben.',
                    'Bei steuerbefreiten Umsätzen entfällt die Umsatzsteuerpflicht vollständig.',
                    'Der Bruttobetrag ergibt sich aus Netto plus Umsatzsteuer.',
                    'Die Vorsteuer muss in der Umsatzsteuererklärung nachgewiesen werden.',
                    'Eine Gutschrift ist die umgekehrte Rechnung durch den Leistungsempfänger.'
                ],
                schwer: [
                    'Bei der Berechnung des Skontos ist zu beachten, dass die Umsatzsteuer vom Nettobetrag berechnet wird und der Skontoabzug sowohl den Warenwert als auch den darauf entfallenden Umsatzsteueranteil umfasst.',
                    'Die umsatzsteuerliche Beurteilung von gemischten Leistungen erfordert eine genaue Prüfung, ob die Leistung einheitlich oder nach unterschiedlichen Steuersätzen zu beurteilen ist.',
                    'Der Vorsteuerabzug ist nur zulässig, wenn eine rechtmäßige Rechnung mit allen Pflichtangaben vorliegt und die Leistung für das Unternehmen bezogen wurde.',
                    'Bei der Dauerfristverlängerung für die Umsatzsteuervoranmeldung ist eine Sondervorauszahlung in Höhe von einem Elftel der Jahressteuer zu leisten.'
                ]
            },
            5: {
                leicht: [
                    'Anlagevermögen buchen',
                    'Umlaufvermögen prüfen',
                    'Fremdkapital aufnehmen',
                    'Eigenkapital erhöhen',
                    'Jahresabschluss erstellen',
                    'Inventur durchführen',
                    'Bewertung vornehmen',
                    'Rückstellungen bilden',
                    'Abschreibungen berechnen',
                    'Eröffnungsbilanz feststellen'
                ],
                normal: [
                    'Das Anlagevermögen umfasst alle langfristig genutzten Wirtschaftsgüter.',
                    'Umlaufvermögen umfasst Vorräte, Forderungen und flüssige Mittel.',
                    'Die Inventur muss zu jedem Bilanzstichtag durchgeführt werden.',
                    'Rückstellungen werden für ungewisse Verbindlichkeiten und Aufwendungen gebildet.',
                    'Abschreibungen verteilen die Anschaffungskosten auf die Nutzungsdauer.',
                    'Die Eröffnungsbilanz schließt an den Jahresabschluss des Vorjahres an.',
                    'Eigenkapital haftet den Gläubigern als Sicherheit.',
                    'Fremdkapital verursacht Zinsaufwand und muss getilgt werden.',
                    'Der Gewinn wird durch Eigenkapitalentnahme oder Thesaurierung verwendet.',
                    'Die Schlussbilanz ist Grundlage der Eröffnungsbilanz des Folgejahres.'
                ],
                schwer: [
                    'Bei der Bewertung des Anlagevermögens ist zwischen Anschaffungs- und Herstellungskosten zu unterscheiden, wobei anschaffungsnahe Herstellungskosten von drei Prozent der Anschaffungskosten überschritten werden müssen.',
                    'Niedrige Bewertungsvorbehalte nach dem Handelsrecht erlauben eine Bewertung von Vermögensgegenständen unterhalb der Anschaffungskosten, wenn ein dauerhafter Wertverlust feststellbar ist.',
                    'Die Bildung von Drohverlustrückstellungen ist zwingend erforderlich, wenn am Bilanzstichtag erkennbar wird, dass ein Vertrag zu Verlusten führen wird und der Verkaufswert unter dem Buchwert liegt.',
                    'Stille Reserven entstehen durch die vorsichtige Bewertung von Vermögensgegenständen und können bei Veräußerung zu außerplanmäßigen Erträgen im Jahresabschluss führen.'
                ]
            },
            6: {
                leicht: [
                    'Kassenbuch führen',
                    'Bankkonto abstimmen',
                    'Belege nummerieren',
                    'Rechnungen prüfen',
                    'Zahlungen zuordnen',
                    'Konten abstimmen',
                    'Offene Posten klären',
                    'Stornobuchung durchführen',
                    'Korrekturbuchung vornehmen',
                    'Saldenliste erstellen'
                ],
                normal: [
                    'Das Kassenbuch muss täglich aktualisiert und abgerechnet werden.',
                    'Die Bankabstimmung gleicht die Bankbuchungen mit den Kontoauszügen ab.',
                    'Jeder Beleg erhält eine fortlaufende Nummer im Journal.',
                    'Eingangsrechnungen sind auf Richtigkeit und Vollständigkeit zu prüfen.',
                    'Die Kontenabstimmung stellt die Richtigkeit der Buchführung sicher.',
                    'Offene Posten werden in der Debitoren- und Kreditorenbuchhaltung verwaltet.',
                    'Stornobuchungen korrigieren fehlerhafte Buchungen im laufenden Jahr.',
                    'Die Saldenliste zeigt den Stand aller Konten zum Stichtag.',
                    'Eine ordnungsgemäße Belegablage ist für die Betriebsprüfung erforderlich.',
                    'Der Buchungsbeleg ist Grundlage jeder Verbuchung im System.'
                ],
                schwer: [
                    'Bei der Bankabstimmung sind alle zeitlichen Differenzen zwischen Bankauszug und Buchführung zu ermitteln, zu dokumentieren und gegebenenfalls durch Anpassungsbuchungen zu korrigieren.',
                    'Die Aufbewahrungspflicht für Buchführungsunterlagen beträgt zehn Jahre und beginnt mit dem Schluss des Kalenderjahres, in dem die Unterlagen erstellt wurden.',
                    'Eine elektronische Buchführung muss den Grundsätzen zum Datenzugriff und zur Prüfbarkeit digitaler Unterlagen entsprechen und eine Verfahrensdokumentation aufweisen.',
                    'Die GoBD definieren die Anforderungen an die Ordnungsmäßigkeit der Buchführung in elektronischer Form sowie den Datenzugriff durch die Finanzverwaltung.'
                ]
            },
            7: {
                leicht: [
                    'Gewinn ermitteln',
                    'Aufwendungen buchen',
                    'Erträge erfassen',
                    'GuV erstellen',
                    'Betriebsergebnis berechnen',
                    'Zwischenergebnis ausweisen',
                    'Steuern berechnen',
                    'Jahresüberschuss feststellen',
                    'Bilanzgewinn ermitteln',
                    'Rücklagen bilden'
                ],
                normal: [
                    'Die Gewinn- und Verlustrechnung erfasst alle Erträge und Aufwendungen des Jahres.',
                    'Der Jahresüberschuss ist das Ergebnis vor Gewinnabführung und Ausschüttung.',
                    'Betriebsergebnis und neutrales Ergebnis ergeben zusammen das Unternehmensergebnis.',
                    'Die GuV kann nach dem Gesamtkostenverfahren oder Umsatzkostenverfahren erstellt werden.',
                    'Zinserträge und Zinsaufwendungen sind getrennt auszuweisen.',
                    'Steuern vom Einkommen und Ertrag mindern den Jahresüberschuss.',
                    'Die Bildung von gesetzlichen Rücklagen ist für Kapitalgesellschaften Pflicht.',
                    'Der Bilanzgewinn steht nach Ausschüttung und Rücklagenbildung zur Verfügung.',
                    'Außerordentliche Erträge und Aufwendungen sind gesondert zu kennzeichnen.',
                    'Das Betriebsergebnis zeigt die Leistungsfähigkeit des Kerngeschäfts.'
                ],
                schwer: [
                    'Das Gesamtkostenverfahren stellt den Gesamtumsatz den gesamten Herstellungskosten der Periode gegenüber, während das Umsatzkostenverfahren die Kosten nach Funktionen wie Herstellung, Verwaltung und Vertrieb gliedert.',
                    'Bei der Ergebnisermittlung sind außerordentliche und periodenfremde Erträge und Aufwendungen separat auszuweisen, da diese für die Beurteilung der nachhaltigen Ertragskraft nicht relevant sind.',
                    'Die Veränderung des Eigenkapitals zwischen zwei Bilanzstichtagen ergibt sich aus dem Jahresergebnis, den Einlagen, den Entnahmen und den Kapitalrückzahlungen an die Gesellschafter.',
                    'Bei Personengesellschaften erfolgt die Gewinnverteilung gemäß dem Gesellschaftsvertrag und kann auch ungleich der Beteiligungsverhältnisse vereinbart sein.'
                ]
            },
            8: {
                leicht: [
                    'Umlaufvermögen bewerten',
                    'Vorräte erfassen',
                    'Forderungen bewerten',
                    'Wertpapiere ausweisen',
                    'Flüssige Mittel prüfen',
                    'Verbindlichkeiten gliedern',
                    'Langfristige Schulden',
                    'Kurzfristige Verbindlichkeiten',
                    'Leasingverträge buchen',
                    'Pachtzahlungen erfassen'
                ],
                normal: [
                    'Vorräte sind zum niedrigeren Wert aus Anschaffungskosten und Marktvalue zu bewerten.',
                    'Zweifelhafte Forderungen sind durch Einzelwertberichtigung abzusichern.',
                    'Wertpapiere des Umlaufvermögens können zum beizulegenden Zeitwert bewertet werden.',
                    'Langfristige Verbindlichkeiten haben eine Restlaufzeit von mehr als einem Jahr.',
                    'Leasingraten sind bei operating Leasing als Aufwand zu verbuchen.',
                    'Die Bewertung von Rückstellungen hat in Höhe des voraussichtlichen Werts zu erfolgen.',
                    'Kurzfristige Verbindlichkeiten sind innerhalb eines Jahres fällig.',
                    'Pachtzahlungen für Betriebsgrundstücke sind als Betriebsausgabe abziehbar.',
                    'Eventualverbindlichkeiten werden unter der Bilanz als Haftungsverhältnis ausgewiesen.',
                    'Die Fristigkeit der Verbindlichkeiten ist im Anhang darzustellen.'
                ],
                schwer: [
                    'Bei der Bewertung von Finanzinstrumenten im Umlaufvermögen ist zwischen der fortgeführten Anschaffungskostenmethode und der Fair-Value-Bewertung zu unterscheiden, wobei Wertminderungen im Erfolg zu erfassen sind.',
                    'Die Umklassifizierung von langfristigen in kurzfristige Verbindlichkeiten hat zu erfolgen, wenn die Restlaufzeit zum Bilanzstichtag weniger als ein Jahr beträgt und keine Verlängerungsvereinbarung besteht.',
                    'Bei der Bewertung von Rückstellungen für Pensionen ist das Anwartschaftsdeckungsverfahren anzuwenden und der Barwert der künftigen Pensionsverpflichtungen unter Berücksichtigung biometrischer Rechnungsgrundlagen zu ermitteln.',
                    'Ein erfolgsneutraler Eigenkapitalwechsel liegt vor, wenn Kapitalrücklagen in offene Rücklagen umgewandelt werden oder bei einer Kapitalerhöhung aus Gesellschaftsmitteln.'
                ]
            },
            9: {
                leicht: [
                    'Umwandlung prüfen',
                    'Verschmelzung vorbereiten',
                    'Spaltung durchführen',
                    'Formwechsel anmelden',
                    'Einbringung bewerten',
                    'Umgründung steuerlich prüfen',
                    'Sachgründung bewerten',
                    'Bewertungsguthaben feststellen',
                    'Auseinandersetzungsbilanz',
                    'Eröffnungsbilanz erstellen'
                ],
                normal: [
                    'Bei der Verschmelzung durch Aufnahme geht das übertragende Unternehmen auf den Übernehmer über.',
                    'Die Spaltung ermöglicht die Aufteilung eines Unternehmens auf mehrere Rechtsträger.',
                    'Der Formwechsel ändert die Rechtsform ohne Vermögensübertragung.',
                    'Sachgründungen erfordern eine besondere Prüfung durch einen Prüfer.',
                    'Die Einbringung von Betriebsvermögen kann nach Buchwert oder gemeinem Wert erfolgen.',
                    'Steuerliche Rückwirkungen bei Umgründungen sind sorgfältig zu prüfen.',
                    'Die Auseinandersetzungsbilanz wird bei Auflösung einer Personengesellschaft erstellt.',
                    'Gründungskosten dürfen als sofort abziehbarer Betriebsausgabe gebucht werden.',
                    'Bei der Sachgründung müssen die eingelegten Gegenstände bewertet werden.',
                    'Die Eröffnungsbilanz nach Umwandlung muss die Werte der Schlussbilanz übernehmen.'
                ],
                schwer: [
                    'Bei der Verschmelzung nach dem Umwandlungsgesetz ist der Verschmelzungsvertrag zwingend durch einen Verschmelzungsbericht zu ergänzen und von einem Prüfer auf die Angemessenheit des Umtauschverhältnisses zu überprüfen.',
                    'Die steuerneutrale Einbringung nach Paragraf 20 UmwStG setzt voraus, dass die eingebrachten Betriebsvermögenswerte in der steuerlichen Schlussbilanz zwingend mit den Buchwerten angesetzt werden.',
                    'Bei der Abspaltung eines Teilbetriebs müssen die gemeinsamen Kosten und Verbindlichkeiten verursachungsgerecht auf die Rechtsnachfolger aufgeteilt werden, wobei stille Reserven aufgedeckt werden können.',
                    'Der Formwechsel einer GmbH in eine AG erfordert die Zustimmung einer Dreiviertelmehrheit der Gesellschafter und die Eintragung im Handelsregister mit konstitutiver Wirkung.'
                ]
            },
            10: {
                leicht: [
                    'Jahresabschluss prüfen',
                    'Testat erteilen',
                    'Bestätigungsvermerk',
                    'Prüfungsbericht erstellen',
                    'Wirtschaftsprüfung',
                    'Abschlussprüfer bestellen',
                    'Prüfungsplan aufstellen',
                    'Prüfungshandlungen durchführen',
                    'Prüfungsausschlussgründe',
                    'Berichterstattungspflicht'
                ],
                normal: [
                    'Der Abschlussprüfer prüft den Jahresabschluss auf Übereinstimmung mit den gesetzlichen Vorschriften.',
                    'Der Bestätigungsvermerk enthält das Prüfungsurteil des Abschlussprüfers.',
                    'Kapitalgesellschaften müssen ihren Jahresabschluss durch einen Abschlussprüfer prüfen lassen.',
                    'Der Prüfungsbericht dokumentiert die Prüfungsfeststellungen und wird dem Aufsichtsrat vorgelegt.',
                    'Der Abschlussprüfer muss unabhängig und unparteiisch sein.',
                    'Prüfungsausschlussgründe sind in Paragraf 319 HGB geregelt.',
                    'Der Prüfungsplan legt Art, Umfang und Zeitplan der Prüfung fest.',
                    'Eine eingeschränkte Bestätigung wird bei Einschränkungen des Prüfungsumfangs erteilt.',
                    'Die Verweigerung des Bestätigungsvermerks hat gravierende Folgen für das Unternehmen.',
                    'Der Prüfungshinweis weist auf besondere Sachverhalte im Jahresabschluss hin.'
                ],
                schwer: [
                    'Der Abschlussprüfer hat im Rahmen seiner Prüfung die Einhaltung der Grundsätze ordnungsmäßiger Buchführung zu beurteilen und festzustellen, ob der Jahresabschluss ein den tatsächlichen Verhältnissen entsprechendes Bild der Vermögens-, Finanz- und Ertragslage vermittelt.',
                    'Bei Vorliegen von Prüfungsausschlussgründen nach Paragraf 319 Absatz 2 bis 4 HGB darf der Abschlussprüfer den Auftrag nicht annehmen und muss gegebenenfalls die Bestellung ablehnen oder niederlegen.',
                    'Der verschlüsselte Bestätigungsvermerk nach IDW PS 400 enthält eine detaillierte Darstellung des Prüfungsumfangs, der durchgeführten Prüfungshandlungen und der Beurteilung des Prüfungsergebnisses einschließlich aller wesentlichen Abweichungen.',
                    'Im Falle einer Schlussbesprechung mit dem Mandanten hat der Prüfer alle wesentlichen Feststellungen offenzulegen und dem Mandanten Gelegenheit zur Stellungnahme zu geben, bevor der Prüfungsbericht finalisiert wird.'
                ]
            }
        },

        steuerrecht: {
            1: {
                leicht: [
                    'Einkommensteuer',
                    'Umsatzsteuer',
                    'Gewerbesteuer',
                    'Körperschaftsteuer',
                    'Abgabenordnung',
                    'Finanzamt',
                    'Steuererklärung',
                    'Steuerbescheid',
                    'Einspruch einlegen',
                    'Steuernummer'
                ],
                normal: [
                    'Die Einkommensteuer wird auf das zu versteuernde Einkommen erhoben.',
                    'Umsatzsteuer fällt bei Lieferungen und sonstigen Leistungen an.',
                    'Die Abgabenordnung ist das allgemeine Steuerverfahrensrecht.',
                    'Gegen einen Steuerbescheid kann innerhalb eines Monats Einspruch eingelegt werden.',
                    'Jeder Steuerpflichtige muss eine Steuernummer beim Finanzamt beantragen.',
                    'Die Gewerbesteuer wird auf den Gewerbeertrag von Unternehmen erhoben.',
                    'Die Körperschaftsteuer betrifft Kapitalgesellschaften und Vereine.',
                    'Eine Steuererklärung muss fristgerecht eingereicht werden.',
                    'Verspätungszuschläge können bei fehlender Steuererklärung festgesetzt werden.',
                    'Der Vorläufigkeitsvermerk auf dem Steuerbescheid erlaubt spätere Änderungen.'
                ],
                schwer: [
                    'Die Einkommensteuer wird nach dem Progressionstarif berechnet, wobei der Steuersatz mit steigendem zu versteuerndem Einkommen ansteigt und bei einem Spitzensatz von 42 Prozent gedeckelt ist.',
                    'Die Abgabenordnung regelt nicht nur das Steuerverfahrensrecht sondern auch die steuerliche Betriebsprüfung, die Außenprüfung und die Steueraufsicht und bildet damit das Fundament des gesamten Steuerrechts.',
                    'Bei der Geltendmachung von Sonderausgaben sind die betragsmäßigen Grenzen und Voraussetzungen des Einkommensteuergesetzes strikt zu beachten, da Überschreitungen steuerlich nicht berücksichtigt werden.',
                    'Das Verhältnis zwischen nationalen Steuergesetzen und dem Unionsrecht kann zu Konflikten führen, die im Einzelfall durch Vorlage an den Europäischen Gerichtshof zu klären sind.'
                ]
            },
            2: {
                leicht: [
                    'Einkünfte aus Gewerbe',
                    'Einkünfte aus Landwirtschaft',
                    'Einkünfte aus Vermietung',
                    'Einkünfte aus Kapital',
                    'Einkünfte aus Arbeit',
                    'Sonstige Einkünfte',
                    'Zusammenveranlagung',
                    'Einzelveranlagung',
                    'Steuerklasse eins',
                    'Grundfreibetrag'
                ],
                normal: [
                    'Einkünfte aus Gewerbebetrieb unterliegen der Gewinneinkünfteermittlung.',
                    'Einkünfte aus nichtselbständiger Arbeit werden nach dem Überschuss der Einnahmen ermittelt.',
                    'Bei der Zusammenveranlagung werden die Einkommen beider Ehegatten zusammengefasst.',
                    'Der Grundfreibetrag stellt das Existenzminimum steuerfrei.',
                    'Einkünfte aus Vermietung und Verpachtung umfassen alle Mieteinnahmen abzüglich Werbungskosten.',
                    'Kapitalertragsteuer wird auf Zinsen, Dividenden und Kursgewinne erhoben.',
                    'Die Einkünfteermittlung unterscheidet zwischen Gewinn- und Überschusseinkünften.',
                    'Sonstige Einkünfte umfassen Renten und Spekulationsgewinne.',
                    'Bei Ehegatten kann zwischen Zusammen- und Einzelveranlagung gewählt werden.',
                    'Die Steuerklasse bestimmt die Höhe des monatlichen Lohnsteuerabzugs.'
                ],
                schwer: [
                    'Die Einkünfte aus Gewerbebetrieb werden durch Betriebsvermögensvergleich oder durch Einnahmenüberschussrechnung ermittelt, wobei der Betriebsvermögensvergleich zwingend bei Buchführungspflicht anzuwenden ist.',
                    'Die Verlustverrechnung unterliegt Beschränkungen, insbesondere bei Verlusten aus gewerblicher Tierzucht, bei Verlusten aus Termingeschäften und bei Verlusten aus der Veräußerung von Beteiligungen.',
                    'Bei der Ermittlung der Einkünfte aus Vermietung und Verpachtung dürfen alle Werbungskosten abgezogen werden, die mit der Erzielung der Einnahmen in wirtschaftlichem Zusammenhang stehen.',
                    'Der Progressionsvorbehalt greift bei bestimmten steuerfreien Einkünften, die dennoch in die Berechnung des Steuersatzes einbezogen werden und so den Steuersatz auf die übrigen Einkünfte erhöhen.'
                ]
            },
            3: {
                leicht: [
                    'Paragraf 4 EStG',
                    'Paragraf 5 EStG',
                    'Paragraf 6 EStG',
                    'Paragraf 7 EStG',
                    'Betriebsausgaben',
                    'Werbungskosten',
                    'Sonderausgaben',
                    'Außergewöhnliche Belastungen',
                    'Freibeträge nutzen',
                    'Pauschbeträge abziehen'
                ],
                normal: [
                    'Nach Paragraf 4 Absatz 4 EStG sind Betriebsausgaben der Werbungskosten gleichgestellt.',
                    'Paragraf 5 EStG regelt die Gewinnermittlung durch Betriebsvermögensvergleich.',
                    'Die AfA nach Paragraf 7 EStG verteilt die Anschaffungskosten auf die Nutzungsdauer.',
                    'Werbungskosten sind Aufwendungen zur Erwerbung und Erhaltung von Einnahmen.',
                    'Sonderausgaben umfassen Versicherungsbeiträge und Spenden.',
                    'Außergewöhnliche Belastungen mindern das Einkommen bei besonderen Härten.',
                    'Der Arbeitnehmer-Pauschbetrag beträgt 1230 Euro jährlich.',
                    'Die Vorsorgeaufwendungen sind als Sonderausgaben bis zu bestimmten Höchstbeträgen abziehbar.',
                    'Kinderfreibeträge berücksichtigen die kindbezogenen Freibeträge.',
                    'Behinderten-Pauschbeträge werden bei Nachweis der Behinderung gewährt.'
                ],
                schwer: [
                    'Nach Paragraf 4 Absatz 4 EStG dürfen Betriebsausgaben nur abgezogen werden, wenn sie durch den Betrieb veranlasst sind, was eine objektive Veranlassung durch den Betrieb und eine subjektive Veranlassung durch den Steuerpflichtigen voraussetzt.',
                    'Die degressive AfA nach Paragraf 7 Absatz 2 EStG ermöglicht in den ersten Jahren höhere Abschreibungsbeträge und führt zu einer zeitlichen Verlagerung des Aufwands in die frühen Nutzungsjahre des Wirtschaftsguts.',
                    'Bei außergewöhnlichen Belastungen nach Paragraf 33 EStG ist eine zumutbare Belastung zu berechnen, die von der Höhe des Gesamtbetrags der Einkünfte, der Familienverhältnisse und der Kinderzahl abhängt.',
                    'Die Abgrenzung zwischen Betriebsausgaben und privaten Aufwendungen ist bei gemischter Veranlassung durch eine auftragsbezogene Aufteilung vorzunehmen, wenn eine klare Trennung möglich ist.'
                ]
            },
            4: {
                leicht: [
                    'Umsatzsteuer 19 Prozent',
                    'Ermäßigter Steuersatz',
                    'Vorsteuerabzug',
                    'Steuerbefreiung prüfen',
                    'Ort der Lieferung',
                    'Ort der Leistung',
                    'Steuerentrichtung',
                    'Umsatzsteuererklärung',
                    'Zusammenfassende Meldung',
                    'Innergemeinschaftlicher Erwerb'
                ],
                normal: [
                    'Der Regelsteuersatz der Umsatzsteuer beträgt 19 Prozent.',
                    'Der ermäßigte Steuersatz von 7 Prozent gilt für Lebensmittel und Bücher.',
                    'Der Vorsteuerabzug setzt eine ordnungsgemäße Rechnung voraus.',
                    'Bei innergemeinschaftlichen Lieferungen greift die Steuerbefreiung.',
                    'Der Ort der Lieferung bestimmt, wo die Umsatzsteuer anfällt.',
                    'Die Zusammenfassende Meldung ist für innergemeinschaftliche Umsätze erforderlich.',
                    'Innergemeinschaftliche Erwerbe unterliegen der Erwerbsbesteuerung im Empfangsland.',
                    'Die Umsatzsteuervoranmeldung wird monatlich oder vierteljährlich erstellt.',
                    'Kleinunternehmer nach Paragraf 19 UStG weisen keine Umsatzsteuer aus.',
                    'Die Umsatzsteuer ist bis zum zehnten des Folgemonats zu entrichten.'
                ],
                schwer: [
                    'Der Vorsteuerabzug nach Paragraf 15 UStG ist nur zulässig, wenn die Leistung für das Unternehmen bezogen wurde, eine rechtmäßige Rechnung mit allen Pflichtangaben vorliegt und keine Ausschlussgründe nach Paragraf 15b UStG eingreifen.',
                    'Bei der Bestimmung des Ortes der sonstigen Leistung nach Paragraf 3a UStG ist zwischen B2B- und B2C-Leistungen zu unterscheiden, wobei bei B2B-Leistungen grundsätzlich der Empfängerort maßgeblich ist.',
                    'Der Übergang der Steuerschuldnerschaft nach Paragraf 13b UStG führt dazu, dass der Leistungsempfänger die Umsatzsteuer schuldet und gleichzeitig den Vorsteuerabzug geltend machen kann, sofern die Voraussetzungen erfüllt sind.',
                    'Die Berichtigung des Vorsteuerabzugs nach Paragraf 15a UStG ist erforderlich, wenn sich die Verhältnisse innerhalb des Berichtigungszeitraums von fünf Jahren bei Grundstücken zehn Jahren ändern.'
                ]
            },
            5: {
                leicht: [
                    'Einkommensteuererklärung',
                    'Anlage N Arbeitnehmer',
                    'Anlage KAP Kapitalerträge',
                    'Anlage V Vermietung',
                    'Anlage G Gewerbe',
                    'Anlage R Rente',
                    'Anlage Kind',
                    'Anlage Sonderausgaben',
                    'Anlage Außergewöhnliches',
                    'Anlage Vorsorgeaufwand'
                ],
                normal: [
                    'Die Einkommensteuererklärung muss bis zum 31. Juli des Folgejahres eingereicht werden.',
                    'Anlage N erfasst alle Einkünfte aus nichtselbständiger Arbeit.',
                    'In der Anlage KAP werden Zinsen und Dividenden eingetragen.',
                    'Die Anlage V dient der Erklärung von Einkünften aus Vermietung.',
                    'Anlage G wird für gewerbliche Einkünfte benötigt.',
                    'Die Anlage Kind beantragt Kindergeld und Kinderfreibeträge.',
                    'Steuerberater können die Frist zur Einreichung verlängern.',
                    'Die elektronische Steuererklärung wird über ELSTER abgewickelt.',
                    'Einkommensteuerbescheide ergehen nach Prüfung durch das Finanzamt.',
                    'Nach Ablauf der Einspruchsfrist wird der Bescheid bestandskräftig.'
                ],
                schwer: [
                    'Die freiwillige Abgabe der Einkommensteuererklärung ist innerhalb von vier Jahren möglich und empfiehlt sich insbesondere dann, wenn withholding Steuern zu viel abgezogen wurden oder besondere Freibeträge geltend gemacht werden können.',
                    'Bei der elektronischen Übermittlung der Steuererklärung über ELSTER müssen die Daten mit einer qualifizierten elektronischen Signatur versehen werden, wenn die Erklärung durch einen Steuerberater übermittelt wird.',
                    'Die Berichtigungspflicht nach Paragraf 153 AO verpflichtet den Steuerpflichtigen, nachträglich erkannte Fehler in Steuererklärungen unverzüglich anzuzeigen und zu korrigieren, auch wenn der Bescheid bereits bestandskräftig ist.',
                    'Der Vorläufigkeitsvermerk auf dem Einkommensteuerbescheid wegen ausstehender Rechtsprechung des Bundesfinanzhofs ermöglicht eine spätere Änderung des Bescheids, wenn das Gericht entscheidet.'
                ]
            },
            6: {
                leicht: [
                    'Gewerbesteuer berechnen',
                    'Gewerbeertrag ermitteln',
                    'Steuermessbetrag feststellen',
                    'Hebesatz anwenden',
                    'Freibetrag beachten',
                    'Gewerbesteuererklärung',
                    'Hinzurechnungen vornehmen',
                    'Kürzungen gewähren',
                    'Zerlegung durchführen',
                    'Vorauszahlungen leisten'
                ],
                normal: [
                    'Die Gewerbesteuer wird auf den Gewerbeertrag des Unternehmens erhoben.',
                    'Der Freibetrag für Einzelunternehmer und Personengesellschaften beträgt 24500 Euro.',
                    'Der Steuermessbetrag ergibt sich aus dem Gewerbeertrag multipliziert mit der Steuermesszahl.',
                    'Der Hebesatz wird von der jeweiligen Gemeinde festgelegt.',
                    'Hinzurechnungen erhöhen den Gewerbeertrag um bestimmte Finanzierungsaufwendungen.',
                    'Kürzungen mindern den Gewerbeertrag um bestimmte steuerfreie Erträge.',
                    'Die Zerlegung verteilt die Gewerbesteuer auf mehrere Betriebsstätten.',
                    'Gewerbesteuer-Vorauszahlungen sind vierteljährlich zu leisten.',
                    'Die Gewerbesteuererklärung ist beim zuständigen Finanzamt einzureichen.',
                    'Kapitalgesellschaften haben keinen Freibetrag bei der Gewerbesteuer.'
                ],
                schwer: [
                    'Die Hinzurechnung nach Paragraf 8 GewStG umfasst ein Viertel der Entgelte für Schulden, ein Fünftel der Miet- und Pachtzinsen und die Hälfte der Konzessionsabgaben, wodurch der Gewerbeertrag künstlich erhöht wird.',
                    'Die Zerlegung des Steuermessbetrags nach Paragraf 28 GewStG erfolgt im Verhältnis der Arbeitslöhne und hat zur Folge, dass jede Betriebsstättengemeinde ihren Anteil an der Gewerbesteuer erhält.',
                    'Die erweiterte Kürzung nach Paragraf 9 Nummer 2 GewStG begünstigt Unternehmen, die ausschließlich eigene Grundstücke verwalten und nutzen, was zu einer erheblichen Steuerersparnis führen kann.',
                    'Bei der Festsetzung der Gewerbesteuer-Vorauszahlungen ist der voraussichtliche Gewerbeertrag des laufenden Erhebungszeitraums zugrunde zu legen, wobei der letzte Festsetzungsbescheid als Richtschnur dient.'
                ]
            },
            7: {
                leicht: [
                    'Außenprüfung anmelden',
                    'Betriebsprüfung vorbereiten',
                    'Prüfungszeitraum festlegen',
                    'Prüfungsschwerpunkte',
                    'Stichprobenverfahren',
                    'Verprobung durchführen',
                    'Prüfungsbericht lesen',
                    'Prüfungsfeststellungen',
                    'Steuerhinterziehung',
                    'Steuerverkürzung'
                ],
                normal: [
                    'Die Außenprüfung wird durch das Finanzamt bei bestimmten Steuerpflichtigen durchgeführt.',
                    'Der Prüfungszeitraum umfasst in der Regel drei Veranlagungszeiträume.',
                    'Der Prüfer hat das Recht, alle geschäftlichen Unterlagen einzusehen.',
                    'Stichproben dienen der Überprüfung der Buchführungsqualität.',
                    'Die Verprobung vergleicht betriebliche Kennzahlen mit branchenüblichen Werten.',
                    'Im Prüfungsbericht werden alle Feststellungen detailliert dokumentiert.',
                    'Prüfungsfeststellungen können zu Steueränderungsbescheiden führen.',
                    'Steuerhinterziehung ist eine Straftat nach Paragraf 370 AO.',
                    'Die leichtfertige Steuerverkürzung ist als Ordnungswidrigkeit eingestuft.',
                    'Der Steuerpflichtige hat das Recht, einen Berater hinzuzuziehen.'
                ],
                schwer: [
                    'Die Außenprüfung nach Paragraf 193 ff. AO wird bei Steuerpflichtigen durchgeführt, die einen Umsatz von mehr als 600000 Euro oder einen Gewinn von mehr als 60000 Euro erklären und umfasst die Prüfung aller steuerlichen Verhältnisse des Prüfungszeitraums.',
                    'Die Verprobungsmethoden der Betriebsprüfung umfassen die Zeitreihenanalyse, die Richtsatzsatzung und den Kassenverprobungsrechner, die sämtlich der Plausibilitätskontrolle der erklärten Einkünfte dienen.',
                    'Bei Feststellung von steuerlichen Fehlern im Rahmen der Außenprüfung ist zwischen einfachen Buchführungsfehlern, systematischen Fehlern und vorsätzlichen Manipulationen zu unterscheiden, was unterschiedliche rechtliche Folgen hat.',
                    'Die Selbstanzeige nach Paragraf 371 AO ermöglicht bei rechtzeitiger und vollständiger Offenlegung der Steuerhinterziehung Straffreiheit, sofern keine Sperrgründe wie die Einleitung eines Strafverfahrens vorliegen.'
                ]
            },
            8: {
                leicht: [
                    'Einspruch einlegen',
                    'Antrag stellen',
                    'Frist wahren',
                    'Begründung schreiben',
                    'Aussetzung der Vollziehung',
                    'Einspruchsentscheidung',
                    'Finanzgericht klagen',
                    'Revision einlegen',
                    'BFH-Urteil anfechten',
                    'Verfassungsbeschwerde'
                ],
                normal: [
                    'Der Einspruch gegen einen Steuerbescheid muss innerhalb eines Monats eingelegt werden.',
                    'Die Aussetzung der Vollziehung hemmt die Vollstreckung des Bescheids.',
                    'Der Einspruch ist schriftlich oder zur Niederschrift beim Finanzamt einzulegen.',
                    'Eine Begründung des Einspruchs sollte die rechtlichen Argumente enthalten.',
                    'Die Einspruchsentscheidung ergeht durch das Finanzamt nach Prüfung.',
                    'Gegen die Einspruchsentscheidung kann Klage vor dem Finanzgericht erhoben werden.',
                    'Das Finanzgericht entscheidet in erster Instanz über steuerliche Streitigkeiten.',
                    'Revision zum Bundesfinanzhof ist nur bei grundsätzlicher Bedeutung zulässig.',
                    'Die Verfassungsbeschwerde ist das letzte rechtliche Mittel im Steuerrecht.',
                    'Außergerichtliche Einigungen durch Teilverzicht beschleunigen das Verfahren.'
                ],
                schwer: [
                    'Der Einspruch nach Paragraf 354 AO hat aufschiebende Wirkung, das heißt der angefochtene Verwaltungsakt darf nicht vollzogen werden, es sei denn, die Behörde ordnet die sofortige Vollziehung an, was gesondert zu begründen ist.',
                    'Die Klage vor dem Finanzgericht ist innerhalb eines Monats nach Zustellung der Einspruchsentscheidung zu erheben und hat suspensive Wirkung, wodurch der angefochtene Bescheid bis zur Rechtskraft nicht vollzogen werden darf.',
                    'Die Revision zum Bundesfinanzhof nach Paragraf 115 FGO ist nur zulässig, wenn das Finanzgericht die Revision zugelassen hat oder der Bundesfinanzhof auf Beschwerde die Revision zulässt, wobei die Zulassung bei grundsätzlicher Bedeutung der Rechtssache erfolgt.',
                    'Die Wiedereinsetzung in den vorigen Stand nach Paragraf 56 FGO ist möglich, wenn ein Beteiligter ohne Verschulden an der Einhaltung einer Frist gehindert wurde und den Wiedereinsetzungsantrag innerhalb von zwei Wochen nach Wegfall des Hindernisses stellt.'
                ]
            },
            9: {
                leicht: [
                    'Steuerstundung beantragen',
                    'Ratenzahlung vereinbaren',
                    'Steuererlass beantragen',
                    'Fristverlängerung beantragen',
                    'Vollstreckung abwenden',
                    'Kontopfändung vermeiden',
                    'Steuer-ID beantragen',
                    'Unbedenklichkeitsbescheinigung',
                    'Steuerliche Bescheinigung',
                    'Bestätigung des Finanzamts'
                ],
                normal: [
                    'Eine Steuerstundung ist bei vorübergehender Zahlungsunfähigkeit möglich.',
                    'Ratenzahlungen können beim Finanzamt formlos beantragt werden.',
                    'Der Steuererlass aus sachlichen Billigkeitsgründen ist in Paragraf 227 AO geregelt.',
                    'Die Fristverlängerung für die Steuererklärung wird auf Antrag gewährt.',
                    'Vollstreckungsmaßnahmen können durch Zahlung oder Stundung abgewendet werden.',
                    'Die Kontopfändung erfolgt durch die Vollziehungsstelle des Finanzamts.',
                    'Die steuerliche Identifikationsnummer ist bundeseinheitlich und lebenslang gültig.',
                    'Unbedenklichkeitsbescheinigungen werden bei Grundstücksverkäufen benötigt.',
                    'Die Bescheinigung über die Steuerpflicht kann vom Arbeitgeber verlangt werden.',
                    'Bestätigungen des Finanzamts sind in bestimmten Rechtsverkehrssituationen erforderlich.'
                ],
                schwer: [
                    'Die Stundung von Steuern nach Paragraf 222 AO setzt voraus, dass die Einziehung der Steuer eine erhebliche Härte darstellen würde und der Anspruch durch die Stundung nicht gefährdet erscheint, wobei die Stundung in der Regel gegen Sicherheitsleistung zu gewähren ist.',
                    'Der Erlass von Steuern nach Paragraf 227 AO aus persönlichen Billigkeitsgründen erfordert eine exakte Darlegung der wirtschaftlichen Verhältnisse des Steuerpflichtigen und ist eine Ermessensentscheidung der Finanzbehörde.',
                    'Die Vollstreckung nach Paragraf 249 ff. AO umfasst die Pfändung von Forderungen, die Zwangsvollstreckung in das unbewegliche Vermögen und die Pfändung von körperlichen Sachen, wobei die Vollstreckungshandlungen in einem strengen gesetzlichen Rahmen durchzuführen sind.',
                    'Die Anordnung der Duldungskontopfändung nach Paragraf 309 AO ermöglicht es dem Finanzamt, trotz Pfändung des Kontos bestimmte Zahlungen wie Lohnzahlungen an den Steuerpflichtigen zu ermöglichen, um dessen Existenzsicherung zu gewährleisten.'
                ]
            },
            10: {
                leicht: [
                    'Erbschaftsteuer',
                    'Schenkungsteuer',
                    'Grunderwerbsteuer',
                    'Solidaritätszuschlag',
                    'Kirchensteuer',
                    'Steuerabkommen',
                    'Doppelbesteuerung',
                    'Hinzurechnungsbesteuerung',
                    'AStG-Prüfung',
                    'Steuerliche Außenprüfung'
                ],
                normal: [
                    'Die Erbschaftsteuer wird auf den Erwerb von Todes wegen erhoben.',
                    'Schenkungen zu Lebzeiten unterliegen der Schenkungsteuer.',
                    'Der Grunderwerbsteuer unterliegen alle Grundstücksübertragungen.',
                    'Der Solidaritätszuschlag wird als Zuschlag zur Einkommensteuer erhoben.',
                    'Die Kirchensteuer beträgt 8 oder 9 Prozent der Einkommensteuer.',
                    'Doppelbesteuerungsabkommen verhindern eine doppelte Besteuerung.',
                    'Die Hinzurechnungsbesteuerung nach dem AStG verhindert Steuervermeidung.',
                    'Freibeträge bei der Erbschaftsteuer hängen vom Verwandtschaftsverhältnis ab.',
                    'Steuerklassen bei der Erbschaftsteuer reichen von eins bis drei.',
                    'Die steuerliche Prüfung von Auslandssachverhalten erfordert besondere Sorgfalt.'
                ],
                schwer: [
                    'Die Hinzurechnungsbesteuerung nach Paragraf 7 bis 14 AStG erfasst passive Einkünfte aus Zwischengesellschaften in Niedrigsteuerländern, die einem effektiven Steuersatz von weniger als 25 Prozent unterliegen, und unterwirft diese Einkünfte der deutschen Besteuerung auch ohne Ausschüttung.',
                    'Die Bewertung von Grundbesitz für die Erbschaftsteuer erfolgt nach dem Bedarfswertverfahren, wobei zwischen Wohnungs- und Teileigentum, Ein- und Zweifamilienhäusern sowie Mehrfamilienhäusern unterschieden wird und jeweils unterschiedliche Bewertungsmethoden anzuwenden sind.',
                    'Doppelbesteuerungsabkommen nach dem OECD-Musterabkommen regeln die Verteilung des Besteuerungsrechts zwischen dem Ansässigkeitsstaat und dem Quellenstaat und können durch das Besteuerungsrecht nach demnationalen Recht gehen.',
                    'Die erweiterte beschränkte Steuerpflicht nach Paragraf 2 Außensteuergesetz erfasst deutsche Staatsbürger mit Wohnsitz im Ausland, die wesentliche wirtschaftliche Beziehungen zu Deutschland unterhalten und sie bestimmten deutschen Steuern unterwirft.'
                ]
            }
        },

        bilanzen: {
            1: {
                leicht: [
                    'Aktiva und Passiva',
                    'Vermögen und Schulden',
                    'Eigenkapitalquote',
                    'Fremdkapitalzins',
                    'Anlagevermögen',
                    'Umlaufvermögen',
                    'Langfristige Schulden',
                    'Kurzfristige Schulden',
                    'Bilanzsumme',
                    'Jahresüberschuss'
                ],
                normal: [
                    'Die Bilanz zeigt die Vermögens- und Kapitalstruktur eines Unternehmens.',
                    'Aktiva umfassen alle Vermögensgegenstände des Unternehmens.',
                    'Passiva zeigen die Mittelherkunft aus Eigen- und Fremdkapital.',
                    'Die Bilanzsumme ist auf Aktiv- und Passivseite identisch.',
                    'Das Eigenkapital haftet den Gläubigern als Sicherheit.',
                    'Die Eigenkapitalquote zeigt die finanzielle Stabilität.',
                    'Anlagevermögen wird langfristig im Unternehmen genutzt.',
                    'Umlaufvermögen umfasst kurzfristig verfügbare Mittel.',
                    'Die Bilanz ist am Jahresabschlussstichtag zu erstellen.',
                    'Jeder Kaufmann ist zur Aufstellung einer Bilanz verpflichtet.'
                ],
                schwer: [
                    'Die Bilanzierungspflicht ergibt sich aus Paragraf 242 HGB und trifft jeden Kaufmann, wobei der Jahresabschluss aus der Bilanz und der Gewinn- und Verlustrechnung besteht und den Anforderungen des Paragraf 264 HGB entsprechen muss.',
                    'Die Gliederung der Bilanz für Kapitalgesellschaften ist in Paragraf 266 HGB verbindlich vorgeschrieben und unterscheidet zwischen Anlagevermögen, Umlaufvermögen, Eigenkapital, Rückstellungen und Verbindlichkeiten.',
                    'Das Vorsichtsprinzip als zentraler Bilanzierungsgrundsatz verlangt, dass Vermögensgegenstände höchstens zu ihren Anschaffungskosten bewertet werden dürfen und Verbindlichkeiten in voller Höhe auszuweisen sind.',
                    'Die Stetigkeit der Bilanzierung verlangt, dass die Bilanzierungsmethoden von Jahr zu Jahr beibehalten werden, um die Vergleichbarkeit der Jahresabschlüsse sicherzustellen.'
                ]
            },
            2: {
                leicht: [
                    'Sachanlagen bewerten',
                    'Betriebsvorrichtungen',
                    'BGA abschreiben',
                    'Fuhrpark buchen',
                    'Immobilien bewerten',
                    'Anschaffungskosten',
                    'Herstellungskosten',
                    'Nutzungsdauer',
                    'Restbuchwert',
                    'Neubewertung'
                ],
                normal: [
                    'Sachanlagen werden zu Anschaffungs- oder Herstellungskosten bilanziert.',
                    'Die Anschaffungskosten umfassen Kaufpreis und Anschaffungsnebenkosten.',
                    'Herstellungskosten umfassen Material, Lohn und angemessene Gemeinkosten.',
                    'Die planmäßige Abschreibung verteilt die Kosten auf die Nutzungsdauer.',
                    'Der Restbuchwert ist der Wert nach Abzug der kumulierten Abschreibungen.',
                    'Betriebsvorrichtungen sind abnutzbare Anlagegüter der betrieblichen Nutzung.',
                    'BGA wird als Sammelposition für Betriebs- und Geschäftsausstattung gebucht.',
                    'Fuhrparkfahrzeuge werden als Sachanlagevermögen aktiviert.',
                    'Immobilien können nach dem Bewertungsgesetz besteuert werden.',
                    'Außerplanmäßige Abschreibungen bei dauerhafter Wertminderung sind Pflicht.'
                ],
                schwer: [
                    'Die Herstellungskosten nach Paragraf 255 Absatz 2 HGB umfassen zwingend die Materialeinzelkosten, die Fertigungseinzelkosten und angemessene Teile der Material- und Fertigungsgemeinkosten, während Verwaltungskosten nur eingeschlossen werden dürfen, soweit sie auf den Zeitraum der Herstellung entfallen.',
                    'Bei der Bestimmung der Nutzungsdauer von Sachanlagen sind die amtlichen AfA-Tabellen des Bundesministeriums der Finanzen heranzuziehen, wobei im Einzelfall eine kürzere oder längere Nutzungsdauer nachgewiesen werden kann.',
                    'Die anschaffungsnahen Herstellungskosten nach Paragraf 6 Absatz 1 Nummer 1a EStG führen zu einer Aktivierungspflicht, wenn die Instandsetzungsaufwendungen innerhalb von drei Jahren nach Anschaffung 15 Prozent der Anschaffungskosten übersteigen.',
                    'Der Imparitätsgrundsatz verlangt, dass drohende Verluste aus der Abnutzung von Anlagevermögen sofort zu berücksichtigen sind, während unrealisierte Gewinne erst bei Realisierung ausgewiesen werden dürfen.'
                ]
            },
            3: {
                leicht: [
                    'Vorräte bewerten',
                    'Rohstoffe erfassen',
                    'Hilfsstoffe buchen',
                    'Handelswaren bewerten',
                    'Unfertige Erzeugnisse',
                    'Fertige Erzeugnisse',
                    'Bestandsänderung',
                    'Nachlaufende Kosten',
                    'Einzelbewertung',
                    'Verbrauchsfolgeverfahren'
                ],
                normal: [
                    'Vorräte werden zum niedrigeren Wert aus Beschaffungskosten und Marktwert bewertet.',
                    'Rohstoffe und Hilfsstoffe gehören zum materiellen Umlaufvermögen.',
                    'Handelswaren sind zum Einkaufspreis bewertet und abzüglich Preisnachlässe.',
                    'Unfertige Erzeugnisse werden mit den bisher angefallenen Herstellungskosten bewertet.',
                    'Die Bestandsänderung ergibt sich aus Zugang minus Abgang im Lager.',
                    'Das Einzelbewertungsprinzip erfordert die Bewertung jedes Stücks einzeln.',
                    'Verbrauchsfolgeverfahren wie FIFO und LIFO sind zulässige Vereinfachungen.',
                    'Der strengste Wertansatz ist bei der Vorratsbewertung maßgeblich.',
                    'Wertschwungrücklagen sind bei Finanzinstrumenten des Umlaufvermögens möglich.',
                    'Der Nettoveräußerungswert ist die Obergrenze für die Bewertung.'
                ],
                schwer: [
                    'Bei der Bewertung von Vorräten nach Paragraf 253 Absatz 4 HGB ist der niedrigere Wert aus Anschaffungskosten oder Herstellungskosten und dem beizulegenden Wert maßgeblich, wobei bei dauerhafter Wertminderung zwingend der niedrigere Wert anzusetzen ist.',
                    'Das Verbrauchsfolgeverfahren FIFO wertet die zuerst beschafften Vorräte als zuerst verbraucht und führt bei steigenden Preisen zu einem höheren Bestandswert, während LIFO den gegenteiligen Effekt hat und steuerlich bevorzugt werden kann.',
                    'Die Bewertung von unfertigen Erzeugnissen erfordert die Ermittlung der Herstellungskosten nach Paragraf 255 Absatz 2 HGB, wobei die Gemeinkostenzuschläge betriebsindividuell zu ermitteln und plausibilisierbar sein müssen.',
                    'Die Teilwertabschreibung bei Vorräten nach Paragraf 6 Absatz 1 Nummer 2 EStG ist zwingend vorzunehmen, wenn der Teilwert am Bilanzstichtag dauerhaft unter den Anschaffungskosten liegt und eine Werterholung in absehbarer Zeit nicht zu erwarten ist.'
                ]
            },
            4: {
                leicht: [
                    'GuV Konto erstellen',
                    'Umsatzerlöse buchen',
                    'Herstellungskosten',
                    'Bruttoergebnis',
                    'Vertriebskosten',
                    'Verwaltungskosten',
                    'Betriebsergebnis',
                    'Zinsergebnis',
                    'Sonderposten',
                    'Jahresüberschuss'
                ],
                normal: [
                    'Die GuV zeigt die Ertragslage des Unternehmens im abgelaufenen Geschäftsjahr.',
                    'Umsatzerlöse umfassen alle im Rahmen der gewöhnlichen Tätigkeit erzielten Erlöse.',
                    'Die Herstellungskosten der zur Erzielung der Umsatzerlöse erbrachten Leistungen sind abzuziehen.',
                    'Das Bruttoergebnis ergibt sich aus Umsatzerlösen minus Herstellungskosten.',
                    'Vertriebskosten und Verwaltungskosten sind gesondert auszuweisen.',
                    'Das Betriebsergebnis zeigt die Leistungsfähigkeit des Kerngeschäfts.',
                    'Das Zinsergebnis umfasst Zinserträge minus Zinsaufwendungen.',
                    'Außerordentliche Erträge und Aufwendungen sind gesondert zu zeigen.',
                    'Steuern vom Einkommen und vom Ertrag mindern das Ergebnis.',
                    'Der Jahresüberschuss ist das Saldo aller Erträge minus Aufwendungen.'
                ],
                schwer: [
                    'Das Umsatzkostenverfahren nach Paragraf 275 Absatz 3 HGB gliedert die Aufwendungen nach Funktionen wie Herstellung, Vertrieb und Verwaltung und stellt sie den Umsatzerlösen gegenüber, wodurch das Betriebsergebnis als Zwischengröße ausgewiesen wird.',
                    'Beim Gesamtkostenverfahren nach Paragraf 275 Absatz 2 HGB werden die gesamten Aufwendungen der Periode nach Aufwandsarten gegliedert den gesamten Erträgen gegenübergestellt, wobei die Bestandsänderungen und andere aktivierte Eigenleistungen gesondert auszuweisen sind.',
                    'Die Zuordnung von Aufwendungen zu den funktionalen Bereichen beim Umsatzkostenverfahren erfordert eine verursachungsgerechte Verteilung der Gemeinkosten auf Herstellung, Vertrieb und Verwaltung, die in der Praxis durch entsprechende Kostenrechnungssysteme zu unterstützen ist.',
                    'Die Ergebnisgliederung nach Paragraf 275 HGB schreibt zwingend die getrennte Ausweisung des Ergebnisses aus gewöhnlicher Geschäftstätigkeit, der außerordentlichen Ergebnisse, der Steuern und des Jahresüberschusses vor.'
                ]
            },
            5: {
                leicht: [
                    'Rückstellungen bilden',
                    'Pensionsrückstellungen',
                    'Steuerrückstellungen',
                    'Rückstellungen für Urlaub',
                    'Gewährleistungsrückstellung',
                    'Aufwandsrückstellung',
                    'Passive Rückstellung',
                    'Rückstellungsauflösung',
                    'Diskontierungszins',
                    'Rückstellungsbericht'
                ],
                normal: [
                    'Rückstellungen werden für ungewisse Verbindlichkeiten und drohende Verluste gebildet.',
                    'Pensionsrückstellungen sind die größten Rückstellungen in vielen Unternehmen.',
                    'Steuer-Rückstellungen decken die voraussichtliche Steuerlast ab.',
                    'Urlaubsrückstellungen decken den Anspruch der Mitarbeiter auf unbezahlten Urlaub.',
                    'Gewährleistungsrückstellungen sichern künftige Garantiefälle ab.',
                    'Die Diskontierung von Rückstellungen mit einer Laufzeit über einem Jahr ist Pflicht.',
                    'Rückstellungen müssen in der Bilanz unter dem Posten Rückstellungen ausgewiesen werden.',
                    'Die Auflösung von Rückstellungen erfolgt bei Wegfall des Grundes.',
                    'Der Rückstellungsaufwand mindert das Ergebnis des laufenden Jahres.',
                    'Rückstellungen dürfen nur für hinreichend konkretisierte Verbindlichkeiten gebildet werden.'
                ],
                schwer: [
                    'Die Bildung von Rückstellungen nach Paragraf 249 HGB ist zwingend vorgeschrieben für ungewisse Verbindlichkeiten, für drohende Verluste aus schwebenden Geschäften und für unterlassene Aufwendungen zur Instandhaltung, die innerhalb von drei Monaten nachgeholt werden.',
                    'Die Bewertung von Rückstellungen nach Paragraf 253 Absatz 1 HGB hat in Höhe des nach vernünftiger kaufmännischer Beurteilung notwendigen Erfüllungsbetrags zu erfolgen, wobei Rückstellungen mit einer Restlaufzeit von mehr als einem Jahr mit dem durchschnittlichen Marktzinssatz abzuzinsen sind.',
                    'Pensionsrückstellungen nach Paragraf 6a EStG unterliegen strengen steuerlichen Vorgaben hinsichtlich der Berechnungsmethode und der biometrischen Rechnungsgrundlagen und dürfen nur für die am Bilanzstichtag bestehenden Anwartschaften gebildet werden.',
                    'Die Auflösung von Rückstellungen ist erfolgswirksam vorzunehmen, wenn der Grund für die Rückstellung entfallen ist, und muss im Anhang des Jahresabschlusses erläutert werden, insbesondere bei Pensionsrückstellungen und großen Einzelrückstellungen.'
                ]
            },
            6: {
                leicht: [
                    'Einnahmenüberschussrechnung',
                    'Betriebseinnahmen',
                    'Betriebsausgaben',
                    'Gewinnermittlung',
                    'Überschussrechnung',
                    'Zuflussprinzip',
                    'Abflussprinzip',
                    'Steuerlicher Gewinn',
                    'Betriebsvermögen',
                    'Gewinnfreibetrag'
                ],
                normal: [
                    'Die Einnahmenüberschussrechnung ist eine vereinfachte Gewinnermittlungsart.',
                    'Sie erfasst den Überschuss der Betriebseinnahmen über die Betriebsausgaben.',
                    'Das Zufluss- und Abflussprinzip gilt bei der Einnahmenüberschussrechnung.',
                    'Freiberufler und Kleinunternehmer können die EÜR anwenden.',
                    'Die EÜR wird auf einem amtlich vorgeschriebenen Vordruck erstellt.',
                    'Betriebseinnahmen umfassen alle Einnahmen aus dem Betrieb.',
                    'Betriebsausgaben mindern den Gewinn, wenn sie betrieblich veranlasst sind.',
                    'Der steuerliche Gewinn ist die Grundlage der Einkommensteuer.',
                    'Der Grundfreibetrag für Gewinneinkünfte beträgt nach Paragraf 11 EStG.',
                    'Die EÜR ist einfacher als die doppelte Buchführung zu erstellen.'
                ],
                schwer: [
                    'Die Einnahmenüberschussrechnung nach Paragraf 4 Absatz 3 EStG ist nur für Steuerpflichtige zulässig, die nicht aufgrund gesetzlicher Vorschriften zur doppelten Buchführung verpflichtet sind und deren Umsatz im vorangegangenen Kalenderjahr 600000 Euro nicht überstiegen hat.',
                    'Das Zufluss- und Abflussprinzip bei der EÜR führt dazu, dass Einnahmen erst bei tatsächlichem Zufluss und Ausgaben erst bei tatsächlichem Abfluss steuerlich zu berücksichtigen sind, was bei largeren Rechnungsbeträgen zu erheblichen zeitlichen Verschiebungen führen kann.',
                    'Bei Wechseln von der EÜR zur doppelten Buchführung ist eine Eröffnungsbilanz zu erstellen, in der alle Wirtschaftsgüter des Betriebs mit dem niedrigeren Wert aus Teilwert und Anschaffungskosten anzusetzen sind.',
                    'Die steuerliche Gewinnermittlung nach Paragraf 4 Absatz 3 EStG lässt keine Bildung von Rückstellungen zu und untersagt die Aktivierung selbst geschaffener immaterieller Wirtschaftsgüter des Anlagevermögens.'
                ]
            },
            7: {
                leicht: [
                    'Eigenkapital ausweisen',
                    'Gezeichnetes Kapital',
                    'Kapitalrücklage',
                    'Gewinnrücklage',
                    'Jahresüberschuss',
                    'Gewinnvortrag',
                    'Verlustvortrag',
                    'Ausschüttung',
                    'Thesaurierung',
                    'Kapitalerhöhung'
                ],
                normal: [
                    'Das gezeichnete Kapital ist das Grundkapital einer Kapitalgesellschaft.',
                    'Die Kapitalrücklage entsteht durch Agio bei Kapitalerhöhung.',
                    'Die gesetzliche Rücklage ist bei Kapitalgesellschaften zwingend zu bilden.',
                    'Der Jahresüberschuss kann ausgeschüttet oder thesauriert werden.',
                    'Ein Gewinnvortrag erhöht das ausschüttbare Eigenkapital.',
                    'Verlustvorträge mindern das Eigenkapital und verringern künftige Gewinne.',
                    'Die Ausschüttung von Gewinnen bedarf bei der GmbH der Gesellschafterbeschlusses.',
                    'Thesaurierung bedeutet, dass Gewinne im Unternehmen verbleiben.',
                    'Kapitalerhöhungen erhöhen das Eigenkapital und die Haftungsgrundlage.',
                    'Die Eigenkapitalquote sollte mindestens 20 Prozent betragen.'
                ],
                schwer: [
                    'Die Ausschüttungssperre nach Paragraf 30 GmbHG verbietet die Zahlung von Ausschüttungen an die Gesellschafter, soweit das zur Deckung des Stammkapitals erforderliche Vermögen durch die Ausschüttung unterschritten werden würde, was durch eine Liquiditäts- und Solvenzprüfung nachzuweisen ist.',
                    'Bei der Kapitalerhöhung aus Gesellschaftsmitteln nach Paragraf 207 ff. AktG werden offene Rücklagen in gezeichnetes Kapital umgewandelt, ohne dass den Aktionären zusätzliche Mittel abverlangt werden, was zu einer besseren Eigenkapitalausstattung in der Bilanz führt.',
                    'Die Bildung von gesetzlichen Rücklagen nach Paragraf 150 AktG verpflichtet Aktiengesellschaften, 5 Prozent des Jahresüberschusses in die gesetzliche Rücklage einzustellen, bis diese zusammen mit den Kapitalrücklagen 10 Prozent des Grundkapitals erreicht hat.',
                    'Der verdeckte Gewinnausschüttung bei Kapitalgesellschaften liegt vor, wenn ein Gesellschafter durch Maßnahmen, die nicht auf offenem Gewinnverteilungsbeschluss beruhen, Vermögensvorteile erhält, die ein ordentlicher Kaufmann einem fremden Dritten nicht gewähren würde.'
                ]
            },
            8: {
                leicht: [
                    'Anhang erstellen',
                    'Lagebericht verfassen',
                    'Bilanzpolitik betreiben',
                    'Anhangangaben',
                    'Bewertungsmethoden',
                    'Sonderposten ausweisen',
                    'Eventualverbindlichkeiten',
                    'Haftungsverhältnisse',
                    'Vorsichtsprinzip beachten',
                    'Stetigkeit einhalten'
                ],
                normal: [
                    'Der Anhang ergänzt und erläutert die Angaben in Bilanz und GuV.',
                    'Kapitalgesellschaften müssen zwingend einen Anhang erstellen.',
                    'Der Lagebericht beschreibt die wirtschaftliche Lage des Unternehmens.',
                    'Bewertungsmethoden müssen im Anhang offengelegt werden.',
                    'Das Vorsichtsprinzip verlangt eine vorsichtige Bewertung aller Posten.',
                    'Die Stetigkeit der Bewertungsmethoden ist über die Jahre einzuhalten.',
                    'Eventualverbindlichkeiten sind im Anhang zu erläutern.',
                    'Haftungsverhältnisse aus Bürgschaften sind unter der Bilanz auszuweisen.',
                    'Sonderposten mit Rücklagenanteil sind nur bei bestimmten Gesellschaften zulässig.',
                    'Die Bilanzpolitik beeinflusst die Darstellung der Unternehmenslage.'
                ],
                schwer: [
                    'Der Anhang nach Paragraf 284 ff. HGB enthält die Erläuterungen zur Bilanz und GuV, die Angaben zu den angewandten Bilanzierungs- und Bewertungsmethoden und die zusätzlichen Informationen, die für ein den tatsächlichen Verhältnissen entsprechendes Bild erforderlich sind.',
                    'Der Lagebericht nach Paragraf 289 HGB hat den Geschäftsverlauf und die Lage der Gesellschaft so darzustellen, dass ein den tatsächlichen Verhältnissen entsprechendes Bild vermittelt wird, einschließlich der Risiken und Chancen der künftigen Entwicklung.',
                    'Die Anhangangaben nach Paragraf 285 HGB umfassen unter anderem die Angaben zu den Grundlagen für die Währungsumrechnung, die Aufgliederung des Umsatzes nach Tätigkeitsbereichen und geografischen Märkten und die durchschnittliche Zahl der Beschäftigten des Geschäftsjahres.',
                    'Die Bilanzierungshilfen nach Paragraf 254 HGB erlauben die Bildung eines Sonderpostens mit Rücklagenanteil für die erstmalige Anwendung neuer Bewertungsmethoden, was zu einer erfolgneutralen Eigenkapitalveränderung führt.'
                ]
            },
            9: {
                leicht: [
                    'Konzernbilanz',
                    'Kapitalkonsolidierung',
                    'Schuldenkonsolidierung',
                    'Zwischenergebniseliminierung',
                    'Aufdeckung stiller Reserven',
                    'Konzern-GuV',
                    'Konzernanhang',
                    'Assoziierung',
                    'Equity-Methode',
                    'Konzernlagebericht'
                ],
                normal: [
                    'Die Konzernbilanz fasst die Einzelabschlüsse aller Tochtergesellschaften zusammen.',
                    'Die Kapitalkonsolidierung eliminiert die Beteiligungsbuchwerte gegen das Eigenkapital.',
                    'Die Schuldenkonsolidierung entfernt konzerninterne Forderungen und Verbindlichkeiten.',
                    'Zwischenergebnisse aus konzerninternen Lieferungen sind zu eliminieren.',
                    'Die Aufdeckung stiller Reserven erfolgt bei der Erst konsolidierung.',
                    'Die Konzern-GuV zeigt das Gesamtergebnis des Konzerns.',
                    'Der Konzernanhang erläutert die Konsolidierungsmethoden.',
                    'Assoziierte Unternehmen werden nach der Equity-Methode einbezogen.',
                    'Die Equity-Methode bewertet Beteiligungen zum anteiligen Eigenkapital.',
                    'Der Konzernlagebericht beschreibt die Gesamtlage des Konzerns.'
                ],
                schwer: [
                    'Die Kapitalkonsolidierung nach Paragraf 301 HGB erfordert die Eliminierung des Buchwerts der Beteiligung gegen die anteiligen Eigenkapitalposten des Tochterunternehmens, wobei ein verbleibender Unterschiedsbetrag als Geschäfts- oder Firmenwert in der Konzernbilanz zu aktivieren ist.',
                    'Die Zwischenergebniseliminierung nach Paragraf 304 HGB betrifft alle konzerninternen Lieferungen und Leistungen, die im Bestand der aufnehmenden Konzerngesellschaft enthalten sind, und erfordert die Eliminierung der darin enthaltenen unrealisierten Gewinne.',
                    'Die Equity-Methode nach Paragraf 312 HGB für assoziierte Unternehmen bewertet die Beteiligung mit dem anteiligen Eigenkapitalwert und berücksichtigt den anteiligen Gewinn oder Verlust des assoziierten Unternehmens im Konzernergebnis.',
                    'Die Währungsumrechnung bei ausländischen Tochtergesellschaften nach Paragraf 308 HGB erfordert die Umrechnung der ausländischen Abschlüsse mit den Stichtagskursen für die Bilanzposten und den Durchschnittskursen für die GuV-Posten, wobei Umrechnungsdifferenzen erfolgsneutral im Eigenkapital erfasst werden.'
                ]
            },
            10: {
                leicht: [
                    'Steuerbilanz erstellen',
                    'Überleitungsrechnung',
                    'Bilanzsteuerrecht',
                    'Steuerlicher Gewinn',
                    'Betriebsvermögensvergleich',
                    'Gewinnermittlungsteuer',
                    'Steuerliche Abschreibung',
                    'Sonderabschreibung',
                    'Investitionsabzugsbetrag',
                    'Steuerliche Rücklagen'
                ],
                normal: [
                    'Die Steuerbilanz ist die Grundlage für die steuerliche Gewinnermittlung.',
                    'Die Überleitungsrechnung gleicht Handels- und Steuerbilanz miteinander ab.',
                    'Steuerliche Abschreibungen können von der handelsrechtlichen AfA abweichen.',
                    'Sonderabschreibungen sind steuerliche Fördermaßnahmen für Investitionen.',
                    'Der Investitionsabzugsbetrag nach Paragraf 7g EStG begünstigt künftige Investitionen.',
                    'Die steuerliche Rücklage nach Paragraf 6b EStG ermöglicht die Übertragung von Veräußerungsgewinnen.',
                    'Der Betriebsvermögensvergleich ermittelt den Gewinn durch Gegenüberstellung des Betriebsvermögens.',
                    'Steuerfreie Einnahmen bleiben bei der Gewinnermittlung unberücksichtigt.',
                    'Nicht abziehbare Betriebsausgaben erhöhen den steuerlichen Gewinn.',
                    'Die Steuerbilanz muss den Vorschriften der Abgabenordnung entsprechen.'
                ],
                schwer: [
                    'Die Überleitungsrechnung vom Handels- zum Steuerergebnis ist bei Kapitalgesellschaften zwingend erforderlich und stellt alle Positionen dar, die handelsrechtlich und steuerlich unterschiedlich behandelt werden, einschließlich der nicht abziehbaren Betriebsausgaben und der steuerfreien Einnahmen.',
                    'Der Investitionsabzugsbetrag nach Paragraf 7g EStG ermöglicht die steuerliche Berücksichtigung von geplanten Investitionen im Voraus durch die Bildung einer gewinnmindernden Rücklage, die bei tatsächlicher Investition innerhalb von drei Jahren aufgelöst werden muss.',
                    'Die Rücklagenbildung nach Paragraf 6b EStG ermöglicht die steuerneutrale Übertragung von Veräußerungsgewinnen aus der Aufgabe bestimmter Wirtschaftsgüter auf neue Wirtschaftsgüter innerhalb bestimmter Fristen, was zu einer zeitlichen Verlagerung der Besteuerung führt.',
                    'Der gewillkürte Betriebsvermögen nach Paragraf 8 Absatz 2 Satz 2 EStG umfasst Wirtschaftsgüter, die objektiv sowohl betrieblich als auch privat nutzbar sind und die der Steuerpflichtige aus betrieblichem Grund in seinem Betriebsvermögen belässt, was eine eindeutige betriebliche Zuordnung erfordert.'
                ]
            }
        },

        klr: {
            1: {
                leicht: [
                    'Kosten und Erlöse',
                    'Einzelkosten',
                    'Gemeinkosten',
                    'Fixe Kosten',
                    'Variable Kosten',
                    'Kostenart',
                    'Kostenstelle',
                    'Kostenträger',
                    'Kalkulation',
                    'Deckungsbeitrag'
                ],
                normal: [
                    'Die Kosten- und Leistungsrechnung ist Teil des internen Rechnungswesens.',
                    'Einzelkosten können einem Kostenträger direkt zugerechnet werden.',
                    'Gemeinkosten müssen über Schlüssel auf die Kostenstellen verteilt werden.',
                    'Fixe Kosten fallen unabhängig von der Beschäftigung an.',
                    'Variable Kosten verändern sich mit der Produktionsmenge.',
                    'Die Kostenartenrechnung erfasst alle angefallenen Kosten nach ihrer Art.',
                    'Die Kostenstellenrechnung ordnet die Kosten den verursachenden Bereichen zu.',
                    'Die Kostenträgerrechnung ermittelt die Kosten pro Produkt oder Leistung.',
                    'Der Deckungsbeitrag ist die Differenz aus Erlös und variablen Kosten.',
                    'Die Kalkulation bestimmt den Selbstkostenpreis einer Leistung.'
                ],
                schwer: [
                    'Die Abgrenzungsrechnung überführt die Aufwendungen und Erträge der Finanzbuchhaltung in die Kosten und Erlöse der Betriebsbuchhaltung, wobei neutraler Aufwand eliminiert und kalkulatorische Kosten ergänzt werden, um den entscheidungsrelevanten Kostenbegriff zu erhalten.',
                    'Die Differenzierung zwischen fixen und variablen Kosten ist die Grundlage der Grenzplankostenrechnung und ermöglicht eine verursachungsgerechte Zuordnung der Kosten zu den Kostenträgern unter Berücksichtigung der Beschäftigungsschwankungen.',
                    'Der Deckungsbeitrag als Differenz zwischen Umsatzerlös und variablen Kosten dient der Beurteilung der Produktrentabilität und ist die zentrale Steuerungsgröße im Direct Costing und in der Deckungsbeitragsrechnung.',
                    'Die Prozesskostenrechnung erfasst die Kosten von wiederkehrenden Tätigkeiten und ordnet sie den verursachenden Prozessen zu, wodurch eine verursachungsgerechte Verteilung der Gemeinkosten auf die Kostenträger erreicht wird.'
                ]
            },
            2: {
                leicht: [
                    'Materialkosten',
                    'Personalkosten',
                    'Abschreibungen',
                    'Kalkulatorische Kosten',
                    'Kalkulatorischer Unternehmerlohn',
                    'Kalkulatorische Miete',
                    'Kalkulatorische Zinsen',
                    'Wagniskosten',
                    'Sonstige Kosten',
                    'Kostenauflösung'
                ],
                normal: [
                    'Materialkosten umfassen den Verbrauch von Roh- und Hilfsstoffen.',
                    'Personalkosten bestehen aus Löhnen, Gehältern und Sozialaufwand.',
                    'Kalkulatorische Kosten ersetzen Aufwendungen, die in der KLR anders bewertet werden.',
                    'Der kalkulatorische Unternehmerlohn ersetzt den Gewinnanteil des Inhabers.',
                    'Kalkulatorische Miete ersetzt die Miete für betrieblich genutztes Privateigentum.',
                    'Kalkulatorische Zinsen erfassen die Kosten des eingesetzten Eigenkapitals.',
                    'Wagniskosten decken die allgemeinen unternehmerischen Risiken ab.',
                    'Die Kostenauflösung teilt gemischte Kosten in fixe und variable Bestandteile.',
                    'Zusatzkosten sind kalkulatorische Kosten ohne entsprechenden Aufwand.',
                    'Anderskosten sind kalkulatorische Kosten mit abweichendem Aufwand.'
                ],
                schwer: [
                    'Die Abgrenzung zwischen Aufwand und Kosten erfolgt durch die Betriebsabrechnung, die neutralen Aufwand, der nicht betriebsbezogen ist, eliminiert und kalkulatorische Kosten, die keinen Aufwand in der Finanzbuchhaltung darstellen, ergänzt, um den entscheidungsrelevanten Kostenbegriff zu erhalten.',
                    'Der kalkulatorische Unternehmerlohn nach Paragraf 4 Absatz 7 EStG kann bei Gewinneinkünften in Höhe eines angemessenen Geschäftsführergehalts berücksichtigt werden und dient der Vergleichbarkeit mit Kapitalgesellschaften, die einen Geschäftsführerlohn als Aufwand verbuchen.',
                    'Die kalkulatorischen Zinsen auf das eingesetzte Eigenkapital werden mit einem branchenüblichen Zinssatz berechnet und ermöglichen einen Vergleich der Rentabilität verschiedener Investitionsalternativen unter Berücksichtigung der Opportunitätskosten des Eigenkapitals.',
                    'Die Kostenauflösung nach der Methode der kleinsten Quadrate oder der Hoch-Tief-Punkt-Methode zerlegt gemischte Kosten in ihre fixen und variablen Bestandteile und ist Voraussetzung für die Anwendung der Deckungsbeitragsrechnung und der Plankostenrechnung.'
                ]
            },
            3: {
                leicht: [
                    'Kostenstelle definieren',
                    'Kostenstellenplan',
                    'Betriebsabrechnungsbogen',
                    'Umlageschlüssel',
                    'Vorlaufige Kostenstelle',
                    'Hauptkostenstelle',
                    'Hilfskostenstelle',
                    'Kostenverteilung',
                    'Kostenumlage',
                    'Innerbetriebliche Verrechnung'
                ],
                normal: [
                    'Die Kostenstellenrechnung ordnet die Gemeinkosten den Verantwortungsbereichen zu.',
                    'Der Betriebsabrechnungsbogen ist das zentrale Instrument der Kostenstellenrechnung.',
                    'Hilfskostenstellen versorgen andere Kostenstellen mit innerbetrieblichen Leistungen.',
                    'Die Kostenumlage verteilt die Kosten der Hilfskostenstellen auf die Hauptkostenstellen.',
                    'Der Umlageschlüssel bestimmt die Verteilung der Gemeinkosten auf die Kostenstellen.',
                    'Typische Umlageschlüssel sind Fläche, Arbeitsstunden und Maschinenstunden.',
                    'Die innerbetriebliche Verrechnung erfasst Leistungen zwischen Kostenstellen.',
                    'Vorläufige Kostenstellen sammeln Kosten, die später weiterverrechnet werden.',
                    'Die Kostenverteilung ist Grundlage der Gemeinkostenzuschlagskalkulation.',
                    'Der BAB zeigt die Kostenentstehung in den einzelnen Betriebsbereichen.'
                ],
                schwer: [
                    'Der Betriebsabrechnungsbogen nach dem Stufenleiterverfahren verteilt die Gemeinkosten schrittweise von den Vor- über die Hilfs- zu den Hauptkostenstellen, wobei die Verrechnungssätze für jede Stufe separat zu berechnen und auf die nachfolgenden Kostenstellen anzuwenden sind.',
                    'Die innerbetriebliche Leistungsverrechnung mit dem Gleichungsverfahren berücksichtigt die wechselseitigen Leistungsbeziehungen zwischen den Hilfskostenstellen und löst ein lineares Gleichungssystem, um die genauen Verrechnungspreise für die innerbetrieblichen Leistungen zu ermitteln.',
                    'Die Wahl des Umlageschlüssels hat entscheidenden Einfluss auf die verursachungsgerechte Verteilung der Gemeinkosten und muss so gewählt werden, dass ein möglichst starker Zusammenhang zwischen der Kostenverurschung und dem Verteilungskriterium besteht.',
                    'Die Anomalien bei der Kostenumlage entstehen, wenn die Summe der weiterverrechneten Kosten höher ist als die ursprünglichen Gemeinkosten, was bei der Behandlung von Eigelleistungen und bei mehrstufigen Umlageverfahren auftreten kann.'
                ]
            },
            4: {
                leicht: [
                    'Zuschlagskalkulation',
                    'Maschinenstundensatz',
                    'Lohnzuschlag',
                    'Materialzuschlag',
                    'Selbstkostenpreis',
                    'Gewinnzuschlag',
                    'Nettoverkaufspreis',
                    'Bruttoverkaufspreis',
                    'Barverkaufspreis',
                    'Zielverkaufspreis'
                ],
                normal: [
                    'Die Zuschlagskalkulation addiert Gemeinkostenzuschläge zu den Einzelkosten.',
                    'Der Materialzuschlag deckt die Materialgemeinkosten ab.',
                    'Der Lohnzuschlag verteilt die Fertigungsgemeinkosten auf die Arbeitsstunden.',
                    'Der Maschinenstundensatz erfasst alle Kosten einer Maschine pro Stunde.',
                    'Die Selbstkosten sind die Summe aller Kosten für ein Produkt.',
                    'Der Gewinnzuschlag wird auf die Selbstkosten aufgeschlagen.',
                    'Der Nettoverkaufspreis ist der Selbstkostenpreis plus Gewinnzuschlag.',
                    'Der Zielverkaufspreis berücksichtigt zusätzlich Rabatte und Skonti.',
                    'Die Vorwärtskalkulation berechnet den Verkaufspreis von den Kosten her.',
                    'Die Rückwärtskalkulation ermittelt die Kosten vom Marktpreis her.'
                ],
                schwer: [
                    'Die differenzierende Zuschlagskalkulation verwendet verschiedene Zuschlagssätze für die einzelnen Kostenbereiche wie Material, Fertigung, Verwaltung und Vertrieb und ermöglicht dadurch eine verursachungsgerechte Zuordnung der Gemeinkosten zu den einzelnen Produkten.',
                    'Der Maschinenstundensatz nach dem Verfahren der Maschinenkostenrechnung erfasst alle einer Maschine zurechenbaren Kosten einschließlich der kalkulatorischen Abschreibung, der Raumkosten, der Energiekosten und der Instandhaltungskosten und dividiert diese durch die jährliche Laufzeit der Maschine.',
                    'Die Rückwärtskalkulation ermittelt bei gegebenem Marktpreis die zulässigen Selbstkosten, indem Rabatte, Skonti, Umsatzsteuer und der Gewinnzuschlag vom Marktpreis abgezogen werden, was insbesondere bei der Preisgestaltung für den Handel von Bedeutung ist.',
                    'Bei der Kalkulation mit vorbestimmten Zuschlagssätzen werden die Gemeinkostenzuschläge auf Basis von Plankosten ermittelt und während des Geschäftsjahres konstant gehalten, was zu Abweichungen zwischen kalkulierten und tatsächlichen Kosten führt, die am Jahresende auszugleichen sind.'
                ]
            },
            5: {
                leicht: [
                    'Break-Even-Point',
                    'Gewinnschwelle',
                    'Sicherheitskoeffizient',
                    'Deckungsbeitragsrechnung',
                    'Stückdeckungsbeitrag',
                    'DB in Prozent',
                    'Umsatzrentabilität',
                    'Gewinnzone',
                    'Verlustzone',
                    'Kostendeckung'
                ],
                normal: [
                    'Der Break-Even-Point ist der Punkt, an dem Erlöse und Kosten gleich hoch sind.',
                    'Die Gewinnschwelle markiert den Übergang von der Verlust- zur Gewinnzone.',
                    'Der Deckungsbeitrag zeigt, wie viel ein Produkt zur Fixkostendeckung beiträgt.',
                    'Der Stückdeckungsbeitrag ist der Erlös minus variable Stückkosten.',
                    'Die Deckungsbeitragsrechnung bewertet Produkte nach ihrem DB.',
                    'Der Sicherheitskoeffizient gibt an, wie weit der Umsatz über dem BEP liegt.',
                    'Die Umsatzrentabilität misst den Gewinn im Verhältnis zum Umsatz.',
                    'Produkte mit negativem DB verringern den Gewinn und sollten geprüft werden.',
                    'Die Kostendeckung ist erreicht, wenn alle Kosten durch Erlöse gedeckt sind.',
                    'Der BEP in Stück ergibt sich aus Fixkosten geteilt durch Stück-DB.'
                ],
                schwer: [
                    'Die mehrstufige Deckungsbeitragsrechnung ordnet die fixen Kosten nach ihrer Abbaufähigkeit in verschiedene Fixkostenblöcke und ermöglicht die Beurteilung, welche Produktgruppen welche Fixkostenblöcke decken, was für die Sortimentsentscheidung entscheidungsrelevant ist.',
                    'Die Break-Even-Analyse bei Mehrproduktunternehmen erfordert die Berechnung eines gewichteten durchschnittlichen Deckungsbeitrags, der sich aus den Stück-Deckungsbeiträgen der einzelnen Produkte und deren Anteil am geplanten Absatz ergibt.',
                    'Der operative Hebel beschreibt den Zusammenhang zwischen Beschäftigungsänderung und Gewinnänderung und berechnet sich als Quotient aus Deckungsbeitrag und Gewinn, wobei ein höherer Anteil fixer Kosten zu einem stärkeren operativen Hebel führt.',
                    'Die Nutzenschwelle im Rahmen der linearen Programmierung gibt den minimalen Absatz eines Produkts an, der erreicht werden muss, damit die Produktion überhaupt aufgenommen werden sollte, und berücksichtigt dabei die Engpässe in der Produktion.'
                ]
            },
            6: {
                leicht: [
                    'Plankostenrechnung',
                    'Standardkosten',
                    'Sollkosten',
                    'Istkosten',
                    'Abweichungsanalyse',
                    'Preisabweichung',
                    'Mengenabweichung',
                    'Beschäftigungsabweichung',
                    'Verbrauchsabweichung',
                    'Budgetkontrolle'
                ],
                normal: [
                    'Die Plankostenrechnung arbeitet mit vorgegebenen Standardkosten.',
                    'Sollkosten sind die auf die Ist-Beschäftigung umgerechneten Plankosten.',
                    'Istkosten sind die tatsächlich angefallenen Kosten der Periode.',
                    'Die Abweichungsanalyse vergleicht Soll- und Istkosten systematisch.',
                    'Die Preisabweichung ergibt sich aus unterschiedlichen Einstandspreisen.',
                    'Die Mengenabweichung resultiert aus einem vom Plan abweichenden Verbrauch.',
                    'Die Beschäftigungsabweichung entsteht durch Abweichung der Beschäftigung vom Plan.',
                    'Die Verbrauchsabweichung zeigt Über- oder Unterdeckung bei gleicher Beschäftigung.',
                    'Die Budgetkontrolle überwacht die Einhaltung der geplanten Kosten.',
                    'Plankosten dienen der Kostenkontrolle und Kostensteuerung im Unternehmen.'
                ],
                schwer: [
                    'Die flexibile Plankostenrechnung auf Teilkostenbasis trennt die Abweichungen in eine beschäftigungsbedingte Abweichung und eine Verbrauchsabweichung, wobei die beschäftigungsbedingte Abweichung die nicht genutzte Fixkostenkapazität ausweist und die Verbrauchsabweichung die Effizienz der Leistungserstellung beurteilt.',
                    'Die Analyse der Preis- und Mengenabweichung bei den Materialkosten ermöglicht die Zuordnung der Verantwortung für Abweichungen an die Einkaufs- bzw. Produktionsabteilung und dient als Grundlage für die operative Steuerung der Kosten in den einzelnen Verantwortungsbereichen.',
                    'Die Plankostenrechnung auf Vollkostenbasis weist zusätzlich zur Beschäftigungs- und Verbrauchsabweichung eine Preisabweichung aus, die aus der Differenz zwischen Plan- und Ist-Einstandspreisen resultiert und die Bewertung der Einkaufsleistung ermöglicht.',
                    'Die Normkostenrechnung als Weiterentwicklung der Plankostenrechnung verwendet für jede Kostenart getrennte Normen für Preis und Verbrauch und ermöglicht dadurch eine detaillierte Analyse der Ursachen von Kostenabweichungen in den einzelnen Produktionsbereichen.'
                ]
            },
            7: {
                leicht: [
                    'Prozesskostenrechnung',
                    'Prozess definieren',
                    'Tätigkeit erfassen',
                    'Kostentreiber bestimmen',
                    'Prozessmenge',
                    'Prozesskostensatz',
                    'Leistungsmenge',
                    'Prozesshierarchie',
                    'Hauptprozess',
                    'Teilprozess'
                ],
                normal: [
                    'Die Prozesskostenrechnung erfasst die Kosten wiederkehrender Tätigkeiten.',
                    'Ein Prozess ist eine wiederkehrende Tätigkeit mit messbarem Output.',
                    'Der Kostentreiber ist der Faktor, der den Ressourcenverbrauch verursacht.',
                    'Der Prozesskostensatz ergibt sich aus Prozesskosten geteilt durch Prozessmenge.',
                    'Hauptprozesse bündeln mehrere Teilprozesse zu einem übergeordneten Prozess.',
                    'Die Prozesshierarchie gliedert die Prozesse nach ihrer Detailtiefe.',
                    'Die Prozesskostenrechnung verbessert die Gemeinkostenverteilung.',
                    'Leistungsmengeninduzierte Prozesse variieren mit dem Output.',
                    'Leistungsmengenneutrale Prozesse sind weitgehend fix.',
                    'Die Prozesskostenrechnung ist besonders in Dienstleistungsunternehmen relevant.'
                ],
                schwer: [
                    'Die Prozesskostenrechnung nach Horvath und Mayer gliedert die Gemeinkosten in leistungsmengeninduzierte Kosten, die durch den Output verursacht werden, und leistungsmengenneutrale Kosten, die als Fixkosten den Prozesskosten zuzurechnen sind, und berechnet für jeden Teilprozess einen eigenen Prozesskostensatz.',
                    'Die Bestimmung der Kostentreiber erfordert eine sorgfältige Analyse der Prozesse, da nur solche Einflussgrößen als Kostentreiber geeignet sind, die einen starken monotonen Zusammenhang mit dem Ressourcenverbrauch des Prozesses aufweisen.',
                    'Die Prozesskostenrechnung ermöglicht eine verursachungsgerechte Verteilung der Gemeinkosten auf die Kostenträger auch bei komplexen indirekten Leistungsbereichen wie Verwaltung und Vertrieb, wo traditionelle Zuschlagssätze zu verzerrten Ergebnissen führen.',
                    'Die Integration der Prozesskostenrechnung in das bestehende Kostenrechnungssystem erfordert die parallele Führung der traditionellen Kostenstellenrechnung und der Prozesskostenrechnung, was einen erhöhten Erfassungsaufwand und eine sorgfältige Datenpflege voraussetzt.'
                ]
            },
            8: {
                leicht: [
                    'Investitionsrechnung',
                    'Statische Verfahren',
                    'Dynamische Verfahren',
                    'Kapitalwertmethode',
                    'Interner Zinsfuß',
                    'Annuitätenmethode',
                    'Amortisationsrechnung',
                    'Kostenvergleich',
                    'Gewinnvergleich',
                    'Rentabilitätsrechnung'
                ],
                normal: [
                    'Die Investitionsrechnung bewertet die Wirtschaftlichkeit von Investitionen.',
                    'Statische Verfahren betrachten einen repräsentativen Zeitraum.',
                    'Dynamische Verfahren berücksichtigen den Zeitwert des Geldes.',
                    'Die Kapitalwertmethode diskontiert alle Ein- und Auszahlungen auf den Zeitpunkt null.',
                    'Der interne Zinsfuß ist der Zinssatz, bei dem der Kapitalwert null ist.',
                    'Die Annuitätenmethode verteilt den Kapitalwert auf gleichbleibende Jahresbeträge.',
                    'Die Amortisationsrechnung ermittelt die Rückgewinnungszeit des Kapitals.',
                    'Der Kostenvergleich stellt die Kosten verschiedener Alternativen gegenüber.',
                    'Die Rentabilitätsrechnung berechnet den Gewinn im Verhältnis zum Kapitaleinsatz.',
                    'Eine Investition ist wirtschaftlich, wenn der Kapitalwert positiv ist.'
                ],
                schwer: [
                    'Die Kapitalwertmethode nach dem Kalkulationszinsfußverfahren ermittelt den Barwert aller zukünftigen Ein- und Auszahlungen einer Investition und zeigt einen positiven Kapitalwert als Mehrwert der Investition gegenüber der Alternativanlage am Kapitalmarkt zum Kalkulationszinsfuß.',
                    'Der interne Zinsfuß als Diskontierungszinssatz, bei dem der Kapitalwert einer Investition exakt null wird, ermöglicht den Vergleich verschiedener Investitionsalternativen unabhängig vom Kalkulationszinsfuß, ist jedoch bei nicht-monotonen Zahlungsreihen nicht eindeutig bestimmbar.',
                    'Die Annuitätenmethode transformiert den Kapitalwert einer Investition in eine gleichbleibende jährliche Zahlung und ermöglicht so den Vergleich von Investitionen mit unterschiedlichen Laufzeiten, da die Annuität die durchschnittliche jährliche Vermögensmehrung der Investition darstellt.',
                    'Die dynamische Amortisationsrechnung berücksichtigt im Gegensatz zur statischen Methode den Zeitwert des Geldes, indem sie die kumulierten abgezinsten Rückflüsse ermittelt und den Zeitpunkt bestimmt, zu dem das eingesetzte Kapital einschließlich der Zinsen zurückgewonnen ist.'
                ]
            },
            9: {
                leicht: [
                    'Kostenträgerstückrechnung',
                    'Kostenträgerzeitrechnung',
                    'Kalkulationsverfahren',
                    'Divisionskalkulation',
                    'Äquivalenzziffernkalkulation',
                    'Zuschlagskalkulation',
                    'Kalkulation bei Lohnarbeit',
                    'Kalkulation bei Eigenleistung',
                    'Angebotskalkulation',
                    'Nachkalkulation'
                ],
                normal: [
                    'Die Kostenträgerstückrechnung ermittelt die Kosten pro Einheit eines Produkts.',
                    'Die Kostenträgerzeitrechnung erfasst die Gesamtkosten einer Periode.',
                    'Die Divisionskalkulation teilt die Gesamtkosten durch die Produktionsmenge.',
                    'Die Äquivalenziffernkalkulation gewichtet verschiedene Produktarten.',
                    'Die Vorkalkulation plant die Kosten vor der Produktion.',
                    'Die Nachkalkulation ermittelt die tatsächlichen Kosten nach der Produktion.',
                    'Angebotskalkulationen berechnen den Preis für einen Kundenauftrag.',
                    'Bei Sortenproduktion ist die Divisionskalkulation anzuwenden.',
                    'Die mehrstufige Divisionskalkulation berücksichtigt mehrere Produktionsstufen.',
                    'Die Kalkulation ist Grundlage für die Preisbildung und Ergebnissteuerung.'
                ],
                schwer: [
                    'Die mehrstufige Divisionskalkulation erfasst die Kosten für jede Produktionsstufe separat und ermöglicht die Bestimmung der Herstellkosten, der Selbstkosten und des Verkaufspreises für jedes Zwischen- und Endprodukt in einem mehrstufigen Produktionsprozess.',
                    'Die Äquivalenzziffernkalkulation gewichtet die verschiedenen Sorten eines Produkts nach ihrem Kostenverursachungsanteil mit Hilfe von Äquivalenzziffern und ermöglicht so die verursachungsgerechte Verteilung der Gemeinkosten auf die einzelnen Sorten.',
                    'Die differenzierende Zuschlagskalkulation verwendet für jeden Kostenbereich separate Zuschlagssätze und ermöglicht dadurch eine verursachungsgerechte Kostenträgerstückrechnung, die die unterschiedlichen Kostenstrukturen der einzelnen Produktbereiche berücksichtigt.',
                    'Die Kalkulation von Kuppelprodukten erfordert die Verteilung der gemeinsamen Produktionskosten auf die Haupt- und Nebenprodukte nach einem angemessenen Verteilungsschlüssel, wobei die Restwertmethode und die Marktwertmethode als Verteilungsverfahren in Betracht kommen.'
                ]
            },
            10: {
                leicht: [
                    'Balanced Scorecard',
                    'Finanzperspektive',
                    'Kundenperspektive',
                    'Prozessperspektive',
                    'Entwicklungsperspektive',
                    'Kennzahlen',
                    'Key Performance Indicators',
                    'Target Costing',
                    'Benchmarking',
                    'Controlling'
                ],
                normal: [
                    'Die Balanced Scorecard verknüpft finanzielle und nicht-finanzielle Kennzahlen.',
                    'Sie umfasst vier Perspektiven: Finanzen, Kunden, Prozesse und Entwicklung.',
                    'Kennzahlen messen den Erfolg in den verschiedenen Perspektiven.',
                    'KPIs sind die wichtigsten Leistungsindikatoren eines Unternehmens.',
                    'Target Costing richtet die Kosten am vom Markt akzeptierten Preis aus.',
                    'Benchmarking vergleicht die eigenen Leistungen mit den Besten der Branche.',
                    'Das Controlling steuert und überwacht die Unternehmensführung.',
                    'Die Balanced Scorecard verbindet Strategie mit operativem Handeln.',
                    'Vorschaurechnungen unterstützen die Unternehmensplanung.',
                    'Die Abweichungsanalyse ist ein zentrales Instrument des Controllings.'
                ],
                schwer: [
                    'Die Balanced Scorecard nach Kaplan und Norton übersetzt die Unternehmensstrategie in ein konsistentes System von Zielen und Kennzahlen, das die Finanzperspektive mit den vorgelagerten Perspektiven Kunden, interne Prozesse und Lernen und Entwicklung verknüpft und Ursache-Wirkungs-Ketten zwischen den Perspektiven herstellt.',
                    'Das Target Costing als marktorientiertes Kostenmanagement ermittelt den Zielkostenwert eines Produkts durch Subtraktion des geforderten Gewinns vom marktgerechten Verkaufspreis und leitet daraus die zulässigen Kosten für die Produktentwicklung und Fertigung ab.',
                    'Die Prozesskostenrechnung als Grundlage des Prozessmanagements identifiziert die kostenintensiven Prozesse im Unternehmen und ermöglicht deren Optimierung durch Standardisierung, Automatisierung oder Outsourcing, was zu einer nachhaltigen Senkung der Gemeinkosten führt.',
                    'Das strategische Controlling unterstützt die Unternehmensführung bei der langfristigen Planung und Steuerung durch die Analyse der Wettbewerbssituation, die Beurteilung strategischer Alternativen und die Überwachung der Strategieumsetzung mittels eines Frühwarnsystems.'
                ]
            }
        }
    };

    function getTexts(topic, level, difficulty) {
        if (!texts[topic] || !texts[topic][level] || !texts[topic][level][difficulty]) {
            return ['Bitte wähle einen gültigen Themenbereich, Level und Schwierigkeitsgrad.'];
        }
        return texts[topic][level][difficulty];
    }

    function getRandomText(topic, level, difficulty) {
        const pool = getTexts(topic, level, difficulty);
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function getAvailableLevels(topic) {
        if (!texts[topic]) return [];
        return Object.keys(texts[topic])
            .map(Number)
            .sort((a, b) => a - b);
    }

    function getAvailableDifficulties(topic, level) {
        if (!texts[topic] || !texts[topic][level]) return [];
        return Object.keys(texts[topic][level]);
    }

    function getAllTopics() {
        return Object.values(TOPICS);
    }

    function getTopicName(topicKey) {
        return TOPIC_NAMES[topicKey] || topicKey;
    }

    function getTopicIcon(topicKey) {
        return TOPIC_ICONS[topicKey] || '📝';
    }

    function getTotalTextCount() {
        let count = 0;
        for (const topic of Object.values(texts)) {
            for (const level of Object.values(topic)) {
                for (const diff of Object.values(level)) {
                    count += diff.length;
                }
            }
        }
        return count;
    }

    /**
     * Fuegt weitere Texte hinzu (fuer Erweiterungs-Module wie texts-extra/texts-sehrSchwer).
     * @param {string} topic - Themen-Key (z. B. 'buchfuehrung')
     * @param {number} level - Level-Nummer (1-10)
     * @param {string} difficulty - Schwierigkeit ('leicht'|'normal'|'schwer'|'sehrSchwer')
     * @param {string[]} newTexts - Array von Texten
     */
    function addTexts(topic, level, difficulty, newTexts) {
        if (!newTexts || newTexts.length === 0) return;
        if (!texts[topic]) return;
        if (!texts[topic][level]) return;
        if (!texts[topic][level][difficulty]) {
            texts[topic][level][difficulty] = [];
        }
        texts[topic][level][difficulty] = texts[topic][level][difficulty].concat(newTexts);
    }

    /** Prueft, ob ein Topic/Level/Difficulty-Kombination existiert. */
    function hasTexts(topic, level, difficulty) {
        return !!(texts[topic] && texts[topic][level] && texts[topic][level][difficulty]);
    }

    return {
        TOPICS,
        TOPIC_NAMES,
        TOPIC_ICONS,
        DIFFICULTY_NAMES,
        getTexts,
        getRandomText,
        getAvailableLevels,
        getAvailableDifficulties,
        getAllTopics,
        getTopicName,
        getTopicIcon,
        getTotalTextCount,
        addTexts,
        hasTexts
    };
})();
