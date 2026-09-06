import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
    createDomContext,
    inRealm,
    loadScripts,
    projectRoot,
    sampleSession
} from './helpers/browser-context.js';

const SCRIPT_ORDER = [
    ['js/core/state.js', 'State'],
    ['js/core/dom.js', 'Dom'],
    ['js/engine/storage.js', 'Storage'],
    ['js/engine/typing.js', 'Typing'],
    ['data/texts.js', 'Texts'],
    ['data/texts-extra.js', 'TextsExtra'],
    ['data/texts-sehrSchwer.js', 'TextsSehrSchwer'],
    ['js/services/levels.js', 'Levels'],
    ['js/services/calendar.js', 'Calendar'],
    ['js/services/progress.js', 'Progress'],
    ['js/services/achievements.js', 'Achievements'],
    ['js/services/recommendation.js', 'Recommendation'],
    ['js/services/session-completion.js', 'SessionCompletion'],
    ['js/core/router.js', 'Router'],
    ['js/views/chrome.js', 'ChromeView'],
    ['js/views/dashboard.js', 'DashboardView'],
    ['js/views/levels.js', 'LevelsView'],
    ['js/views/typing.js', 'TypingView'],
    ['js/views/result.js', 'ResultView'],
    ['js/views/calendar.js', 'CalendarView'],
    ['js/views/achievements.js', 'AchievementsView'],
    ['js/views/progress.js', 'ProgressView'],
    ['js/views/settings.js', 'SettingsView'],
    ['js/app.js', 'App']
];

