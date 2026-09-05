import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createDomContext, loadScripts, projectRoot } from './helpers/browser-context.js';

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

        context.document.querySelector('.nav-item[data-view="settings"]').click();
        assert.equal(sidebar.inert, true);
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(context.document.activeElement, toggle);
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
