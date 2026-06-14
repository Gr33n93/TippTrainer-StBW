'use strict';

const TextsExtra = (() => {
    const extras = {
        buchfuehrung: {
            1: {
                leicht: [
                    'Debit und Kredit',
                    'Soll und Haben',
                    'Bilanz und GuV',
                    'Einnahme Ausgabe',
                    'Bestand Zugang',
                    'Abschreibung Wert',
                    'Steuer Zoll',
                    'Rechnung Beleg',
                    'Konto Saldo',
                    'Journal Posten'
                ],
                normal: [
                    'Die Grundlage jeder ordnungsgemäßen Buchführung ist der Beleg.',
                    'Jede Buchung muss zeitnah und vollständig erfasst werden.',
                    'Das Inventar enthält alle Vermögensgegenstände und Schulden.',
                    'Der Kontenrahmen ordnet die Konten nach Nummernkreisen.',
                    'Die Buchführungspflicht ergibt sich aus dem Handelsgesetzbuch.',
                    'Umsatzsteuer wird auf steuerbare Lieferungen erhoben.',
                    'Das Kassenbuch dokumentiert alle Bareinzahlungen und Auszahlungen.',
                    'Jeder Geschäftsfall muss auf mindestens zwei Konten gebucht werden.',
                    'Der Jahresabschluss besteht aus Bilanz und Gewinn- und Verlustrechnung.',
                    'Rückstellungen decken ungewisse Verbindlichkeiten ab.'
                ],
                schwer: [
                    'Die GoB verlangen eine vollständige, fehlerfreie und zeitnahe Erfassung aller Geschäftsvorfälle unter Beachtung des Vorsichtsprinzips und des Imparitätsgebots.',
                    'Bei der Bewertung des Anlagevermögens sind die Anschaffungskosten um planmäßige und außerplanmäßige Abschreibungen zu vermindern, wobei der beizulegende Wert als Untergrenze gilt.',
                    'Die doppelte Buchführung sorgt dafür, dass jeder Geschäftsfall auf Soll- und Habenseite erfasst wird und die Bilanzsumme auf beiden Seiten identisch bleibt.',
                    'Der Jahresabschluss muss den Grundsätzen ordnungsmäßiger Buchführung entsprechen und ein den tatsächlichen Verhältnissen entsprechendes Bild vermitteln.'
                ]
            },
            2: {
                leicht: [
                    'Bank an Erlöse',
                    'Kasse an Darlehen',
                    'Wareneinkauf an Bank',
                    'Gehalt an Kasse',
                    'Miete an Bank',
                    'Abschreibung an Maschine',
                    'Eigenkapital an Bank',
                    'Umsatzsteuer an Finanzamt',
                    'Büromaterial an Kasse',
                    'Forderungen an Erlöse'
                ],
                normal: [
                    'Der zusammengesetzte Buchungssatz erfasst mehrere Konten gleichzeitig.',
                    'Bei Zielkauf wird Wareneingang an Verbindlichkeiten gebucht.',
                    'Die Abschreibung mindert den Buchwert des Anlagevermögens.',
                    'Umsatzsteuer entsteht bei steuerpflichtigen Lieferungen.',
                    'Vorsteuer aus Eingangsrechnungen darf abgezogen werden.',
                    'Eigenkapital wird bei Gründung in die Bilanz eingestellt.',
                    'Der Kassenbestand muss täglich mit dem Kassenbuch übereinstimmen.',
                    'Privateinlagen erhöhen das Eigenkapital des Unternehmens.',
                    'Stornobuchungen korrigieren fehlerhafte Einträge im laufenden Jahr.',
                    'Jahresabschlussbuchungen werden zum Bilanzstichtag vorgenommen.'
                ],
                schwer: [
                    'Die Bestandsveränderung von Rohstoffen wird im Jahresabschluss durch Bestandskonten erfasst, die den Verbrauch der Periode gegenüber dem Anfangsbestand ausweisen.',
                    'Bei der Buchung von Personalkosten sind die Lohnnebenkosten einschließlich Sozialversicherungsbeiträge separat auszuweisen und an die entsprechenden Krankenkassen abzuführen.',
                    'Die Bewertung von Forderungen erfordert eine Einzelwertberichtigung für zweifelhafte Forderungen und eine Pauschalwertberichtigung für das allgemeine Ausfallrisiko.',
                    'Bei teilbaren Geschäftsvorfällen muss der Gesamtbetrag auf mehrere Konten verteilt werden, wobei die Summe exakt mit dem Ursprungsbetrag übereinstimmen muss.'
                ]
            },
            3: {
                leicht: [
                    'Konto 0900 Erlöse',
                    'Konto 1000 Kasse',
                    'Konto 1300 Bank',
                    'Konto 4400 Gehälter',
                    'Konto 5100 Miete',
                    'Klasse 0 Abschlüsse',
                    'Klasse 1 Anlagevermögen',
                    'Klasse 2 Umlaufvermögen',
                    'Klasse 3 Eigenkapital',
                    'Klasse 4 Fremdkapital'
                ],
                normal: [
                    'Bestandskonten zeigen den Stand von Vermögen und Schulden.',
                    'Erfolgskonten erfassen Aufwendungen und Erträge des Jahres.',
                    'Der Saldo wird durch Gegenüberstellung von Soll und Haben ermittelt.',
                    'T-Konten visualisieren die Zuordnung der Buchungen.',
                    'Das Schlussbilanzkonto wird am Jahresende erstellt.',
                    'Gemischte Konten müssen am Jahresende aufgelöst werden.',
                    'Der Kontenplan wird individuell an das Unternehmen angepasst.',
                    'Ergänzungskonten korrigieren den Wert der Hauptkonten.',
                    'Die Kontenklassen folgen dem Industriekontenrahmen.',
                    'Schuldenkonten haben ihr Soll in der Passivseite der Bilanz.'
                ],
                schwer: [
                    'Der Industriekontenrahmen basiert auf dem Gemeinschafts Kontenrahmen der Industrie und ordnet die Konten in Zehnerklassen von null bis neun, wobei jede Klasse einen bestimmten Bilanzposten abbildet.',
                    'Bei der Erstellung des Kontenplans muss das Unternehmen eine sinnvolle Auswahl aus dem Kontenrahmen treffen und betriebsspezifische Konten ergänzen, ohne die Systematik zu verletzen.',
                    'Die richtige Zuordnung von Geschäftsvorfällen zu Konten setzt fundierte Kenntnisse der Bilanzierungsregeln und der Systematik des verwendeten Kontenrahmens voraus.',
                    'Transitorische Posten werden am Jahresende durch zeitliche Abgrenzung auf separate Konten gebucht, um den periodengerechten Erfolg sicherzustellen.'
                ]
            },
            4: {
                leicht: [
                    'Netto plus Steuer',
                    'Brutto minus Steuer',
                    'Skonto abziehen',
                    'Ziel 30 Tage',
                    'Rechnung prüfen',
                    'Steuerfrei Befreit',
                    'Vorsteuer abziehen',
                    'Kleinunternehmer',
                    'Umsatzsteuersatz',
                    'Steuernummer ID'
                ],
                normal: [
                    'Der Nettobetrag ist der Rechnungsbetrag ohne Umsatzsteuer.',
                    'Skonto gewährt einen Preisnachlass bei früher Zahlung.',
                    'Der Bruttobetrag ergibt sich aus Netto plus Umsatzsteuer.',
                    'Die Umsatzsteuervoranmeldung ist monatlich abzugeben.',
                    'Bei steuerbefreiten Umsätzen entfällt die Steuerpflicht.',
                    'Die Gutschrift ist die umgekehrte Rechnung durch den Empfänger.',
                    'Das Zahlungsziel gibt die Frist für die Begleichung an.',
                    'Die Kleinunternehmerregelung gilt bis zu einem Umsatz von 22.000 Euro.',
                    'Vorsteuer darf nur bei ordnungsgemäßen Rechnungen abgezogen werden.',
                    'Die Umsatzsteuer entsteht mit Ausführung der Leistung.'
                ],
                schwer: [
                    'Bei der Berechnung des Skontos ist zu beachten, dass der Skontoabzug den Nettobetrag und den darauf entfallenden Steueranteil gleichermaßen mindert, was zu einer Korrektur der Umsatzsteuer führt.',
                    'Die umsatzsteuerliche Beurteilung gemischter Leistungen erfordert eine Prüfung, ob die Leistung einheitlich oder nach unterschiedlichen Steuersätzen zu beurteilen ist.',
                    'Der Vorsteuerabzug setzt eine rechtmäßige Rechnung mit allen Pflichtangaben voraus und ist nur zulässig, wenn die Leistung für das Unternehmen bezogen wurde.',
                    'Die Dauerfristverlängerung für die Umsatzsteuervoranmeldung erfordert eine Sondervorauszahlung in Höhe von einem Elftel der Jahressteuer.'
                ]
            },
            5: {
                leicht: [
                    'Inventur erstellen',
                    'Bewertung prüfen',
                    'Rückstellung bilden',
                    'Abschreibung rechnen',
                    'Eigenkapital erhöhen',
                    'Fremdkapital tilgen',
                    'Jahresabschluss prüfen',
                    'Eröffnungsbilanz',
                    'Schlussbilanz',
                    'Stille Reserven'
                ],
                normal: [
                    'Das Inventar enthält alle Vermögensgegenstände und Schulden mit Mengen und Werten.',
                    'Die Inventur muss zu jedem Bilanzstichtag durchgeführt werden.',
                    'Abschreibungen verteilen die Kosten auf die Nutzungsdauer.',
                    'Rückstellungen decken ungewisse Verbindlichkeiten und Aufwendungen ab.',
                    'Die Eröffnungsbilanz schließt an den Vorjahresabschluss an.',
                    'Fremdkapital verursacht Zinsaufwand und muss getilgt werden.',
                    'Der Gewinn wird thesauriert oder an die Gesellschafter ausgeschüttet.',
                    'Die Schlussbilanz ist Grundlage der Eröffnungsbilanz des Folgejahres.',
                    'Stille Reserven entstehen durch vorsichtige Bewertung.',
                    'Eigenkapital haftet den Gläubigern als Sicherheit.'
                ],
                schwer: [
                    'Bei der Bewertung des Anlagevermögens sind die Anschaffungskosten um planmäßige Abschreibungen zu vermindern, wobei außerplanmäßige Abschreibungen bei dauerhafter Wertminderung zwingend vorzunehmen sind.',
                    'Niedrige Bewertungsvorbehalte nach dem Handelsrecht erlauben eine Bewertung unterhalb der Anschaffungskosten, wenn ein dauerhafter Wertverlust feststellbar ist und die Vorsicht dies gebietet.',
                    'Drohverlustrückstellungen sind zwingend zu bilden, wenn am Bilanzstichtag erkennbar wird, dass ein Vertrag voraussichtlich zu Verlusten führen wird und der beizulegende Wert unter dem Buchwert liegt.',
                    'Stille Reserven entstehen durch die vorsichtige Bewertung von Vermögensgegenständen und können bei Veräußerung zu außerplanmäßigen Erträgen im Jahresabschluss führen.'
                ]
            },
            6: {
                leicht: [
                    'Kassenbuch pflegen',
                    'Bankauszug prüfen',
                    'Beleg abheften',
                    'Rechnung archivieren',
                    'Zahlung zuordnen',
                    'Saldenliste drucken',
                    'Storno buchen',
                    'Korrektur vornehmen',
                    'Offene Posten klären',
                    'Abstimmung durchführen'
                ],
                normal: [
                    'Das Kassenbuch muss täglich aktualisiert und abgerechnet werden.',
                    'Die Bankabstimmung gleicht die Bankbuchungen mit den Auszügen ab.',
                    'Jeder Beleg erhält eine fortlaufende Nummer im Journal.',
                    'Eingangsrechnungen sind auf Richtigkeit und Vollständigkeit zu prüfen.',
                    'Die Kontenabstimmung stellt die Richtigkeit der Buchführung sicher.',
                    'Offene Posten werden in der Debitorenbuchhaltung verwaltet.',
                    'Stornobuchungen korrigieren fehlerhafte Einträge im aktuellen Jahr.',
                    'Die Saldenliste zeigt den Stand aller Konten zum Stichtag.',
                    'Die Belegablage muss chronologisch und systematisch erfolgen.',
                    'Der Buchungsbeleg ist Grundlage jeder Verbuchung.'
                ],
                schwer: [
                    'Bei der Bankabstimmung sind alle zeitlichen Differenzen zwischen Bankauszug und Buchführung zu ermitteln und durch Anpassungsbuchungen zu korrigieren, falls die Abweichungen nicht durch Valuta-Unterschiede erklärt werden.',
                    'Die Aufbewahrungspflicht für Buchführungsunterlagen beträgt zehn Jahre und beginnt mit dem Schluss des Kalenderjahres, in dem die Unterlagen erstellt wurden.',
                    'Eine elektronische Buchführung muss den GoBD entsprechen und eine Verfahrensdokumentation aufweisen, die jederzeit Einsicht in die elektronischen Aufzeichnungen ermöglicht.',
                    'Die GoBD definieren die Anforderungen an die Ordnungsmäßigkeit der elektronischen Buchführung und den Datenzugriff durch die Finanzverwaltung bei Betriebsprüfungen.'
                ]
            },
            7: {
                leicht: [
                    'Gewinn ermitteln',
                    'Aufwand buchen',
                    'Ertrag erfassen',
                    'GuV erstellen',
                    'Betriebsergebnis',
                    'Jahresüberschuss',
                    'Bilanzgewinn',
                    'Rücklagen bilden',
                    'Ausschüttung',
                    'Thesaurierung'
                ],
                normal: [
                    'Die GuV erfasst alle Erträge und Aufwendungen des Geschäftsjahres.',
                    'Der Jahresüberschuss ist das Ergebnis vor Ausschüttung.',
                    'Betriebs- und neutrales Ergebnis ergeben das Unternehmensergebnis.',
                    'Die GuV kann nach Gesamt- oder Umsatzkostenverfahren erstellt werden.',
                    'Zinserträge und Zinsaufwendungen sind getrennt auszuweisen.',
                    'Steuern vom Einkommen mindern den Jahresüberschuss.',
                    'Gesetzliche Rücklagen sind für Kapitalgesellschaften verpflichtend.',
                    'Der Bilanzgewinn steht nach Ausschüttung zur Verfügung.',
                    'Außerordentliche Posten sind gesondert zu kennzeichnen.',
                    'Das Betriebsergebnis zeigt die Leistungsfähigkeit des Kerngeschäfts.'
                ],
                schwer: [
                    'Das Gesamtkostenverfahren stellt den Gesamtumsatz den gesamten Herstellungskosten der Periode gegenüber, während das Umsatzkostenverfahren die Kosten nach Funktionen gliedert.',
                    'Bei der Ergebnisermittlung sind außerordentliche und periodenfremde Erträge und Aufwendungen separat auszuweisen, da sie für die Beurteilung der nachhaltigen Ertragskraft nicht relevant sind.',
                    'Die Veränderung des Eigenkapitals zwischen zwei Bilanzstichtagen ergibt sich aus dem Jahresergebnis, den Einlagen, den Entnahmen und den Kapitalrückzahlungen an die Gesellschafter.',
                    'Bei Personengesellschaften erfolgt die Gewinnverteilung gemäß Gesellschaftsvertrag und kann ungleich der Beteiligungsverhältnisse vereinbart sein.'
                ]
            },
            8: {
                leicht: [
                    'Vorräte bewerten',
                    'Forderungen prüfen',
                    'Schulden gliedern',
                    'Wertpapiere ausweisen',
                    'Leasing buchen',
                    'Pacht erfassen',
                    'Verbindlichkeiten',
                    'Langfristige Schulden',
                    'Kurzfristige Schulden',
                    'Eventualverbindlichkeiten'
                ],
                normal: [
                    'Vorräte sind zum niedrigeren Wert aus Kosten und Markt zu bewerten.',
                    'Zweifelhafte Forderungen sind durch Wertberichtigung abzusichern.',
                    'Langfristige Verbindlichkeiten haben eine Laufzeit über einem Jahr.',
                    'Leasingraten sind bei Operating-Leasing als Aufwand zu verbuchen.',
                    'Rückstellungen sind in Höhe des voraussichtlichen Werts zu bilden.',
                    'Kurzfristige Verbindlichkeiten sind innerhalb eines Jahres fällig.',
                    'Pachtzahlungen sind als Betriebsausgabe abziehbar.',
                    'Eventualverbindlichkeiten werden unter der Bilanz ausgewiesen.',
                    'Die Fristigkeit der Schulden ist im Anhang darzustellen.',
                    'Wertpapiere können zum beizulegenden Wert bewertet werden.'
                ],
                schwer: [
                    'Bei der Bewertung von Finanzinstrumenten im Umlaufvermögen ist zwischen fortgeführten Anschaffungskosten und dem Fair Value zu unterscheiden, wobei Wertminderungen erfolgswirksam zu erfassen sind.',
                    'Die Umklassifizierung von langfristigen in kurzfristige Verbindlichkeiten hat zu erfolgen, wenn die Restlaufzeit am Bilanzstichtag weniger als ein Jahr beträgt.',
                    'Bei der Bewertung von Pensionsrückstellungen ist das Anwartschaftsdeckungsverfahren anzuwenden und der Barwert der künftigen Pensionsverpflichtungen unter Berücksichtigung biometrischer Rechnungsgrundlagen zu ermitteln.',
                    'Ein erfolgsneutraler Eigenkapitalwechsel liegt vor, wenn Kapitalrücklagen in offene Rücklagen umgewandelt werden oder bei einer Kapitalerhöhung aus Gesellschaftsmitteln.'
                ]
            },
            9: {
                leicht: [
                    'Verschmelzung prüfen',
                    'Spaltung planen',
                    'Formwechsel anmelden',
                    'Umgründung prüfen',
                    'Sachgründung bewerten',
                    'Einbringung erfassen',
                    'Auseinandersetzung',
                    'Eröffnungsbilanz',
                    'Schlussbilanz',
                    'Umwandlung melden'
                ],
                normal: [
                    'Bei der Verschmelzung geht das übertragende Unternehmen auf den Übernehmer über.',
                    'Die Spaltung ermöglicht die Aufteilung auf mehrere Rechtsträger.',
                    'Der Formwechsel ändert die Rechtsform ohne Vermögensübertragung.',
                    'Sachgründungen erfordern eine besondere Prüfung durch einen Prüfer.',
                    'Die Einbringung kann nach Buchwert oder gemeinem Wert erfolgen.',
                    'Steuerliche Rückwirkungen bei Umgründungen sind sorgfältig zu prüfen.',
                    'Die Auseinandersetzungsbilanz wird bei Auflösung erstellt.',
                    'Gründungskosten dürfen als sofort abziehbare Betriebsausgabe gebucht werden.',
                    'Die Eröffnungsbilanz muss die Werte der Schlussbilanz übernehmen.',
                    'Umwandlungsmaßnahmen sind im Handelsregister einzutragen.'
                ],
                schwer: [
                    'Bei der Verschmelzung nach dem Umwandlungsgesetz ist der Verschmelzungsvertrag durch einen Verschmelzungsbericht zu ergänzen und von einem Prüfer auf die Angemessenheit des Umtauschverhältnisses zu überprüfen.',
                    'Die steuerneutrale Einbringung nach Paragraf 20 UmwStG setzt voraus, dass die eingebrachten Betriebsvermögenswerte in der steuerlichen Schlussbilanz mit den Buchwerten angesetzt werden.',
                    'Bei der Abspaltung eines Teilbetriebs müssen die gemeinsamen Kosten und Verbindlichkeiten verursachungsgerecht auf die Rechtsnachfolger aufgeteilt werden.',
                    'Der Formwechsel einer GmbH in eine AG erfordert die Zustimmung einer Dreiviertelmehrheit der Gesellschafter und die Eintragung im Handelsregister mit konstitutiver Wirkung.'
                ]
            },
            10: {
                leicht: [
                    'Jahresabschluss prüfen',
                    'Testat erteilen',
                    'Bestätigungsvermerk',
                    'Prüfungsbericht',
                    'Wirtschaftsprüfer',
                    'Abschlussprüfer',
                    'Prüfungsplan',
                    'Prüfungshandlungen',
                    'Ausschlussgründe',
                    'Berichterstattung'
                ],
                normal: [
                    'Der Abschlussprüfer prüft den Jahresabschluss auf Gesetzeskonformität.',
                    'Der Bestätigungsvermerk enthält das Prüfungsurteil des Abschlussprüfers.',
                    'Kapitalgesellschaften müssen ihren Abschluss prüfen lassen.',
                    'Der Prüfungsbericht dokumentiert die Feststellungen und wird dem Aufsichtsrat vorgelegt.',
                    'Der Abschlussprüfer muss unabhängig und unparteiisch sein.',
                    'Prüfungsausschlussgründe sind in Paragraf 319 HGB geregelt.',
                    'Der Prüfungsplan legt Art, Umfang und Zeitplan der Prüfung fest.',
                    'Eine eingeschränkte Bestätigung wird bei Prüfungseinschränkungen erteilt.',
                    'Die Verweigerung des Bestätigungsvermerks hat gravierende Folgen.',
                    'Der Prüfungshinweis weist auf besondere Sachverhalte hin.'
                ],
                schwer: [
                    'Der Abschlussprüfer hat die Einhaltung der GoB zu beurteilen und festzustellen, ob der Jahresabschluss ein den tatsächlichen Verhältnissen entsprechendes Bild der Vermögens- Finanz- und Ertragslage vermittelt.',
                    'Bei Prüfungsausschlussgründen nach Paragraf 319 HGB darf der Abschlussprüfer den Auftrag nicht annehmen und muss die Bestellung ablehnen oder niederlegen.',
                    'Der verschlüsselte Bestätigungsvermerk nach IDW PS 400 enthält eine detaillierte Darstellung des Prüfungsumfangs und der durchgeführten Prüfungshandlungen mit allen wesentlichen Abweichungen.',
                    'In der Schlussbesprechung hat der Prüfer alle wesentlichen Feststellungen offenzulegen und dem Mandanten Gelegenheit zur Stellungnahme zu geben, bevor der Prüfungsbericht finalisiert wird.'
                ]
            }
        },

        steuerrecht: {
            1: {
                leicht: [
                    'Lohnsteuer',
                    'Körperschaftsteuer',
                    'Solidaritätszuschlag',
                    'Kirchensteuer',
                    'Steuer-ID',
                    'Finanzamt',
                    'Bescheid',
                    'Einspruch',
                    'Veranlagung',
                    'Frist einhalten'
                ],
                normal: [
                    'Die Körperschaftsteuer betrifft Kapitalgesellschaften und Vereine.',
                    'Der Solidaritätszuschlag wird als Zuschlag zur Einkommensteuer erhoben.',
                    'Die Kirchensteuer beträgt 8 oder 9 Prozent der Einkommensteuer.',
                    'Verspätungszuschläge werden bei fehlender Erklärung festgesetzt.',
                    'Der Vorläufigkeitsvermerk erlaubt spätere Änderungen des Bescheids.',
                    'Jeder Steuerpflichtige muss eine Steuernummer beantragen.',
                    'Die Veranlagung erfolgt durch das zuständige Finanzamt.',
                    'Gegen einen Bescheid kann innerhalb eines Monats Einspruch eingelegt werden.',
                    'Die Steuererklärung muss fristgerecht eingereicht werden.',
                    'Das Besteuerungsverfahren ist in der Abgabenordnung geregelt.'
                ],
                schwer: [
                    'Die Einkommensteuer wird nach dem Progressionstarif berechnet, wobei der Steuersatz mit steigendem Einkommen ansteigt und bei einem Spitzensatz von 42 Prozent gedeckelt ist.',
                    'Die Abgabenordnung regelt das Steuerverfahrensrecht, die Betriebsprüfung, die Außenprüfung und die Steueraufsicht und bildet das Fundament des gesamten Steuerrechts.',
                    'Bei Sonderausgaben sind die betragsmäßigen Grenzen des Einkommensteuergesetzes strikt zu beachten, da Überschreitungen steuerlich nicht berücksichtigt werden.',
                    'Das Verhältnis zwischen nationalen Steuergesetzen und dem Unionsrecht kann zu Konflikten führen, die durch Vorlage an den Europäischen Gerichtshof zu klären sind.'
                ]
            },
            2: {
                leicht: [
                    'Gewinneinkünfte',
                    'Überschusseinkünfte',
                    'Land- und Forstwirtschaft',
                    'Selbstständige Arbeit',
                    'Nichtselbstständige Arbeit',
                    'Kapitalerträge',
                    'Vermietung Verpachtung',
                    'Sonstige Einkünfte',
                    'Zusammenveranlagung',
                    'Steuerklasse'
                ],
                normal: [
                    'Gewinneinkünfte unterliegen der Gewinneinkünfteermittlung.',
                    'Überschusseinkünfte werden nach dem Überschussprinzip ermittelt.',
                    'Bei Zusammenveranlagung werden beide Einkommen zusammengefasst.',
                    'Der Grundfreibetrag stellt das Existenzminimum steuerfrei.',
                    'Einkünfte aus Vermietung umfassen Mieteinnahmen minus Werbungskosten.',
                    'Kapitalertragsteuer wird auf Zinsen, Dividenden und Kursgewinne erhoben.',
                    'Sonstige Einkünfte umfassen Renten und Spekulationsgewinne.',
                    'Die Einkünfteermittlung unterscheidet zwei Methoden.',
                    'Bei Ehegatten kann zwischen Veranlagungsarten gewählt werden.',
                    'Die Steuerklasse bestimmt den monatlichen Lohnsteuerabzug.'
                ],
                schwer: [
                    'Einkünfte aus Gewerbebetrieb werden durch Betriebsvermögensvergleich oder Einnahmenüberschussrechnung ermittelt, wobei der Betriebsvermögensvergleich bei Buchführungspflicht zwingend ist.',
                    'Die Verlustverrechnung unterliegt Beschränkungen bei Verlusten aus gewerblicher Tierzucht, Termingeschäften und der Veräußerung von Beteiligungen.',
                    'Bei Vermietungseinkünften dürfen alle Werbungskosten abgezogen werden, die mit der Erzielung der Einnahmen in wirtschaftlichem Zusammenhang stehen.',
                    'Der Progressionsvorbehalt greift bei bestimmten steuerfreien Einkünften, die in die Berechnung des Steuersatzes einbezogen werden und den Steuersatz auf die übrigen Einkünfte erhöhen.'
                ]
            },
            3: {
                leicht: [
                    'Paragraf 4 EStG',
                    'Paragraf 5 EStG',
                    'Paragraf 7 EStG',
                    'Betriebsausgaben',
                    'Werbungskosten',
                    'Sonderausgaben',
                    'Außergewöhnlich',
                    'Freibetrag',
                    'Pauschbetrag',
                    'Abzugsgrenze'
                ],
                normal: [
                    'Nach Paragraf 4 Absatz 4 EStG sind Betriebsausgaben abziehbar.',
                    'Paragraf 5 EStG regelt die Gewinnermittlung durch Vermögensvergleich.',
                    'Die AfA nach Paragraf 7 EStG verteilt die Kosten auf die Nutzungsdauer.',
                    'Werbungskosten sind Aufwendungen zur Erwerbung von Einnahmen.',
                    'Sonderausgaben umfassen Versicherungsbeiträge und Spenden.',
                    'Außergewöhnliche Belastungen mindern das Einkommen bei Härten.',
                    'Der Arbeitnehmer-Pauschbetrag beträgt 1230 Euro jährlich.',
                    'Vorsorgeaufwendungen sind als Sonderausgaben bis zu Grenzen abziehbar.',
                    'Kinderfreibeträge berücksichtigen die kindbezogenen Freibeträge.',
                    'Behinderten-Pauschbeträge werden bei Nachweis der Behinderung gewährt.'
                ],
                schwer: [
                    'Nach Paragraf 4 Absatz 4 EStG dürfen Betriebsausgaben nur abgezogen werden, wenn sie durch den Betrieb veranlasst sind, was eine objektive und subjektive Veranlassung voraussetzt.',
                    'Die degressive AfA ermöglicht in den ersten Jahren höhere Abschreibungsbeträge und führt zu einer zeitlichen Verlagerung des Aufwands in die frühen Nutzungsjahre.',
                    'Bei außergewöhnlichen Belastungen nach Paragraf 33 EStG ist eine zumutbare Belastung zu berechnen, die von Einkünften, Familienverhältnissen und Kinderzahl abhängt.',
                    'Die Abgrenzung zwischen Betriebsausgaben und privaten Aufwendungen erfordert bei gemischter Veranlassung eine auftragsbezogene Aufteilung.'
                ]
            },
            4: {
                leicht: [
                    'Regelsteuersatz',
                    'Ermäßigter Satz',
                    'Steuerbefreiung',
                    'Ort der Leistung',
                    'Vorsteuerabzug',
                    'Rechnungspflicht',
                    'Kleinunternehmer',
                    'USt-Voranmeldung',
                    'Zusammenfassende Meldung',
                    'Innergemeinschaftlich'
                ],
                normal: [
                    'Der ermäßigte Steuersatz von 7 Prozent gilt für Lebensmittel und Bücher.',
                    'Bei innergemeinschaftlichen Lieferungen greift die Steuerbefreiung.',
                    'Der Ort der Lieferung bestimmt, wo die Umsatzsteuer anfällt.',
                    'Die Zusammenfassende Meldung ist für innergemeinschaftliche Umsätze nötig.',
                    'Innergemeinschaftliche Erwerbe unterliegen der Besteuerung im Empfangsland.',
                    'Die Umsatzsteuervoranmeldung wird monatlich oder vierteljährlich erstellt.',
                    'Kleinunternehmer weisen nach Paragraf 19 UStG keine Steuer aus.',
                    'Die Umsatzsteuer ist bis zum zehnten des Folgemonats zu entrichten.',
                    'Rechnungen müssen alle Pflichtangaben nach Paragraf 14 UStG enthalten.',
                    'Der Vorsteuerabzug setzt eine ordnungsgemäße Rechnung voraus.'
                ],
                schwer: [
                    'Der Vorsteuerabzug nach Paragraf 15 UStG ist nur zulässig, wenn die Leistung für das Unternehmen bezogen wurde, eine rechtmäßige Rechnung vorliegt und keine Ausschlussgründe eingreifen.',
                    'Bei der Bestimmung des Ortes der sonstigen Leistung ist zwischen B2B- und B2C-Leistungen zu unterscheiden, wobei bei B2B grundsätzlich der Empfängerort maßgeblich ist.',
                    'Der Übergang der Steuerschuldnerschaft nach Paragraf 13b UStG führt dazu, dass der Leistungsempfänger die Steuer schuldet und gleichzeitig den Vorsteuerabzug geltend machen kann.',
                    'Die Berichtigung des Vorsteuerabzugs nach Paragraf 15a UStG ist bei Änderung der Verhältnisse innerhalb des Berichtigungszeitraums erforderlich.'
                ]
            },
            5: {
                leicht: [
                    'Steuererklärung',
                    'Anlage N',
                    'Anlage KAP',
                    'Anlage V',
                    'Anlage G',
                    'Anlage R',
                    'Anlage Kind',
                    'ELSTER',
                    'Fristverlängerung',
                    'Bestandskraft'
                ],
                normal: [
                    'Die Einkommensteuererklärung muss bis zum 31. Juli des Folgejahres eingereicht werden.',
                    'Anlage N erfasst die Einkünfte aus nichtselbständiger Arbeit.',
                    'In der Anlage KAP werden Zinsen und Dividenden eingetragen.',
                    'Die Anlage V dient der Erklärung von Vermietungseinkünften.',
                    'Anlage G wird für gewerbliche Einkünfte benötigt.',
                    'Die Anlage Kind beantragt Kindergeld und Kinderfreibeträge.',
                    'Steuerberater können die Einreichungsfrist verlängern.',
                    'Die elektronische Steuererklärung wird über ELSTER abgewickelt.',
                    'Einkommensteuerbescheide ergehen nach Prüfung durch das Finanzamt.',
                    'Nach Ablauf der Einspruchsfrist wird der Bescheid bestandskräftig.'
                ],
                schwer: [
                    'Die freiwillige Abgabe der Einkommensteuererklärung ist innerhalb von vier Jahren möglich und empfiehlt sich, wenn zu viel Steuern abgezogen wurden oder besondere Freibeträge geltend gemacht werden können.',
                    'Bei der elektronischen Übermittlung über ELSTER müssen die Daten mit einer qualifizierten Signatur versehen werden, wenn die Erklärung durch einen Steuerberater übermittelt wird.',
                    'Die Berichtigungspflicht nach Paragraf 153 AO verpflichtet den Steuerpflichtigen, nachträglich erkannte Fehler unverzüglich anzuzeigen und zu korrigieren.',
                    'Der Vorläufigkeitsvermerk wegen ausstehender BFH-Rechtsprechung ermöglicht eine spätere Änderung des Bescheids, wenn das Gericht entscheidet.'
                ]
            },
            6: {
                leicht: [
                    'Gewerbesteuer',
                    'Gewerbeertrag',
                    'Steuermessbetrag',
                    'Hebesatz',
                    'Freibetrag',
                    'Hinzurechnung',
                    'Kürzung',
                    'Zerlegung',
                    'Vorauszahlung',
                    'Erklärung'
                ],
                normal: [
                    'Die Gewerbesteuer wird auf den Gewerbeertrag des Unternehmens erhoben.',
                    'Der Freibetrag für Einzelunternehmer beträgt 24.500 Euro.',
                    'Der Steuermessbetrag ergibt sich aus Ertrag mal Steuermesszahl.',
                    'Der Hebesatz wird von der jeweiligen Gemeinde festgelegt.',
                    'Hinzurechnungen erhöhen den Gewerbeertrag um Finanzierungsaufwendungen.',
                    'Kürzungen mindern den Gewerbeertrag um bestimmte steuerfreie Erträge.',
                    'Die Zerlegung verteilt die Steuer auf mehrere Betriebsstätten.',
                    'Vorauszahlungen sind vierteljährlich zu leisten.',
                    'Die Gewerbesteuererklärung ist beim Finanzamt einzureichen.',
                    'Kapitalgesellschaften haben keinen Freibetrag bei der Gewerbesteuer.'
                ],
                schwer: [
                    'Die Hinzurechnung nach Paragraf 8 GewStG umfasst ein Viertel der Entgelte für Schulden, ein Fünftel der Mietzinsen und die Hälfte der Konzessionsabgaben, wodurch der Gewerbeertrag künstlich erhöht wird.',
                    'Die Zerlegung nach Paragraf 28 GewStG erfolgt im Verhältnis der Arbeitslöhne und hat zur Folge, dass jede Betriebsstättengemeinde ihren Anteil an der Steuer erhält.',
                    'Die erweiterte Kürzung nach Paragraf 9 Nummer 2 GewStG begünstigt Unternehmen, die ausschließlich eigene Grundstücke verwalten und nutzen.',
                    'Bei der Festsetzung der Vorauszahlungen ist der voraussichtliche Gewerbeertrag des laufenden Erhebungszeitraums zugrunde zu legen.'
                ]
            },
            7: {
                leicht: [
                    'Betriebsprüfung',
                    'Außenprüfung',
                    'Prüfungszeitraum',
                    'Stichprobe',
                    'Verprobung',
                    'Prüfungsbericht',
                    'Feststellungen',
                    'Steuerhinterziehung',
                    'Steuerverkürzung',
                    'Berater hinzuziehen'
                ],
                normal: [
                    'Die Außenprüfung wird durch das Finanzamt bei bestimmten Steuerpflichtigen durchgeführt.',
                    'Der Prüfungszeitraum umfasst in der Regel drei Veranlagungszeiträume.',
                    'Der Prüfer hat das Recht, alle geschäftlichen Unterlagen einzusehen.',
                    'Stichproben dienen der Überprüfung der Buchführungsqualität.',
                    'Die Verprobung vergleicht betriebliche Kennzahlen mit Branchenwerten.',
                    'Im Prüfungsbericht werden alle Feststellungen dokumentiert.',
                    'Prüfungsfeststellungen können zu Änderungsbescheiden führen.',
                    'Steuerhinterziehung ist eine Straftat nach Paragraf 370 AO.',
                    'Die leichtfertige Steuerverkürzung ist als Ordnungswidrigkeit eingestuft.',
                    'Der Steuerpflichtige darf einen Berater zur Prüfung hinzuziehen.'
                ],
                schwer: [
                    'Die Außenprüfung nach Paragraf 193 AO wird bei Steuerpflichtigen durchgeführt, die bestimmte Umsatz- oder Gewinngrenzen überschreiten, und umfasst die Prüfung aller steuerlichen Verhältnisse des Prüfungszeitraums.',
                    'Die Verprobungsmethoden umfassen die Zeitreihenanalyse, die Richtsatzsatzung und den Kassenverprobungsrechner zur Plausibilitätskontrolle der erklärten Einkünfte.',
                    'Bei Feststellung von Fehlern ist zwischen einfachen Buchführungsfehlern, systematischen Fehlern und vorsätzlichen Manipulationen zu unterscheiden, was unterschiedliche Folgen hat.',
                    'Die Selbstanzeige nach Paragraf 371 AO ermöglicht bei rechtzeitiger und vollständiger Offenlegung der Steuerhinterziehung Straffreiheit, sofern keine Sperrgründe vorliegen.'
                ]
            },
            8: {
                leicht: [
                    'Einspruch legen',
                    'Antrag stellen',
                    'Frist wahren',
                    'Begründung schreiben',
                    'Aussetzung Vollziehung',
                    'Einspruchsentscheidung',
                    'Finanzgericht',
                    'Revision BFH',
                    'Verfassungsbeschwerde',
                    'Einigung'
                ],
                normal: [
                    'Der Einspruch muss innerhalb eines Monats eingelegt werden.',
                    'Die Aussetzung der Vollziehung hemmt die Vollstreckung.',
                    'Der Einspruch ist schriftlich beim Finanzamt einzulegen.',
                    'Die Begründung sollte die rechtlichen Argumente enthalten.',
                    'Die Einspruchsentscheidung ergeht durch das Finanzamt.',
                    'Gegen die Einspruchsentscheidung kann Klage erhoben werden.',
                    'Das Finanzgericht entscheidet in erster Instanz über Steuerstreitigkeiten.',
                    'Revision zum BFH ist nur bei grundsätzlicher Bedeutung zulässig.',
                    'Die Verfassungsbeschwerde ist das letzte rechtliche Mittel.',
                    'Außergerichtliche Einigungen beschleunigen das Verfahren.'
                ],
                schwer: [
                    'Der Einspruch nach Paragraf 354 AO hat aufschiebende Wirkung, das heißt der angefochtene Verwaltungsakt darf nicht vollzogen werden, es sei denn, die Behörde ordnet die sofortige Vollziehung an.',
                    'Die Klage vor dem Finanzgericht ist innerhalb eines Monats nach Zustellung der Einspruchsentscheidung zu erheben und hat suspensive Wirkung.',
                    'Die Revision zum BFH nach Paragraf 115 FGO ist nur zulässig, wenn das Finanzgericht die Revision zugelassen hat oder der BFH auf Beschwerde die Revision zulässt.',
                    'Die Wiedereinsetzung in den vorigen Stand nach Paragraf 56 FGO ist möglich, wenn ein Beteiligter ohne Verschulden an der Einhaltung einer Frist gehindert wurde.'
                ]
            },
            9: {
                leicht: [
                    'Stundung beantragen',
                    'Ratenzahlung',
                    'Steuererlass',
                    'Fristverlängerung',
                    'Vollstreckung',
                    'Kontopfändung',
                    'Steuer-ID',
                    'Unbedenklichkeitsbescheinigung',
                    'Bescheinigung',
                    'Bestätigung'
                ],
                normal: [
                    'Eine Steuerstundung ist bei vorübergehender Zahlungsunfähigkeit möglich.',
                    'Ratenzahlungen können beim Finanzamt formlos beantragt werden.',
                    'Der Steuererlass aus Billigkeitsgründen ist in Paragraf 227 AO geregelt.',
                    'Die Fristverlängerung wird auf Antrag gewährt.',
                    'Vollstreckungsmaßnahmen können durch Zahlung abgewendet werden.',
                    'Die Kontopfändung erfolgt durch die Vollziehungsstelle.',
                    'Die steuerliche Identifikationsnummer ist bundeseinheitlich.',
                    'Unbedenklichkeitsbescheinigungen werden bei Grundstücksverkäufen benötigt.',
                    'Bescheinigungen des Finanzamts sind in bestimmten Situationen erforderlich.',
                    'Bestätigungen können formlos beim Finanzamt beantragt werden.'
                ],
                schwer: [
                    'Die Stundung nach Paragraf 222 AO setzt voraus, dass die Einziehung eine erhebliche Härte darstellen würde und der Anspruch nicht gefährtet erscheint, wobei Stundung in der Regel gegen Sicherheitsleistung zu gewähren ist.',
                    'Der Erlass nach Paragraf 227 AO aus persönlichen Billigkeitsgründen erfordert eine Darlegung der wirtschaftlichen Verhältnisse und ist eine Ermessensentscheidung der Finanzbehörde.',
                    'Die Vollstreckung nach Paragraf 249 AO umfasst die Pfändung von Forderungen, die Zwangsvollstreckung in unbewegliches Vermögen und die Pfändung von körperlichen Sachen.',
                    'Die Duldungskontopfändung nach Paragraf 309 AO ermöglicht trotz Pfändung bestimmte Zahlungen an den Steuerpflichtigen zur Existenzsicherung.'
                ]
            },
            10: {
                leicht: [
                    'Erbschaftsteuer',
                    'Schenkungsteuer',
                    'Grunderwerbsteuer',
                    'Doppelbesteuerung',
                    'Abkommen',
                    'Hinzurechnung',
                    'AStG',
                    'Steuerklasse',
                    'Freibetrag',
                    'Bewertung'
                ],
                normal: [
                    'Die Erbschaftsteuer wird auf den Erwerb von Todes wegen erhoben.',
                    'Schenkungen zu Lebzeiten unterliegen der Schenkungsteuer.',
                    'Der Grunderwerbsteuer unterliegen alle Grundstücksübertragungen.',
                    'Doppelbesteuerungsabkommen verhindern doppelte Besteuerung.',
                    'Freibeträge bei der Erbschaftsteuer hängen vom Verwandtschaftsgrad ab.',
                    'Steuerklassen bei der Erbschaftsteuer reichen von eins bis drei.',
                    'Die Hinzurechnungsbesteuerung verhindert Steuervermeidung.',
                    'Auslandssachverhalte erfordern besondere steuerliche Sorgfalt.',
                    'Die Bewertung von Grundbesitz erfolgt nach dem Bedarfswertverfahren.',
                    'Das Außensteuergesetz regelt die Besteuerung bei Auslandsbezug.'
                ],
                schwer: [
                    'Die Hinzurechnungsbesteuerung nach Paragraf 7 bis 14 AStG erfasst passive Einkünfte aus Zwischengesellschaften in Niedrigsteuerländern und unterwirft diese der deutschen Besteuerung ohne Ausschüttung.',
                    'Die Bewertung von Grundbesitz für die Erbschaftsteuer erfolgt nach dem Bedarfswertverfahren mit unterschiedlichen Methoden für Wohnungs- und Teileigentum.',
                    'Doppelbesteuerungsabkommen nach dem OECD-Musterabkommen regeln die Verteilung des Besteuerungsrechts zwischen Ansässigkeits- und Quellenstaat.',
                    'Die erweiterte beschränkte Steuerpflicht nach Paragraf 2 AStG erfasst deutsche Staatsbürger mit Wohnsitz im Ausland, die wesentliche wirtschaftliche Beziehungen zu Deutschland unterhalten.'
                ]
            }
        },

        bilanzen: {
            1: {
                leicht: [
                    'Aktiva Passiva',
                    'Eigenkapital',
                    'Fremdkapital',
                    'Anlagevermögen',
                    'Umlaufvermögen',
                    'Bilanzsumme',
                    'Finanzlage',
                    'Mittelherkunft',
                    'Mittelverwendung',
                    'Jahresüberschuss'
                ],
                normal: [
                    'Die Bilanz zeigt die Vermögens- und Kapitalstruktur eines Unternehmens.',
                    'Aktiva umfassen alle Vermögensgegenstände des Unternehmens.',
                    'Passiva zeigen die Mittelherkunft aus Eigen- und Fremdkapital.',
                    'Die Bilanzsumme ist auf Aktiv- und Passivseite identisch.',
                    'Die Eigenkapitalquote zeigt die finanzielle Stabilität.',
                    'Anlagevermögen wird langfristig im Unternehmen genutzt.',
                    'Umlaufvermögen umfasst kurzfristig verfügbare Mittel.',
                    'Die Bilanz ist am Jahresabschlussstichtag zu erstellen.',
                    'Jeder Kaufmann ist zur Aufstellung einer Bilanz verpflichtet.',
                    'Das Eigenkapital haftet den Gläubigern als Sicherheit.'
                ],
                schwer: [
                    'Die Bilanzierungspflicht ergibt sich aus Paragraf 242 HGB und trifft jeden Kaufmann, wobei der Jahresabschluss aus Bilanz und GuV besteht und Paragraf 264 HGB entsprechen muss.',
                    'Die Gliederung der Bilanz für Kapitalgesellschaften ist in Paragraf 266 HGB verbindlich vorgeschrieben und unterscheidet zwischen Anlagevermögen, Umlaufvermögen, Eigenkapital, Rückstellungen und Verbindlichkeiten.',
                    'Das Vorsichtsprinzip verlangt, dass Vermögensgegenstände höchstens zu Anschaffungskosten bewertet werden und Verbindlichkeiten in voller Höhe auszuweisen sind.',
                    'Die Stetigkeit der Bilanzierung verlangt, dass die Methoden von Jahr zu Jahr beibehalten werden, um die Vergleichbarkeit sicherzustellen.'
                ]
            },
            2: {
                leicht: [
                    'Sachanlagen',
                    'Betriebsvorrichtungen',
                    'BGA abschreiben',
                    'Fuhrpark buchen',
                    'Anschaffungskosten',
                    'Herstellungskosten',
                    'Nutzungsdauer',
                    'Restbuchwert',
                    'Wertminderung',
                    'Neubewertung'
                ],
                normal: [
                    'Sachanlagen werden zu Anschaffungs- oder Herstellungskosten bilanziert.',
                    'Die Anschaffungskosten umfassen Kaufpreis und Nebenkosten.',
                    'Herstellungskosten umfassen Material, Lohn und angemessene Gemeinkosten.',
                    'Die planmäßige Abschreibung verteilt die Kosten auf die Nutzungsdauer.',
                    'Der Restbuchwert ist der Wert nach Abzug der kumulierten Abschreibungen.',
                    'Betriebsvorrichtungen sind abnutzbare Anlagegüter.',
                    'BGA wird als Sammelposition für Betriebs- und Geschäftsausstattung gebucht.',
                    'Fuhrparkfahrzeuge werden als Sachanlagevermögen aktiviert.',
                    'Außerplanmäßige Abschreibungen bei dauerhafter Wertminderung sind Pflicht.',
                    'Die Nutzungsdauer richtet sich nach den AfA-Tabellen.'
                ],
                schwer: [
                    'Die Herstellungskosten nach Paragraf 255 Absatz 2 HGB umfassen zwingend Materialeinzelkosten, Fertigungseinzelkosten und angemessene Teile der Gemeinkosten, wobei Verwaltungskosten nur eingeschlossen werden dürfen, soweit sie auf die Herstellung entfallen.',
                    'Bei der Bestimmung der Nutzungsdauer sind die AfA-Tabellen des Bundesministeriums der Finanzen heranzuziehen, wobei im Einzelfall eine kürzere oder längere Nutzungsdauer nachgewiesen werden kann.',
                    'Anschaffungsnahe Herstellungskosten nach Paragraf 6 Absatz 1 Nummer 1a EStG führen zu einer Aktivierungspflicht, wenn die Instandsetzungsaufwendungen innerhalb von drei Jahren 15 Prozent der Anschaffungskosten übersteigen.',
                    'Der Imparitätsgrundsatz verlangt, dass drohende Verluste sofort zu berücksichtigen sind, während unrealisierte Gewinne erst bei Realisierung ausgewiesen werden dürfen.'
                ]
            },
            3: {
                leicht: [
                    'Vorräte bewerten',
                    'Rohstoffe erfassen',
                    'Handelswaren',
                    'Fertigprodukte',
                    'Bestandsänderung',
                    'Einzelbewertung',
                    'FIFO Verfahren',
                    'LIFO Verfahren',
                    'Nettoverkaufswert',
                    'Teilwertabschreibung'
                ],
                normal: [
                    'Vorräte werden zum niedrigeren Wert aus Kosten und Marktwert bewertet.',
                    'Rohstoffe und Hilfsstoffe gehören zum materiellen Umlaufvermögen.',
                    'Handelswaren sind zum Einkaufspreis bewertet abzüglich Nachlässe.',
                    'Unfertige Erzeugnisse werden mit den bisherigen Herstellungskosten bewertet.',
                    'Die Bestandsänderung ergibt sich aus Zugang minus Abgang.',
                    'Das Einzelbewertungsprinzip erfordert die Bewertung jedes Stücks einzeln.',
                    'FIFO und LIFO sind zulässige Verbrauchsfolgeverfahren.',
                    'Der Nettoveräußerungswert ist die Obergrenze für die Bewertung.',
                    'Wertschwungrücklagen sind bei Finanzinstrumenten möglich.',
                    'Der strengste Wertansatz ist bei der Vorratsbewertung maßgeblich.'
                ],
                schwer: [
                    'Bei der Bewertung nach Paragraf 253 Absatz 4 HGB ist der niedrigere Wert aus Anschaffungs- oder Herstellungskosten und dem beizulegenden Wert maßgeblich, wobei bei dauerhafter Wertminderung zwingend abzuschreiben ist.',
                    'FIFO wertet die zuerst beschafften Vorräte als zuerst verbraucht und führt bei steigenden Preisen zu einem höheren Bestandswert, während LIFO den gegenteiligen Effekt hat.',
                    'Die Bewertung unfertiger Erzeugnisse erfordert die Ermittlung der Herstellungskosten nach Paragraf 255 Absatz 2 HGB mit betriebsindividuellen Gemeinkostenzuschlägen.',
                    'Die Teilwertabschreibung nach Paragraf 6 Absatz 1 Nummer 2 EStG ist zwingend, wenn der Teilwert dauerhaft unter den Anschaffungskosten liegt und keine Werterholung zu erwarten ist.'
                ]
            },
            4: {
                leicht: [
                    'GuV erstellen',
                    'Umsatzerlöse',
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
                    'Die GuV zeigt die Ertragslage des Unternehmens im Geschäftsjahr.',
                    'Umsatzerlöse umfassen alle Erlöse aus der gewöhnlichen Tätigkeit.',
                    'Die Herstellungskosten der Umsatzerlöse sind abzuziehen.',
                    'Das Bruttoergebnis ergibt sich aus Erlösen minus Herstellungskosten.',
                    'Vertriebskosten und Verwaltungskosten sind gesondert auszuweisen.',
                    'Das Betriebsergebnis zeigt die Leistungsfähigkeit des Kerngeschäfts.',
                    'Das Zinsergebnis umfasst Zinserträge minus Zinsaufwendungen.',
                    'Außerordentliche Posten sind gesondert zu zeigen.',
                    'Steuern vom Einkommen mindern das Ergebnis.',
                    'Der Jahresüberschuss ist das Saldo aller Erträge minus Aufwendungen.'
                ],
                schwer: [
                    'Das Umsatzkostenverfahren nach Paragraf 275 Absatz 3 HGB gliedert die Aufwendungen nach Funktionen und stellt sie den Umsatzerlösen gegenüber, wodurch das Betriebsergebnis als Zwischengröße ausgewiesen wird.',
                    'Beim Gesamtkostenverfahren nach Paragraf 275 Absatz 2 HGB werden die Aufwendungen nach Arten gegliedert den Erträgen gegenübergestellt, wobei Bestandsänderungen gesondert auszuweisen sind.',
                    'Die Zuordnung von Aufwendungen zu den funktionalen Bereichen erfordert eine verursachungsgerechte Verteilung der Gemeinkosten auf Herstellung, Vertrieb und Verwaltung.',
                    'Die Ergebnisgliederung nach Paragraf 275 HGB schreibt zwingend die getrennte Ausweisung des ordentlichen und des außerordentlichen Ergebnisses vor.'
                ]
            },
            5: {
                leicht: [
                    'Rückstellungen',
                    'Pensionen',
                    'Steuerrückstellung',
                    'Urlaubsrückstellung',
                    'Gewährleistung',
                    'Aufwandsrückstellung',
                    'Diskontierung',
                    'Auflösung',
                    'Bewertung',
                    'Bilanzposten'
                ],
                normal: [
                    'Rückstellungen werden für ungewisse Verbindlichkeiten gebildet.',
                    'Pensionsrückstellungen sind die größten Rückstellungen vieler Unternehmen.',
                    'Steuer-Rückstellungen decken die voraussichtliche Steuerlast ab.',
                    'Urlaubsrückstellungen decken den Anspruch auf unbezahlten Urlaub.',
                    'Gewährleistungsrückstellungen sichern künftige Garantiefälle ab.',
                    'Die Diskontierung bei Laufzeit über einem Jahr ist Pflicht.',
                    'Rückstellungen sind unter dem Posten Rückstellungen auszuweisen.',
                    'Die Auflösung erfolgt bei Wegfall des Grundes.',
                    'Rückstellungen dürfen nur für konkretisierte Verbindlichkeiten gebildet werden.',
                    'Der Rückstellungsaufwand mindert das Ergebnis des laufenden Jahres.'
                ],
                schwer: [
                    'Die Bildung nach Paragraf 249 HGB ist zwingend für ungewisse Verbindlichkeiten, drohende Verluste aus schwebenden Geschäften und unterlassene Instandhaltungsaufwendungen innerhalb von drei Monaten.',
                    'Die Bewertung nach Paragraf 253 Absatz 1 HGB hat in Höhe des nach vernünftiger kaufmännischer Beurteilung notwendigen Erfüllungsbetrags zu erfolgen, wobei bei Laufzeit über einem Jahr abzuzinsen ist.',
                    'Pensionsrückstellungen nach Paragraf 6a EStG unterliegen strengen Vorgaben hinsichtlich der Berechnungsmethode und der biometrischen Rechnungsgrundlagen.',
                    'Die Auflösung von Rückstellungen ist erfolgswirksam vorzunehmen und im Anhang zu erläutern, insbesondere bei großen Einzelrückstellungen.'
                ]
            },
            6: {
                leicht: [
                    'EÜR Rechnung',
                    'Betriebseinnahmen',
                    'Betriebsausgaben',
                    'Gewinnermittlung',
                    'Zuflussprinzip',
                    'Abflussprinzip',
                    'Freiberufler',
                    'Steuerlicher Gewinn',
                    'Betriebsvermögen',
                    'Gewinnfreibetrag'
                ],
                normal: [
                    'Die EÜR ist eine vereinfachte Gewinnermittlungsart.',
                    'Sie erfasst den Überschuss der Einnahmen über die Ausgaben.',
                    'Das Zufluss- und Abflussprinzip gilt bei der EÜR.',
                    'Freiberufler und Kleinunternehmer können die EÜR anwenden.',
                    'Die EÜR wird auf einem amtlichen Vordruck erstellt.',
                    'Betriebseinnahmen umfassen alle Einnahmen aus dem Betrieb.',
                    'Betriebsausgaben mindern den Gewinn bei betrieblicher Veranlassung.',
                    'Der steuerliche Gewinn ist die Grundlage der Einkommensteuer.',
                    'Die EÜR ist einfacher als die doppelte Buchführung zu erstellen.',
                    'Nicht jeder Kaufmann darf die EÜR anwenden.'
                ],
                schwer: [
                    'Die EÜR nach Paragraf 4 Absatz 3 EStG ist nur zulässig für Steuerpflichtige, die nicht zur doppelten Buchführung verpflichtet sind und deren Umsatz 600.000 Euro nicht übersteigt.',
                    'Das Zufluss- und Abflussprinzip führt dazu, dass Einnahmen erst bei tatsächlichem Zufluss und Ausgaben erst bei tatsächlichem Abfluss steuerlich zu berücksichtigen sind.',
                    'Bei Wechsel von der EÜR zur doppelten Buchführung ist eine Eröffnungsbilanz zu erstellen, in der alle Wirtschaftsgüter mit dem niedrigeren Wert aus Teilwert und Anschaffungskosten anzusetzen sind.',
                    'Die EÜR lässt keine Bildung von Rückstellungen zu und untersagt die Aktivierung selbst geschaffener immaterieller Wirtschaftsgüter des Anlagevermögens.'
                ]
            },
            7: {
                leicht: [
                    'Eigenkapital',
                    'Gezeichnetes Kapital',
                    'Kapitalrücklage',
                    'Gewinnrücklage',
                    'Gewinnvortrag',
                    'Verlustvortrag',
                    'Ausschüttung',
                    'Thesaurierung',
                    'Kapitalerhöhung',
                    'Eigenkapitalquote'
                ],
                normal: [
                    'Das gezeichnete Kapital ist das Grundkapital einer Kapitalgesellschaft.',
                    'Die Kapitalrücklage entsteht durch Agio bei Kapitalerhöhung.',
                    'Die gesetzliche Rücklage ist bei Kapitalgesellschaften zwingend.',
                    'Der Jahresüberschuss kann ausgeschüttet oder thesauriert werden.',
                    'Ein Gewinnvortrag erhöht das ausschüttbare Eigenkapital.',
                    'Verlustvorträge mindern das Eigenkapital und künftige Gewinne.',
                    'Die Ausschüttung bedarf bei der GmbH des Gesellschafterbeschlusses.',
                    'Thesaurierung bedeutet, dass Gewinne im Unternehmen verbleiben.',
                    'Kapitalerhöhungen erhöhen das Eigenkapital und die Haftungsgrundlage.',
                    'Die Eigenkapitalquote sollte mindestens 20 Prozent betragen.'
                ],
                schwer: [
                    'Die Ausschüttungssperre nach Paragraf 30 GmbHG verbietet Zahlungen an Gesellschafter, soweit das zur Deckung des Stammkapitals erforderliche Vermögen unterschritten wird.',
                    'Bei der Kapitalerhöhung aus Gesellschaftsmitteln nach Paragraf 207 AktG werden offene Rücklagen in gezeichnetes Kapital umgewandelt, ohne dass den Aktionären zusätzliche Mittel abverlangt werden.',
                    'Die Bildung gesetzlicher Rücklagen nach Paragraf 150 AktG verpflichtet AGs, 5 Prozent des Jahresüberschusses einzustellen, bis 10 Prozent des Grundkapitals erreicht sind.',
                    'Der verdeckte Gewinnausschüttung liegt vor, wenn ein Gesellschafter Vermögensvorteile erhält, die ein ordentlicher Kaufmann einem fremden Dritten nicht gewähren würde.'
                ]
            },
            8: {
                leicht: [
                    'Anhang erstellen',
                    'Lagebericht',
                    'Bilanzpolitik',
                    'Anhangangaben',
                    'Bewertungsmethoden',
                    'Sonderposten',
                    'Eventualverbindlichkeiten',
                    'Haftungsverhältnisse',
                    'Vorsichtsprinzip',
                    'Stetigkeit'
                ],
                normal: [
                    'Der Anhang ergänzt und erläutert die Bilanz und die GuV.',
                    'Kapitalgesellschaften müssen zwingend einen Anhang erstellen.',
                    'Der Lagebericht beschreibt die wirtschaftliche Lage des Unternehmens.',
                    'Bewertungsmethoden müssen im Anhang offengelegt werden.',
                    'Das Vorsichtsprinzip verlangt eine vorsichtige Bewertung.',
                    'Die Stetigkeit der Methoden ist über die Jahre einzuhalten.',
                    'Eventualverbindlichkeiten sind im Anhang zu erläutern.',
                    'Haftungsverhältnisse aus Bürgschaften sind unter der Bilanz auszuweisen.',
                    'Sonderposten mit Rücklagenanteil sind bei bestimmten Gesellschaften zulässig.',
                    'Bilanzpolitik beeinflusst die Darstellung der Unternehmenslage.'
                ],
                schwer: [
                    'Der Anhang nach Paragraf 284 HGB enthält Erläuterungen zur Bilanz und GuV, die Angaben zu den Bilanzierungs- und Bewertungsmethoden und zusätzliche Informationen für ein den tatsächlichen Verhältnissen entsprechendes Bild.',
                    'Der Lagebericht nach Paragraf 289 HGB hat den Geschäftsverlauf und die Lage so darzustellen, dass ein den tatsächlichen Verhältnissen entsprechendes Bild vermittelt wird.',
                    'Die Anhangangaben nach Paragraf 285 HGB umfassen die Grundlagen für die Währungsumrechnung, die Aufgliederung des Umsatzes nach Tätigkeitsbereichen und die durchschnittliche Zahl der Beschäftigten.',
                    'Die Bilanzierungshilfen nach Paragraf 254 HGB erlauben die Bildung eines Sonderpostens für die erstmalige Anwendung neuer Bewertungsmethoden.'
                ]
            },
            9: {
                leicht: [
                    'Konzernbilanz',
                    'Kapitalkonsolidierung',
                    'Schuldenkonsolidierung',
                    'Zwischenergebnis',
                    'Stille Reserven',
                    'Konzern GuV',
                    'Konzernanhang',
                    'Equity-Methode',
                    'Assoziiert',
                    'Konzernlagebericht'
                ],
                normal: [
                    'Die Konzernbilanz fasst die Einzelabschlüsse der Tochtergesellschaften zusammen.',
                    'Die Kapitalkonsolidierung eliminiert die Beteiligungsbuchwerte.',
                    'Die Schuldenkonsolidierung entfernt konzerninterne Forderungen.',
                    'Zwischenergebnisse aus konzerninternen Lieferungen sind zu eliminieren.',
                    'Die Aufdeckung stiller Reserven erfolgt bei der Erst konsolidierung.',
                    'Die Konzern-GuV zeigt das Gesamtergebnis des Konzerns.',
                    'Der Konzernanhang erläutert die Konsolidierungsmethoden.',
                    'Assoziierte Unternehmen werden nach der Equity-Methode einbezogen.',
                    'Die Equity-Methode bewertet Beteiligungen zum anteiligen Eigenkapital.',
                    'Der Konzernlagebericht beschreibt die Gesamtlage des Konzerns.'
                ],
                schwer: [
                    'Die Kapitalkonsolidierung nach Paragraf 301 HGB erfordert die Eliminierung des Buchwerts der Beteiligung gegen die anteiligen Eigenkapitalposten, wobei ein Unterschiedsbetrag als Firmenwert zu aktivieren ist.',
                    'Die Zwischenergebniseliminierung nach Paragraf 304 HGB betrifft alle konzerninternen Lieferungen, die im Bestand der aufnehmenden Konzerngesellschaft enthalten sind.',
                    'Die Equity-Methode nach Paragraf 312 HGB bewertet die Beteiligung mit dem anteiligen Eigenkapitalwert und berücksichtigt den anteiligen Gewinn im Konzernergebnis.',
                    'Die Währungsumrechnung nach Paragraf 308 HGB erfordert Stichtagskurse für die Bilanz und Durchschnittskurse für die GuV, wobei Umrechnungsdifferenzen erfolgsneutral im Eigenkapital erfasst werden.'
                ]
            },
            10: {
                leicht: [
                    'Steuerbilanz',
                    'Überleitungsrechnung',
                    'Bilanzsteuerrecht',
                    'Steuerlicher Gewinn',
                    'Betriebsvermögen',
                    'Sonderabschreibung',
                    'Investitionsabzug',
                    'Steuerliche Rücklage',
                    'Paragraf 6b Rücklage',
                    'Paragraf 7g EStG'
                ],
                normal: [
                    'Die Steuerbilanz ist die Grundlage für die steuerliche Gewinnermittlung.',
                    'Die Überleitungsrechnung gleicht Handels- und Steuerbilanz ab.',
                    'Steuerliche Abschreibungen können von der handelsrechtlichen AfA abweichen.',
                    'Sonderabschreibungen sind steuerliche Fördermaßnahmen für Investitionen.',
                    'Der Investitionsabzugsbetrag nach Paragraf 7g EStG begünstigt künftige Investitionen.',
                    'Die Rücklage nach Paragraf 6b EStG ermöglicht die Übertragung von Veräußerungsgewinnen.',
                    'Der Betriebsvermögensvergleich ermittelt den Gewinn durch Gegenüberstellung.',
                    'Steuerfreie Einnahmen bleiben bei der Gewinnermittlung unberücksichtigt.',
                    'Nicht abziehbare Betriebsausgaben erhöhen den steuerlichen Gewinn.',
                    'Die Steuerbilanz muss den Vorschriften der Abgabenordnung entsprechen.'
                ],
                schwer: [
                    'Die Überleitungsrechnung vom Handels- zum Steuerergebnis ist bei Kapitalgesellschaften zwingend und stellt alle Positionen dar, die handelsrechtlich und steuerlich unterschiedlich behandelt werden.',
                    'Der Investitionsabzugsbetrag nach Paragraf 7g EStG ermöglicht die steuerliche Berücksichtigung geplanter Investitionen im Voraus durch Bildung einer gewinnmindernden Rücklage.',
                    'Die Rücklagenbildung nach Paragraf 6b EStG ermöglicht die steuerneutrale Übertragung von Veräußerungsgewinnen auf neue Wirtschaftsgüter innerhalb bestimmter Fristen.',
                    'Der gewillkürte Betriebsvermögen nach Paragraf 8 Absatz 2 EStG umfasst Wirtschaftsgüter, die objektiv sowohl betrieblich als auch privat nutzbar sind und betrieblich zugeordnet wurden.'
                ]
            }
        },

        klr: {
            1: {
                leicht: [
                    'Kosten Erlöse',
                    'Fixe Variable',
                    'Einzel Gemeinkosten',
                    'Kostenstelle',
                    'Kostenträger',
                    'Kostenart',
                    'Kalkulation',
                    'Deckungsbeitrag',
                    'Selbstkosten',
                    'Gewinnzuschlag'
                ],
                normal: [
                    'Die Kosten- und Leistungsrechnung ist Teil des internen Rechnungswesens.',
                    'Einzelkosten können einem Kostenträger direkt zugerechnet werden.',
                    'Gemeinkosten müssen über Schlüssel auf die Kostenstellen verteilt werden.',
                    'Fixe Kosten fallen unabhängig von der Beschäftigung an.',
                    'Variable Kosten verändern sich mit der Produktionsmenge.',
                    'Die Kostenartenrechnung erfasst alle Kosten nach ihrer Art.',
                    'Die Kostenstellenrechnung ordnet die Kosten den Bereichen zu.',
                    'Die Kostenträgerrechnung ermittelt die Kosten pro Produkt.',
                    'Der Deckungsbeitrag ist die Differenz aus Erlös und variablen Kosten.',
                    'Die Kalkulation bestimmt den Selbstkostenpreis einer Leistung.'
                ],
                schwer: [
                    'Die Abgrenzungsrechnung überführt die Aufwendungen und Erträge der Finanzbuchhaltung in Kosten und Erlöse der Betriebsbuchhaltung, wobei neutraler Aufwand eliminiert und kalkulatorische Kosten ergänzt werden.',
                    'Die Differenzierung zwischen fixen und variablen Kosten ist die Grundlage der Grenzplankostenrechnung und ermöglicht eine verursachungsgerechte Zuordnung unter Berücksichtigung der Beschäftigungsschwankungen.',
                    'Der Deckungsbeitrag als Differenz zwischen Umsatzerlös und variablen Kosten dient der Beurteilung der Produktrentabilität und ist die zentrale Steuerungsgröße im Direct Costing.',
                    'Die Prozesskostenrechnung erfasst die Kosten wiederkehrender Tätigkeiten und ordnet sie den verursachenden Prozessen zu, wodurch eine verursachungsgerechte Gemeinkostenverteilung erreicht wird.'
                ]
            },
            2: {
                leicht: [
                    'Materialkosten',
                    'Personalkosten',
                    'Abschreibung',
                    'Kalk. Unternehmerlohn',
                    'Kalk. Miete',
                    'Kalk. Zinsen',
                    'Wagniskosten',
                    'Zusatzkosten',
                    'Anderskosten',
                    'Kostenauflösung'
                ],
                normal: [
                    'Materialkosten umfassen den Verbrauch von Roh- und Hilfsstoffen.',
                    'Personalkosten bestehen aus Löhnen, Gehältern und Sozialaufwand.',
                    'Kalkulatorische Kosten ersetzen Aufwendungen in der KLR.',
                    'Der kalkulatorische Unternehmerlohn ersetzt den Gewinnanteil des Inhabers.',
                    'Kalkulatorische Miete ersetzt die Miete für betrieblich genutztes Privateigentum.',
                    'Kalkulatorische Zinsen erfassen die Kosten des Eigenkapitals.',
                    'Wagniskosten decken die allgemeinen unternehmerischen Risiken ab.',
                    'Die Kostenauflösung teilt gemischte Kosten in fixe und variable Bestandteile.',
                    'Zusatzkosten sind kalkulatorische Kosten ohne entsprechenden Aufwand.',
                    'Anderskosten sind kalkulatorische Kosten mit abweichendem Aufwand.'
                ],
                schwer: [
                    'Die Abgrenzung zwischen Aufwand und Kosten erfolgt durch die Betriebsabrechnung, die neutralen Aufwand eliminiert und kalkulatorische Kosten ergänzt, um den entscheidungsrelevanten Kostenbegriff zu erhalten.',
                    'Der kalkulatorische Unternehmerlohn nach Paragraf 4 Absatz 7 EStG kann in Höhe eines angemessenen Geschäftsführergehalts berücksichtigt werden und dient der Vergleichbarkeit mit Kapitalgesellschaften.',
                    'Kalkulatorische Zinsen auf das eingesetzte Eigenkapital werden mit einem branchenüblichen Zinssatz berechnet und ermöglichen den Vergleich der Rentabilität verschiedener Investitionsalternativen.',
                    'Die Kostenauflösung nach der Methode der kleinsten Quadrate zerlegt gemischte Kosten in fixe und variable Bestandteile und ist Voraussetzung für die Deckungsbeitragsrechnung.'
                ]
            },
            3: {
                leicht: [
                    'Kostenstelle',
                    'BAB Tabelle',
                    'Umlageschlüssel',
                    'Hilfskostenstelle',
                    'Hauptkostenstelle',
                    'Kostenverteilung',
                    'Kostenumlage',
                    'Verrechnung',
                    'Stufenleiter',
                    'Gleichungsverfahren'
                ],
                normal: [
                    'Die Kostenstellenrechnung ordnet die Gemeinkosten den Verantwortungsbereichen zu.',
                    'Der Betriebsabrechnungsbogen ist das zentrale Instrument der Kostenstellenrechnung.',
                    'Hilfskostenstellen versorgen andere Kostenstellen mit innerbetrieblichen Leistungen.',
                    'Die Kostenumlage verteilt die Kosten der Hilfskostenstellen auf die Hauptkostenstellen.',
                    'Der Umlageschlüssel bestimmt die Verteilung der Gemeinkosten.',
                    'Typische Umlageschlüssel sind Fläche, Arbeitsstunden und Maschinenstunden.',
                    'Die innerbetriebliche Verrechnung erfasst Leistungen zwischen Kostenstellen.',
                    'Die Kostenverteilung ist Grundlage der Gemeinkostenzuschlagskalkulation.',
                    'Der BAB zeigt die Kostenentstehung in den einzelnen Betriebsbereichen.',
                    'Vorläufige Kostenstellen sammeln Kosten für die spätere Weiterverrechnung.'
                ],
                schwer: [
                    'Der Betriebsabrechnungsbogen nach dem Stufenleiterverfahren verteilt die Gemeinkosten schrittweise von den Vor- über die Hilfs- zu den Hauptkostenstellen, wobei die Verrechnungssätze für jede Stufe separat zu berechnen sind.',
                    'Die innerbetriebliche Leistungsverrechnung mit dem Gleichungsverfahren berücksichtigt die wechselseitigen Leistungsbeziehungen zwischen den Hilfskostenstellen und löst ein lineares Gleichungssystem.',
                    'Die Wahl des Umlageschlüssels hat entscheidenden Einfluss auf die verursachungsgerechte Verteilung der Gemeinkosten und muss einen starken Zusammenhang mit der Kostenverurschung aufweisen.',
                    'Anomalien bei der Kostenumlage entstehen, wenn die Summe der weiterverrechneten Kosten höher ist als die ursprünglichen Gemeinkosten, was bei mehrstufigen Umlageverfahren auftreten kann.'
                ]
            },
            4: {
                leicht: [
                    'Zuschlagskalkulation',
                    'Stundensatz',
                    'Lohnzuschlag',
                    'Materialzuschlag',
                    'Selbstkostenpreis',
                    'Nettoverkaufspreis',
                    'Barverkaufspreis',
                    'Zielverkaufspreis',
                    'Vorwärtskalkulation',
                    'Rückwärtskalkulation'
                ],
                normal: [
                    'Die Zuschlagskalkulation addiert Gemeinkostenzuschläge zu den Einzelkosten.',
                    'Der Materialzuschlag deckt die Materialgemeinkosten ab.',
                    'Der Lohnzuschlag verteilt die Fertigungsgemeinkosten auf die Arbeitsstunden.',
                    'Der Maschinenstundensatz erfasst alle Kosten einer Maschine pro Stunde.',
                    'Die Selbstkosten sind die Summe aller Kosten für ein Produkt.',
                    'Der Gewinnzuschlag wird auf die Selbstkosten aufgeschlagen.',
                    'Der Nettoverkaufspreis ist Selbstkosten plus Gewinnzuschlag.',
                    'Der Zielverkaufspreis berücksichtigt zusätzlich Rabatte und Skonti.',
                    'Die Vorwärtskalkulation berechnet den Verkaufspreis von den Kosten her.',
                    'Die Rückwärtskalkulation ermittelt die Kosten vom Marktpreis her.'
                ],
                schwer: [
                    'Die differenzierende Zuschlagskalkulation verwendet verschiedene Zuschlagssätze für die einzelnen Kostenbereiche und ermöglicht eine verursachungsgerechte Zuordnung der Gemeinkosten zu den Produkten.',
                    'Der Maschinenstundensatz erfasst alle einer Maschine zurechenbaren Kosten einschließlich Abschreibung, Raumkosten, Energiekosten und Instandhaltung und dividiert diese durch die jährliche Laufzeit.',
                    'Die Rückwärtskalkulation ermittelt bei gegebenem Marktpreis die zulässigen Selbstkosten, indem Rabatte, Skonti, Umsatzsteuer und der Gewinnzuschlag vom Marktpreis abgezogen werden.',
                    'Bei der Kalkulation mit vorbestimmten Zuschlagssätzen werden die Gemeinkostenzuschläge auf Basis von Plankosten ermittelt und während des Jahres konstant gehalten.'
                ]
            },
            5: {
                leicht: [
                    'Break Even Point',
                    'Gewinnschwelle',
                    'Sicherheitskoeffizient',
                    'Stückdeckungsbeitrag',
                    'DB in Prozent',
                    'Gewinnzone',
                    'Verlustzone',
                    'Kostendeckung',
                    'Umsatzrentabilität',
                    'Margenrechnung'
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
                    'Die mehrstufige Deckungsbeitragsrechnung ordnet die fixen Kosten nach ihrer Abbaufähigkeit in verschiedene Fixkostenblöcke und ermöglicht die Beurteilung, welche Produktgruppen welche Fixkostenblöcke decken.',
                    'Die Break-Even-Analyse bei Mehrproduktunternehmen erfordert die Berechnung eines gewichteten durchschnittlichen Deckungsbeitrags, der sich aus den Stück-Deckungsbeiträgen und deren Anteil am geplanten Absatz ergibt.',
                    'Der operative Hebel beschreibt den Zusammenhang zwischen Beschäftigungsänderung und Gewinnänderung und berechnet sich als Quotient aus Deckungsbeitrag und Gewinn.',
                    'Die Nutzenschwelle im Rahmen der linearen Programmierung gibt den minimalen Absatz eines Produkts an, der erreicht werden muss, damit die Produktion überhaupt aufgenommen werden sollte.'
                ]
            },
            6: {
                leicht: [
                    'Plankostenrechnung',
                    'Standardkosten',
                    'Sollkosten',
                    'Istkosten',
                    'Abweichung',
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
                    'Die Beschäftigungsabweichung entsteht durch Abweichung vom Plan.',
                    'Die Verbrauchsabweichung zeigt Über- oder Unterdeckung bei gleicher Beschäftigung.',
                    'Die Budgetkontrolle überwacht die Einhaltung der geplanten Kosten.',
                    'Plankosten dienen der Kostenkontrolle und Kostensteuerung.'
                ],
                schwer: [
                    'Die flexible Plankostenrechnung auf Teilkostenbasis trennt die Abweichungen in eine beschäftigungsbedingte Abweichung und eine Verbrauchsabweichung, wobei die beschäftigungsbedingte Abweichung die nicht genutzte Fixkostenkapazität ausweist.',
                    'Die Analyse der Preis- und Mengenabweichung bei den Materialkosten ermöglicht die Zuordnung der Verantwortung für Abweichungen an die Einkaufs- bzw. Produktionsabteilung.',
                    'Die Plankostenrechnung auf Vollkostenbasis weist zusätzlich zur Beschäftigungs- und Verbrauchsabweichung eine Preisabweichung aus, die aus der Differenz zwischen Plan- und Ist-Einstandspreisen resultiert.',
                    'Die Normkostenrechnung als Weiterentwicklung der Plankostenrechnung verwendet für jede Kostenart getrennte Normen für Preis und Verbrauch und ermöglicht eine detaillierte Analyse der Abweichungsursachen.'
                ]
            },
            7: {
                leicht: [
                    'Prozesskosten',
                    'Prozess definieren',
                    'Kostentreiber',
                    'Prozesskostensatz',
                    'Prozessmenge',
                    'Hauptprozess',
                    'Teilprozess',
                    'Leistungsmenge',
                    'Prozessebene',
                    'Prozessorientierung'
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
                    'Die Prozesskostenrechnung ist besonders bei Dienstleistungen relevant.'
                ],
                schwer: [
                    'Die Prozesskostenrechnung nach Horvath und Mayer gliedert die Gemeinkosten in leistungsmengeninduzierte und leistungsmengenneutrale Kosten und berechnet für jeden Teilprozess einen eigenen Prozesskostensatz.',
                    'Die Bestimmung der Kostentreiber erfordert eine sorgfältige Analyse der Prozesse, da nur Einflussgrößen als Kostentreiber geeignet sind, die einen starken monotonen Zusammenhang mit dem Ressourcenverbrauch aufweisen.',
                    'Die Prozesskostenrechnung ermöglicht eine verursachungsgerechte Verteilung der Gemeinkosten auf die Kostenträger auch bei komplexen indirekten Leistungsbereichen wie Verwaltung und Vertrieb.',
                    'Die Integration der Prozesskostenrechnung in das bestehende Kostenrechnungssystem erfordert die parallele Führung der traditionellen Kostenstellenrechnung und erhöht den Erfassungsaufwand.'
                ]
            },
            8: {
                leicht: [
                    'Investitionsrechnung',
                    'Statisch Dynamisch',
                    'Kapitalwert',
                    'Interner Zins',
                    'Annuität',
                    'Amortisation',
                    'Kostenvergleich',
                    'Gewinnvergleich',
                    'Rentabilität',
                    'Barwert'
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
                    'Die Kapitalwertmethode ermittelt den Barwert aller zukünftigen Ein- und Auszahlungen und zeigt einen positiven Kapitalwert als Mehrwert der Investition gegenüber der Alternativanlage zum Kalkulationszinsfuß.',
                    'Der interne Zinsfuß als Diskontierungszinssatz, bei dem der Kapitalwert null wird, ermöglicht den Vergleich verschiedener Investitionsalternativen, ist jedoch bei nicht-monotonen Zahlungsreihen nicht eindeutig.',
                    'Die Annuitätenmethode transformiert den Kapitalwert in eine gleichbleibende jährliche Zahlung und ermöglicht den Vergleich von Investitionen mit unterschiedlichen Laufzeiten.',
                    'Die dynamische Amortisationsrechnung berücksichtigt den Zeitwert des Geldes und bestimmt den Zeitpunkt, zu dem das eingesetzte Kapital einschließlich Zinsen zurückgewonnen ist.'
                ]
            },
            9: {
                leicht: [
                    'Stückrechnung',
                    'Zeitrechnung',
                    'Divisionskalkulation',
                    'Äquivalenzziffer',
                    'Vorkalkulation',
                    'Nachkalkulation',
                    'Angebotskalkulation',
                    'Sortenproduktion',
                    'Mehrstufig',
                    'Kuppelprodukt'
                ],
                normal: [
                    'Die Stückrechnung ermittelt die Kosten pro Einheit eines Produkts.',
                    'Die Zeitrechnung erfasst die Gesamtkosten einer Periode.',
                    'Die Divisionskalkulation teilt die Gesamtkosten durch die Produktionsmenge.',
                    'Die Äquivalenzziffernkalkulation gewichtet verschiedene Produktarten.',
                    'Die Vorkalkulation plant die Kosten vor der Produktion.',
                    'Die Nachkalkulation ermittelt die tatsächlichen Kosten nach der Produktion.',
                    'Angebotskalkulationen berechnen den Preis für einen Kundenauftrag.',
                    'Bei Sortenproduktion ist die Divisionskalkulation anzuwenden.',
                    'Die mehrstufige Kalkulation berücksichtigt mehrere Produktionsstufen.',
                    'Die Kalkulation ist Grundlage für die Preisbildung.'
                ],
                schwer: [
                    'Die mehrstufige Divisionskalkulation erfasst die Kosten für jede Produktionsstufe separat und ermöglicht die Bestimmung der Herstellkosten für jedes Zwischen- und Endprodukt.',
                    'Die Äquivalenzziffernkalkulation gewichtet die verschiedenen Sorten nach ihrem Kostenverursachungsanteil und ermöglicht die verursachungsgerechte Verteilung der Gemeinkosten.',
                    'Die differenzierende Zuschlagskalkulation verwendet für jeden Kostenbereich separate Zuschlagssätze und berücksichtigt die unterschiedlichen Kostenstrukturen der einzelnen Produktbereiche.',
                    'Die Kalkulation von Kuppelprodukten erfordert die Verteilung der gemeinsamen Produktionskosten auf die Haupt- und Nebenprodukte nach einem angemessenen Verteilungsschlüssel.'
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
                    'KPI',
                    'Target Costing',
                    'Benchmarking',
                    'Controlling'
                ],
                normal: [
                    'Die Balanced Scorecard verknüpft finanzielle und nicht-finanzielle Kennzahlen.',
                    'Sie umfasst vier Perspektiven: Finanzen, Kunden, Prozesse und Entwicklung.',
                    'Kennzahlen messen den Erfolg in den verschiedenen Perspektiven.',
                    'KPIs sind die wichtigsten Leistungsindikatoren eines Unternehmens.',
                    'Target Costing richtet die Kosten am marktgerechten Preis aus.',
                    'Benchmarking vergleicht die eigenen Leistungen mit den Besten der Branche.',
                    'Das Controlling steuert und überwacht die Unternehmensführung.',
                    'Die Balanced Scorecard verbindet Strategie mit operativem Handeln.',
                    'Vorschaurechnungen unterstützen die Unternehmensplanung.',
                    'Die Abweichungsanalyse ist ein zentrales Instrument des Controllings.'
                ],
                schwer: [
                    'Die Balanced Scorecard nach Kaplan und Norton übersetzt die Unternehmensstrategie in ein System von Zielen und Kennzahlen, das die Finanzperspektive mit den vorgelagerten Perspektiven verknüpft.',
                    'Das Target Costing als marktorientiertes Kostenmanagement ermittelt den Zielkostenwert durch Subtraktion des geforderten Gewinns vom marktgerechten Verkaufspreis.',
                    'Die Prozesskostenrechnung als Grundlage des Prozessmanagements identifiziert kostenintensive Prozesse und ermöglicht deren Optimierung durch Standardisierung oder Automatisierung.',
                    'Das strategische Controlling unterstützt die Unternehmensführung bei der langfristigen Planung durch Analyse der Wettbewerbssituation und Beurteilung strategischer Alternativen.'
                ]
            }
        },

        _fachwoerter: {
            buchfuehrung: {
                _leicht: [
                    'Abgabenordnung',
                    'Gewinnermittlung',
                    'AfA',
                    'Teilwertabschreibung',
                    'Rückstellung',
                    'Rechnungsabgrenzungsposten',
                    'Bilanzstichtag',
                    'Entnahme',
                    'Einlage',
                    'Betriebsausgaben',
                    'Betriebseinnahmen',
                    'Sonderbetriebsausgaben',
                    'Nachlassverbindlichkeiten'
                ]
            },
            steuerrecht: {
                _leicht: [
                    'Einkommensteuer',
                    'Körperschaftsteuer',
                    'Gewerbesteuer',
                    'Umsatzsteuer',
                    'Vorsteuerabzug',
                    'Steuerbescheid',
                    'Einspruchsverfahren',
                    'Änderungsbescheid',
                    'Schätzung',
                    'Mitwirkungspflicht',
                    'Außenprüfung',
                    'Steuerpflicht',
                    'unbeschränkte Steuerpflicht',
                    'beschränkte Steuerpflicht'
                ]
            },
            bilanzen: {
                _leicht: [
                    'Veräußerungsgewinn',
                    'verdeckte Gewinnausschüttung',
                    'Sonderausgaben',
                    'außergewöhnliche Belastungen',
                    'Leistungsort',
                    'innergemeinschaftliche Lieferung',
                    'Reverse-Charge-Verfahren',
                    'Unternehmereigenschaft',
                    'Schenkungsteuer',
                    'Bewertung',
                    'Freibetrag',
                    'Festsetzungsfrist',
                    'Ablaufhemmung'
                ]
            },
            klr: {
                _leicht: [
                    'Kostenstelle',
                    'Kostenträger',
                    'Gemeinkosten',
                    'Einzelkosten',
                    'Deckungsbeitrag',
                    'Break-Even-Point',
                    'Maschinenstundensatz',
                    'Prozesskostenrechnung',
                    'Zuschlagskalkulation',
                    'Plankostenrechnung'
                ]
            }
        },

        _satzrhythmus: {
            buchfuehrung: [
                'Der Steuerpflichtige beantragt die Berücksichtigung weiterer Betriebsausgaben.',
                'Fehlerhafte Bilanzansätze sind grundsätzlich zu berichtigen.',
                'Rückstellungen setzen eine wirtschaftliche Verursachung vor dem Bilanzstichtag voraus.'
            ],
            steuerrecht: [
                'Das Finanzamt versagt den Abzug mangels ausreichender Nachweise.',
                'Eine Schätzung ist nur zulässig, wenn die Besteuerungsgrundlagen nicht sicher ermittelt werden können.',
                'Die Schätzung muss schlüssig, wirtschaftlich möglich und verhältnismäßig sein.'
            ],
            bilanzen: [
                'Vorsteuer kann nur aus ordnungsgemäßen Rechnungen abgezogen werden.',
                'Eine verdeckte Gewinnausschüttung mindert das Einkommen der Kapitalgesellschaft nicht.',
                'Persönliche Freibeträge sind von sachlichen Steuerbefreiungen zu unterscheiden.'
            ],
            klr: ['Im Einspruchsverfahren sind Sachverhalt, Beweislast und Mitwirkungspflichten zu würdigen.']
        },

        _pruefungstexte: {
            buchfuehrung: [
                'Zum Bilanzstichtag weist das Unternehmen einen umfangreichen Warenbestand, offene Kundenforderungen, langfristige Darlehensverbindlichkeiten sowie mehrere schwebende Geschäfte aus. Im Rahmen der Jahresabschlusserstellung ist zu untersuchen, welche Vermögensgegenstände zu aktivieren sind, welche Schulden passiviert werden müssen und ob für drohende Verluste aus schwebenden Geschäften Rückstellungen zu bilden sind. Besondere Bedeutung hat die Bewertung des Vorratsvermögens. Es ist zu klären, ob Anschaffungs- oder Herstellungskosten zutreffend ermittelt wurden und ob wegen gesunkener Marktpreise eine Teilwertabschreibung erforderlich ist. Bei Forderungen ist zu prüfen, ob Einzelwertberichtigungen oder Pauschalwertberichtigungen vorzunehmen sind. Außerdem kann sich die Frage stellen, ob für ausstehende Rechnungen, Gewährleistungsverpflichtungen oder Urlaubstage von Arbeitnehmern Rückstellungen anzusetzen sind. Weiterhin ist zwischen aktiven und passiven Rechnungsabgrenzungsposten abzugrenzen. Einnahmen oder Ausgaben vor dem Abschlussstichtag, die Aufwand oder Ertrag für eine bestimmte Zeit nach diesem Tag darstellen, sind periodengerecht abzugrenzen. Ziel der Bilanzierung ist es, ein den tatsächlichen Verhältnissen entsprechendes Bild der Vermögens-, Finanz- und Ertragslage zu vermitteln und zugleich die steuerlichen Bewertungsvorschriften zutreffend umzusetzen.'
            ],
            steuerrecht: [
                'Im Rahmen einer Außenprüfung stellt das Finanzamt fest, dass der Steuerpflichtige in mehreren Veranlagungszeiträumen Bareinnahmen nicht vollständig aufgezeichnet hat. Die Buchführung weist formelle Mängel auf, weil Kassenberichte fehlen und einzelne Belege nicht fortlaufend nummeriert wurden. Außerdem wurden Privatentnahmen unzutreffend als Betriebsausgaben behandelt. Der Prüfer gelangt deshalb zu der Auffassung, dass die Besteuerungsgrundlagen teilweise zu schätzen sind. Der Steuerpflichtige vertritt dagegen die Ansicht, dass die Aufzeichnungen im Wesentlichen ordnungsgemäß seien. Er weist darauf hin, dass sämtliche Zahlungseingänge auf dem Geschäftskonto erfasst worden seien und die fehlenden Belege lediglich geringfügige Einzelbeträge beträfen. Nach seiner Auffassung ist eine vollständige Verwerfung der Buchführung unverhältnismäßig. Er beantragt, nur die unmittelbar betroffenen Geschäftsvorfälle zu korrigieren. Im anschließenden Einspruchsverfahren ist zu prüfen, ob die Voraussetzungen für eine Schätzung tatsächlich vorliegen, ob der Schätzungsrahmen eingehalten wurde und ob der erlassene Änderungsbescheid hinreichend begründet ist. Ferner stellt sich die Frage, ob die Mitwirkungspflichten des Steuerpflichtigen verletzt wurden und ob die Festsetzungsfrist zum Zeitpunkt der Änderung bereits abgelaufen war.',
                'Der Steuerpflichtige erzielt Einkünfte aus nichtselbständiger Arbeit, daneben Einkünfte aus Vermietung und Verpachtung sowie geringe gewerbliche Nebeneinkünfte. Im Streitjahr machte er Aufwendungen für ein häusliches Arbeitszimmer, Fortbildungskosten, Fahrten zwischen Wohnung und erster Tätigkeitsstätte sowie Kosten für doppelte Haushaltsführung geltend. Das Finanzamt erkannte einen Teil der Aufwendungen nicht an und kürzte insbesondere die geltend gemachten Werbungskosten. Zu prüfen ist, ob das Arbeitszimmer den Mittelpunkt der gesamten beruflichen Betätigung bildet oder ob lediglich ein beschränkter Abzug in Betracht kommt. Weiter ist zu untersuchen, ob die Fortbildungskosten beruflich veranlasst sind und ob die Unterkunft am Beschäftigungsort im Rahmen einer doppelten Haushaltsführung steuerlich anzuerkennen ist. Dabei kommt es entscheidend darauf an, ob der Steuerpflichtige außerhalb des Beschäftigungsortes einen eigenen Hausstand unterhält und sich finanziell an dessen Kosten beteiligt. Darüber hinaus sind Sonderausgaben und außergewöhnliche Belastungen abzugrenzen. Beiträge zur Altersvorsorge, Krankenversicherungsbeiträge und Spenden können unterschiedlich zu berücksichtigen sein. Im Ergebnis ist der Gesamtbetrag der Einkünfte zu ermitteln, von dem Sonderausgaben, außergewöhnliche Belastungen und sonstige abzugsfähige Beträge abzusetzen sind, um das zu versteuernde Einkommen zutreffend festzustellen.',
                'Ein Einzelunternehmer liefert Maschinen an Kunden im Inland, in andere Mitgliedstaaten der Europäischen Union und in Drittländer. Zusätzlich erbringt er Wartungsleistungen, Schulungen und elektronische Dienstleistungen. Im Besteuerungszeitraum ist zu klären, welche Umsätze steuerbar und steuerpflichtig sind, in welchem Staat der Leistungsort liegt und unter welchen Voraussetzungen Steuerbefreiungen eingreifen. Bei innergemeinschaftlichen Lieferungen kommt es insbesondere darauf an, ob der Unternehmer die Voraussetzungen des Buch- und Belegnachweises erfüllt hat. Fehlen Gelangensbestätigungen oder andere geeignete Nachweise, kann die Steuerbefreiung versagt werden. Bei sonstigen Leistungen an Unternehmer ist zu prüfen, ob das Reverse-Charge-Verfahren zur Anwendung kommt. Bei Leistungen an Privatpersonen sind dagegen gesonderte Ortsvorschriften zu beachten. Außerdem machte der Unternehmer Vorsteuer aus Eingangsrechnungen geltend, die teilweise unvollständige Leistungsbeschreibungen enthalten. Deshalb ist zu prüfen, ob die Rechnungen die formellen Anforderungen erfüllen und ob ein Vorsteuerabzug bereits im Besteuerungszeitraum oder erst nach Berichtigung der Rechnung möglich ist. Schließlich stellt sich die Frage, ob unentgeltliche Wertabgaben vorliegen, weil der Unternehmer einzelne Gegenstände auch privat verwendet hat.'
            ],
            bilanzen: [
                'Die A-GmbH betreibt einen Großhandel mit technischen Bauteilen. Im Wirtschaftsjahr verbuchte sie eine Zahlung an den alleinigen Gesellschafter-Geschäftsführer als Beratungsaufwand. Im Rahmen der Veranlagung ist fraglich, ob das vereinbarte Honorar dem Fremdvergleich standhält oder ob teilweise eine verdeckte Gewinnausschüttung vorliegt. Maßgeblich ist, ob ein ordentlicher und gewissenhafter Geschäftsleiter einem fremden Dritten unter vergleichbaren Umständen dieselbe Vergütung gewährt hätte. Wird eine verdeckte Gewinnausschüttung angenommen, ist der entsprechende Aufwand außerbilanziell dem Einkommen der Gesellschaft wieder hinzuzurechnen. Gleichzeitig stellt sich auf Ebene des Gesellschafters die Frage nach der einkommensteuerlichen Behandlung des Vorteils. Daneben ist für Zwecke der Gewerbesteuer zu prüfen, ob weitere Hinzurechnungen oder Kürzungen vorzunehmen sind und welcher Gewerbeertrag sich danach ergibt. Ferner hat die Gesellschaft im selben Jahr einen Investitionszuschuss erhalten und eine Forderung wertberichtigt. Hier ist zu untersuchen, ob der Zuschuss erfolgswirksam zu erfassen ist, ob eine Steuerbefreiung eingreift und ob die Wertberichtigung handels- und steuerrechtlich anzuerkennen ist. Abschließend sind das zu versteuernde Einkommen, die festzusetzende Körperschaftsteuer und der maßgebliche Gewerbesteuermessbetrag zu ermitteln.',
                'Der Erblasser hinterlässt seiner Tochter ein vermietetes Mehrfamilienhaus, Bankguthaben und Anteile an einer Familiengesellschaft. Dem Sohn wurde bereits fünf Jahre vor dem Erbfall eine größere Geldschenkung zugewandt. Im Besteuerungsverfahren ist zunächst der steuerpflichtige Erwerb zu ermitteln. Dabei sind das übergegangene Vermögen, abzugsfähige Nachlassverbindlichkeiten und anrechenbare Vorerwerbe zu berücksichtigen. Für das Grundstück ist der maßgebliche Grundbesitzwert nach den Bewertungsvorschriften festzustellen. Bei den Gesellschaftsanteilen stellt sich die Frage, ob begünstigtes Betriebsvermögen vorliegt und ob Verschonungsregelungen in Anspruch genommen werden können. Weiter ist zu prüfen, ob persönliche Freibeträge, Versorgungsfreibeträge oder besondere Steuerbefreiungen anzuwenden sind. Entscheidend ist außerdem, in welchem Umfang frühere Schenkungen mit dem aktuellen Erwerb zusammenzurechnen sind. Nur auf dieser Grundlage lässt sich die zutreffende Steuerklasse, der anwendbare Steuersatz und die festzusetzende Erbschaftsteuer ermitteln. In Klausuren ist regelmäßig besonders darauf zu achten, dass Bewertungsfragen und persönliche Steuervergünstigungen getrennt geprüft und sauber begründet werden.'
            ],
            klr: [
                'Die B-KG erzielte im Streitjahr gewerbliche Einkünfte und veräußerte zugleich ein betrieblich genutztes Grundstück. Im Rahmen einer Außenprüfung beanstandete das Finanzamt die Gewinnermittlung, weil Abschreibungen unzutreffend berechnet, Rückstellungen ohne hinreichende Wahrscheinlichkeit gebildet und private Aufwendungen des Kommanditisten als Betriebsausgaben verbucht worden waren. Zusätzlich wurden Ausgangsrechnungen ohne Umsatzsteuerausweis erstellt, obwohl steuerpflichtige Leistungen im Inland vorlagen. Im Einspruchsverfahren macht die Gesellschaft geltend, dass die Bilanzansätze handelsrechtlich vertretbar seien und jedenfalls kein grobes Verschulden vorliege. Hilfsweise beantragt sie, den Gewinn durch Bilanzberichtigung und Bilanzänderung neu zu ermitteln. Das Finanzamt hält dem entgegen, dass die materiellen Fehler zu einer Gewinnerhöhung führen, dass Vorsteuerbeträge teilweise mangels ordnungsgemäßer Rechnungen nicht abzugsfähig sind und dass die Festsetzungsfrist wegen Ablaufhemmung noch nicht abgelaufen sei. Darüber hinaus ist zu untersuchen, ob der Veräußerungsgewinn tarifbegünstigt ist, ob Sonderbetriebsausgaben des Kommanditisten zu berücksichtigen sind und ob sich gewerbesteuerliche Hinzurechnungen ergeben. Die Fallbearbeitung verlangt deshalb eine saubere Trennung zwischen Ertragsteuerrecht, Umsatzsteuerrecht, Bilanzsteuerrecht und Verfahrensrecht sowie eine präzise Begründung jedes einzelnen Prüfungsschrittes.'
            ]
        }
    };

    function apply() {
        // Haupttexte (leicht/normal/schwer pro Level) ueber die oeffentliche API
        for (const [topic, levels] of Object.entries(extras)) {
            if (topic.startsWith('_')) continue;
            for (const [levelStr, diffs] of Object.entries(levels)) {
                if (levelStr.startsWith('_')) continue;
                const level = parseInt(levelStr);
                for (const [diff, newTexts] of Object.entries(diffs)) {
                    if (Texts.hasTexts(topic, level, diff)) {
                        Texts.addTexts(topic, level, diff, newTexts);
                    }
                }
            }
        }

        // Fachwoerter auf leicht-Stufen verteilen (Round-Robin ueber 10 Level)
        const fachMap = extras._fachwoerter;
        for (const [topic, data] of Object.entries(fachMap)) {
            const words = data._leicht;
            for (let i = 0; i < words.length; i++) {
                const targetLevel = (i % 10) + 1;
                if (Texts.hasTexts(topic, targetLevel, 'leicht')) {
                    Texts.addTexts(topic, targetLevel, 'leicht', [words[i]]);
                }
            }
        }

        // Satzrhythmus auf normal-Stufen verteilen
        const satzMap = extras._satzrhythmus;
        for (const [topic, sentences] of Object.entries(satzMap)) {
            for (let i = 0; i < sentences.length; i++) {
                const targetLevel = (i % 10) + 1;
                if (Texts.hasTexts(topic, targetLevel, 'normal')) {
                    Texts.addTexts(topic, targetLevel, 'normal', [sentences[i]]);
                }
            }
        }

        // Pruefungstexte auf schwer-Stufen verteilen (Level 3-10, gerader Takt)
        const pruefMap = extras._pruefungstexte;
        for (const [topic, prTexts] of Object.entries(pruefMap)) {
            for (let i = 0; i < prTexts.length; i++) {
                const targetLevel = Math.min(i * 2 + 3, 10);
                if (Texts.hasTexts(topic, targetLevel, 'schwer')) {
                    Texts.addTexts(topic, targetLevel, 'schwer', [prTexts[i]]);
                }
            }
        }
    }

    return { apply };
})();