describe('App Browser-Integration', () => {
    let context;
    let dom;

    beforeEach(() => {
        const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
        ({ context, dom } = createDomContext(html, { now: Date.parse('2026-06-15T10:00:00.000Z') }));
        context.confirm = () => true;
        context.URL.createObjectURL = () => 'blob:test';
        context.URL.revokeObjectURL = () => {};
        loadScripts(context, SCRIPT_ORDER);
        context.App.init();
    });

    afterEach(() => {
        context.Typing.stop();
        dom.window.close();
    });

    it('bootet in die Dashboard-Ansicht mit vollständigem Korpus', () => {
        assert.equal(context.document.querySelector('#view-dashboard').classList.contains('active'), true);
        assert.equal(
            context.document.querySelector('.nav-item[aria-current="page"]').dataset.view,
            'dashboard'
        );
        assert.equal(context.document.querySelectorAll('.topic-card').length, 4);
        assert.ok(context.Texts.getTotalTextCount() >= 1900);
        assert.match(context.document.querySelector('#dashboardCountdown').textContent, /festlegen/);
    });

    it('navigiert mit nativen Buttons und aktualisiert aria-current', () => {
        const calendarButton = context.document.querySelector('.nav-item[data-view="calendar"]');
        assert.equal(calendarButton.tagName, 'BUTTON');
        calendarButton.click();
        assert.equal(context.document.querySelector('#view-calendar').classList.contains('active'), true);
        assert.equal(calendarButton.getAttribute('aria-current'), 'page');
        assert.equal(context.document.querySelectorAll('.nav-item[aria-current="page"]').length, 1);
    });

    for (const [viewName, renderedSelector] of [
        ['dashboard', '#dashboardTopics .topic-card'],
        ['levels', '#levelsGrid .level-btn'],
        ['calendar', '#calendarDays .calendar-day'],
        ['achievements', '#achievementsGrid .achievement-card'],
        ['progress', '#wpmChart .bar'],
        ['settings', '#daysUntilLabel:not(:empty)']
    ]) {
        it(`rendert und aktiviert die Ansicht ${viewName} exklusiv`, () => {
            context.State.topic = 'buchfuehrung';
            context.State.level = 1;
            context.Texts.getRandomText = () => 'abc';
            context.TypingView.start();
            if (viewName === 'progress') {
                context.Progress.addSession(inRealm(context, sampleSession()));
            }

            context.document.querySelector(`.nav-item[data-view="${viewName}"]`).click();

            assert.equal(context.document.querySelectorAll('.view.active').length, 1);
            assert.equal(
                context.document.querySelector(`#view-${viewName}`).classList.contains('active'),
                true
            );
            assert.equal(context.document.querySelectorAll('.nav-item[aria-current="page"]').length, 1);
            assert.equal(
                context.document.querySelector('.nav-item[aria-current="page"]').dataset.view,
                viewName
            );
            assert.ok(context.document.querySelector(renderedSelector));
            assert.equal(context.Typing.getState().isActive, false);
        });
    }

    it('durchläuft Levelauswahl, Mehrzeicheneingabe und Ergebnisdialog', () => {
        context.document.querySelector('.topic-card[data-topic="buchfuehrung"]').click();
        assert.equal(context.document.querySelector('#view-levels').classList.contains('active'), true);
        assert.equal(context.document.querySelector('.level-btn:not([disabled])').tagName, 'BUTTON');

        context.Texts.getRandomText = () => 'A😀§';
        context.document.querySelector('.level-btn:not([disabled])').click();
        const input = context.document.querySelector('#typingInput');
        input.value = 'A😀§';
        input.dispatchEvent(new context.Event('input', { bubbles: true }));

        assert.equal(context.Typing.getFinalStats().totalChars, 3);
        assert.equal(context.Typing.getFinalStats().accuracy, 100);
        assert.equal(context.document.querySelector('#resultOverlay').classList.contains('visible'), true);
        assert.equal(context.document.activeElement.id, 'resultCard');
        assert.equal(context.document.querySelector('.app-container').inert, true);

        const resultButtons = [...context.document.querySelectorAll('#resultOverlay button')];
        resultButtons.at(-1).focus();
        resultButtons
            .at(-1)
            .dispatchEvent(new context.KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        assert.equal(context.document.activeElement, resultButtons[0]);
        resultButtons[0].dispatchEvent(
            new context.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
        );
        assert.equal(context.document.activeElement, resultButtons.at(-1));
        context.document.querySelector('#resultCard').focus();
        context.document
            .querySelector('#resultCard')
            .dispatchEvent(
                new context.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
            );
        assert.equal(context.document.activeElement, resultButtons.at(-1));
        resultButtons
            .at(-1)
            .dispatchEvent(new context.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        assert.equal(context.document.querySelector('#resultOverlay').classList.contains('visible'), false);
        assert.equal(context.document.querySelector('.app-container').inert, false);
        assert.equal(context.document.querySelector('#view-levels').classList.contains('active'), true);
        assert.equal(context.document.activeElement.id, 'view-levels');
        assert.equal(context.Progress.getAllSessions().length, 1);
    });

    it('bedient Wiederholen, Überspringen, Backspace, Paste-Schutz und Escape in der Tippansicht', () => {
        context.State.topic = 'buchfuehrung';
        context.State.level = 1;
        const texts = ['abc', 'xyz'];
        let requested = 0;
        context.Texts.getRandomText = () => texts[requested++];

        context.TypingView.start();
        const input = context.document.querySelector('#typingInput');
        input.value = 'a';
        input.dispatchEvent(new context.Event('input', { bubbles: true }));
        assert.equal(context.Typing.getState().typedCount, 1);

        const backspace = new context.KeyboardEvent('keydown', {
            key: 'Backspace',
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(backspace);
        assert.equal(backspace.defaultPrevented, true);
        assert.equal(context.Typing.getState().typedCount, 0);

        const paste = new context.Event('paste', { bubbles: true, cancelable: true });
        input.dispatchEvent(paste);
        assert.equal(paste.defaultPrevented, true);

        input.blur();
        context.document.querySelector('.typing-text-display').click();
        assert.equal(context.document.activeElement, input);

        context.document.querySelector('#btnRestart').click();
        assert.equal(context.State.lastText, 'abc');
        assert.equal(requested, 1);
        context.document.querySelector('#btnSkip').click();
        assert.equal(context.State.lastText, 'xyz');
        assert.equal(requested, 2);

        context.document.querySelector('#typingBack').click();
        assert.equal(context.Typing.getState().isFinished, true);
        assert.equal(context.document.querySelector('#view-levels').classList.contains('active'), true);

        context.TypingView.start(true);
        input.dispatchEvent(new context.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        assert.equal(context.Typing.getState().isFinished, true);
        assert.equal(context.document.querySelector('#view-levels').classList.contains('active'), true);
    });

    it('stoppt eine aktive Tippübung bei Sidebar-Navigation', () => {
        context.State.topic = 'buchfuehrung';
        context.State.level = 1;
        context.State.difficulty = 'normal';
        context.Texts.getRandomText = () => 'abc';
        context.TypingView.start();
        context.Typing.handleInput('a');
        assert.equal(context.Typing.getState().isActive, true);

        context.document.querySelector('.nav-item[data-view="dashboard"]').click();
        assert.equal(context.Typing.getState().isActive, false);
        assert.equal(context.Typing.getState().isFinished, true);
    });

    it('setzt und leert den Prüfungstermin mit synchronen Anzeigen', () => {
        const input = context.document.querySelector('#targetDateInput');
        input.value = '2026-06-20';
        input.dispatchEvent(new context.Event('change', { bubbles: true }));
        assert.equal(context.Storage.getSettings().targetDate, '2026-06-20');
        assert.equal(context.document.querySelector('#sidebarCountdown').textContent, '5');
        assert.match(context.document.querySelector('#daysUntilLabel').textContent, /Noch 5 Tage/);

        input.value = '';
        input.dispatchEvent(new context.Event('change', { bubbles: true }));
        assert.equal(context.Storage.getSettings().targetDate, '');
        assert.equal(context.document.querySelector('#sidebarCountdown').textContent, '–');
        assert.match(context.document.querySelector('#daysUntilLabel').textContent, /Noch kein/);
    });

    it('aktualisiert alle Terminanzeigen nach dem Komplett-Reset', () => {
        const input = context.document.querySelector('#targetDateInput');
        input.value = '2026-06-20';
        input.dispatchEvent(new context.Event('change', { bubbles: true }));

        context.document.querySelector('#btnResetAll').click();

        assert.equal(input.value, '');
        assert.equal(context.document.querySelector('#sidebarCountdown').textContent, '–');
        assert.match(context.document.querySelector('#daysUntilLabel').textContent, /Noch kein/);
        assert.match(context.document.querySelector('#dashboardCountdown').textContent, /festlegen/);
    });

    it('nimmt die geschlossene mobile Navigation aus der Tab-Reihenfolge', () => {
        Object.defineProperty(context, 'innerWidth', { configurable: true, value: 480 });
        context.window.matchMedia = () => ({ matches: true });
        context.Router.syncMobileSidebar();
        const sidebar = context.document.querySelector('#sidebar');
        const toggle = context.document.querySelector('#mobileToggle');

        assert.equal(sidebar.inert, true);
        assert.equal(sidebar.getAttribute('aria-hidden'), 'true');
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');

        toggle.click();
        assert.equal(sidebar.inert, false);
        assert.equal(sidebar.getAttribute('aria-hidden'), 'false');
        assert.equal(toggle.getAttribute('aria-expanded'), 'true');
        assert.equal(context.document.querySelector('.main-content').inert, true);
        assert.equal(context.document.activeElement, sidebar.querySelector('.nav-item.active'));

        context.document.querySelector('.nav-item[data-view="settings"]').click();
        assert.equal(sidebar.inert, true);
        assert.equal(context.document.querySelector('.main-content').inert, false);
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(context.document.activeElement, toggle);
    });

    it('schließt den mobilen Drawer über Escape und den Backdrop', () => {
        Object.defineProperty(context, 'innerWidth', { configurable: true, value: 480 });
        context.window.matchMedia = () => ({ matches: true });
        const sidebar = context.document.querySelector('#sidebar');
        const toggle = context.document.querySelector('#mobileToggle');
        const backdrop = context.document.querySelector('#sidebarBackdrop');

        toggle.click();
        assert.equal(backdrop.classList.contains('visible'), true);
        context.document.dispatchEvent(
            new context.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
        );
        assert.equal(sidebar.classList.contains('open'), false);
        assert.equal(context.document.activeElement, toggle);

        toggle.click();
        backdrop.click();
        assert.equal(sidebar.classList.contains('open'), false);
        assert.equal(backdrop.getAttribute('aria-hidden'), 'true');
    });

    it('bietet Diagrammdaten mit genau einem Tastatureinstieg pro Diagramm an', () => {
        context.Progress.addSession(inRealm(context, sampleSession()));
        context.Progress.addSession(inRealm(context, sampleSession({ id: 'session-2', wpm: 55 })));
        context.document.querySelector('.nav-item[data-view="progress"]').click();

        for (const chartId of ['wpmChart', 'accuracyChart']) {
            const chart = context.document.getElementById(chartId);
            const bars = [...chart.querySelectorAll('.bar')];
            assert.equal(chart.getAttribute('role'), 'list');
            assert.ok(chart.getAttribute('aria-label'));
            assert.equal(bars[0].getAttribute('role'), 'listitem');
            assert.equal(chart.querySelectorAll('.bar[tabindex="0"]').length, 1);
            assert.equal(bars[1].tabIndex, -1);
            assert.ok(bars[0].getAttribute('aria-label'));

            bars[0].focus();
            bars[0].dispatchEvent(
                new context.KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true,
                    cancelable: true
                })
            );
            assert.equal(context.document.activeElement, bars[1]);
            assert.equal(bars[0].tabIndex, -1);
            assert.equal(bars[1].tabIndex, 0);
        }
    });

    it('skaliert das WPM-Diagramm ausschließlich anhand der sichtbaren 30 Übungen', () => {
        const sessions = [
            sampleSession({ id: 'old-outlier', wpm: 400 }),
            ...Array.from({ length: 29 }, (_, index) => sampleSession({ id: `current-${index}`, wpm: 40 })),
            sampleSession({ id: 'current-max', wpm: 50 })
        ];
        context.Storage.saveProgress(inRealm(context, sessions));
        context.document.querySelector('.nav-item[data-view="progress"]').click();

        const bars = context.document.querySelectorAll('#wpmChart .bar');
        assert.equal(bars.length, 30);
        assert.equal(bars[0].style.getPropertyValue('--bar-height'), '80%');
        assert.equal(bars[29].style.getPropertyValue('--bar-height'), '100%');
    });

    it('verwendet im leeren Diagramm einen gültigen Status statt einer leeren Liste', () => {
        context.document.querySelector('.nav-item[data-view="progress"]').click();
        for (const chartId of ['wpmChart', 'accuracyChart']) {
            const chart = context.document.getElementById(chartId);
            assert.equal(chart.getAttribute('role'), 'status');
            assert.equal(chart.hasAttribute('aria-label'), false);
            assert.equal(chart.querySelectorAll('[role="listitem"]').length, 0);
        }
    });

    it('verknüpft den Ergebnisdialog mit einer vorhandenen Überschrift', () => {
        context.State.topic = 'buchfuehrung';
        context.State.level = 1;
        context.Texts.getRandomText = () => 'a';
        context.TypingView.start();
        const input = context.document.querySelector('#typingInput');
        input.value = 'a';
        input.dispatchEvent(new context.Event('input', { bubbles: true }));

        const overlay = context.document.querySelector('#resultOverlay');
        const title = context.document.getElementById(overlay.getAttribute('aria-labelledby'));
        assert.equal(title.tagName, 'H2');
        assert.ok(title.textContent.trim());
    });

    it('zeigt einen Speicherausfall im Ergebnisdialog statt als verdeckenden Toast', () => {
        context.State.topic = 'buchfuehrung';
        context.State.level = 1;
        context.ResultView.show(
            inRealm(context, sampleSession()),
            inRealm(context, {
                passed: true,
                xpEarned: 10,
                newAchievements: [],
                recommendation: null,
                persisted: false
            })
        );

        const warning = context.document.querySelector('#resultCard .result-warning[role="alert"]');
        assert.match(warning.textContent, /Speichern fehlgeschlagen/);
        assert.equal(context.document.querySelectorAll('#toastContainer .toast').length, 0);
    });

    it('bildet Kalendertage als Liste ab und blendet Platzhalter semantisch aus', () => {
        context.document.querySelector('.nav-item[data-view="calendar"]').click();
        const calendar = context.document.getElementById('calendarDays');
        const days = [...calendar.querySelectorAll('.calendar-day:not(.empty)')];
        const placeholders = [...calendar.querySelectorAll('.calendar-day.empty')];

        assert.equal(calendar.getAttribute('role'), 'list');
        assert.ok(days.length >= 28);
        assert.equal(
            days.every((day) => day.getAttribute('role') === 'listitem'),
            true
        );
        assert.equal(
            placeholders.every((placeholder) => placeholder.getAttribute('aria-hidden') === 'true'),
            true
        );
        assert.equal(calendar.querySelectorAll('[role="gridcell"]').length, 0);
    });

    it('zeigt die exakten Übungsminuten direkt im zugehörigen Kalendertag', () => {
        context.Calendar.recordPractice(12 * 60);
        context.CalendarView.render();

        const today = context.document.querySelector('.calendar-day.today');
        assert.equal(today.querySelector('.calendar-day-minutes').textContent, '12m');
        assert.match(today.getAttribute('aria-label'), /12 Minuten geübt/);
    });

    it('navigiert im Kalender korrekt über Jahresgrenzen', () => {
        context.State.calYear = 2026;
        context.State.calMonth = 1;
        context.CalendarView.render();

        context.document.getElementById('calPrev').click();
        assert.equal(context.State.calYear, 2025);
        assert.equal(context.State.calMonth, 12);
        assert.equal(context.document.getElementById('calTitle').textContent, 'Dezember 2025');

        context.document.getElementById('calNext').click();
        assert.equal(context.State.calYear, 2026);
        assert.equal(context.State.calMonth, 1);
        assert.equal(context.document.getElementById('calTitle').textContent, 'Januar 2026');
    });

    it('verdrahtet sämtliche Ergebnisaktionen mit dem erwarteten nächsten Schritt', () => {
        const starts = [];
        context.TypingView.start = (reuseText) => starts.push(reuseText);
        const stats = inRealm(context, sampleSession());
        const completion = {
            passed: true,
            xpEarned: 10,
            newAchievements: [],
            recommendation: null,
            persisted: true
        };

        context.ResultView.show(stats, inRealm(context, completion));
        context.document.getElementById('resultRetry').click();
        context.ResultView.show(stats, inRealm(context, completion));
        context.document.getElementById('resultNext').click();
        assert.deepEqual(starts, [true, false]);

        context.State.level = 1;
        context.State.lastText = 'alt';
        context.ResultView.show(stats, inRealm(context, completion));
        context.document.getElementById('resultNextLevel').click();
        assert.equal(context.State.level, 2);
        assert.equal(context.State.lastText, null);
        assert.equal(starts.at(-1), false);

        context.State.difficulty = 'normal';
        context.State.lastText = 'alt';
        context.ResultView.show(
            stats,
            inRealm(context, {
                ...completion,
                recommendation: {
                    nextDiff: 'schwer',
                    nextName: 'Schwer',
                    reason: 'Die Zielwerte sind stabil erreicht.'
                }
            })
        );
        context.document.getElementById('resultHarder').click();
        assert.equal(context.State.difficulty, 'schwer');
        assert.equal(context.State.lastText, null);
        assert.equal(starts.at(-1), false);
        assert.equal(context.document.getElementById('resultOverlay').classList.contains('visible'), false);

        context.ResultView.show(stats, inRealm(context, completion));
        context.document.getElementById('resultBack').click();
        assert.equal(context.document.querySelector('#view-levels').classList.contains('active'), true);
        assert.equal(context.document.activeElement.id, 'view-levels');
    });

    it('exportiert ein datiertes JSON-Backup und räumt die Objekt-URL auf', () => {
        let downloaded;
        let exportedBlob;
        let revokedUrl;
        context.URL.createObjectURL = (blob) => {
            exportedBlob = blob;
            return 'blob:export-test';
        };
        context.URL.revokeObjectURL = (url) => {
            revokedUrl = url;
        };
        context.HTMLAnchorElement.prototype.click = function click() {
            downloaded = { href: this.href, filename: this.download };
        };

        context.document.getElementById('btnExport').click();

        assert.equal(exportedBlob.type, 'application/json');
        assert.ok(exportedBlob.size > 0);
        assert.deepEqual(downloaded, {
            href: 'blob:export-test',
            filename: 'tipptrainer-backup-2026-06-15.json'
        });
        assert.equal(revokedUrl, 'blob:export-test');
        assert.match(context.document.querySelector('#toastContainer .toast-title').textContent, /Export/);
    });

    it('öffnet den Importdialog und verarbeitet gültige, zu große sowie defekte Backups', () => {
        const input = context.document.getElementById('importFile');
        let pickerOpened = false;
        input.click = () => {
            pickerOpened = true;
        };
        context.document.getElementById('btnImport').click();
        assert.equal(pickerOpened, true);

        context.FileReader = class FileReaderStub {
            readAsText(file) {
                this.onload({ target: { result: file.contents } });
            }
        };
        const backup = context.Storage.exportAll();
        backup.settings.targetDate = '2026-12-24';

        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [{ size: 1024, contents: JSON.stringify(backup) }]
        });
        input.dispatchEvent(new context.Event('change', { bubbles: true }));
        assert.equal(context.Storage.getSettings().targetDate, '2026-12-24');
        assert.match(context.document.querySelector('#toastContainer .toast-title').textContent, /Import/);

        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [{ size: 10 * 1024 * 1024 + 1, contents: '{}' }]
        });
        input.dispatchEvent(new context.Event('change', { bubbles: true }));
        assert.match(
            [...context.document.querySelectorAll('#toastContainer .toast-text')].at(-1).textContent,
            /größer/
        );

        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [{ size: 20, contents: '{defekt' }]
        });
        input.dispatchEvent(new context.Event('change', { bubbles: true }));
        assert.match(
            [...context.document.querySelectorAll('#toastContainer .toast-text')].at(-1).textContent,
            /nicht gelesen/
        );
    });
});

describe('Statische Web-App-Integrität', () => {
    it('referenziert ausschließlich vorhandene lokale Scripts und Styles', () => {
        const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
        const { context, dom } = createDomContext(html);
        for (const element of context.document.querySelectorAll('script[src], link[rel="stylesheet"]')) {
            const relativePath = element.getAttribute('src') || element.getAttribute('href');
            assert.equal(fs.existsSync(path.join(projectRoot, relativePath)), true, relativePath);
        }
        dom.window.close();
    });

    it('enthält keine doppelten IDs und besitzt eine restriktive CSP', () => {
        const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
        const { context, dom } = createDomContext(html);
        const ids = [...context.document.querySelectorAll('[id]')].map(({ id }) => id);
        assert.equal(new Set(ids).size, ids.length);
        const csp = context.document.querySelector('meta[http-equiv="Content-Security-Policy"]').content;
        assert.match(csp, /default-src 'self'/);
        assert.match(csp, /connect-src 'none'/);
        assert.match(csp, /object-src 'none'/);
        assert.equal(context.document.querySelector('#targetDateInput').labels.length, 1);
        assert.equal(context.document.querySelector('#toastContainer').getAttribute('aria-live'), 'polite');
        assert.equal(
            context.document.querySelector('#mobileToggle').getAttribute('aria-controls'),
            'sidebar'
        );
        assert.ok(context.document.querySelector('#calPrev').getAttribute('aria-label'));
        assert.ok(context.document.querySelector('#calNext').getAttribute('aria-label'));
        dom.window.close();
    });
});
