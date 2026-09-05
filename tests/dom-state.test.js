import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clone, createDomContext, loadScript } from './helpers/browser-context.js';

describe('Dom-Helfer', () => {
    it('escaped alle HTML-relevanten Zeichen', () => {
        const { context } = createDomContext();
        const Dom = loadScript(context, 'js/core/dom.js', 'Dom');
        assert.equal(Dom.escapeHtml(`<>&"'`), '&lt;&gt;&amp;&quot;&#039;');
        assert.equal(Dom.escapeHtml(null), '');
    });

    it('formatiert Zeitwerte stabil', () => {
        const { context } = createDomContext();
        const Dom = loadScript(context, 'js/core/dom.js', 'Dom');
        assert.equal(Dom.formatTime(0), '0:00');
        assert.equal(Dom.formatTime(65.9), '1:05');
        assert.equal(Dom.formatTime(3601), '60:01');
    });

    it('klassifiziert Accuracy- und WPM-Grenzen', () => {
        const { context } = createDomContext();
        const Dom = loadScript(context, 'js/core/dom.js', 'Dom');
        assert.deepEqual([84, 85, 94, 95].map(Dom.classifyAccuracy), ['bad', 'warn', 'warn', 'good']);
        assert.deepEqual([34, 35, 59, 60].map(Dom.classifyWpm), ['bad', 'warn', 'warn', 'good']);
    });

    it('rendert Toast-Inhalte ohne HTML-Injection', () => {
        const { context } = createDomContext('<div id="toastContainer"></div>');
        context.setTimeout = () => 1;
        const Dom = loadScript(context, 'js/core/dom.js', 'Dom');
        Dom.showToast('<img>', '<b>Titel</b>', '<script>alert(1)</script>');
        const container = context.document.getElementById('toastContainer');
        assert.equal(container.querySelectorAll('img, b, script').length, 0);
        assert.match(container.textContent, /<script>alert\(1\)<\/script>/);
    });

    it('findet Elemente und Teilmengen', () => {
        const { context } = createDomContext(
            '<main id="main"><span class="x"></span><span class="x"></span></main>'
        );
        const Dom = loadScript(context, 'js/core/dom.js', 'Dom');
        assert.equal(Dom.byId('main').tagName, 'MAIN');
        assert.equal(Dom.all('.x').length, 2);
        assert.equal(Dom.all('.x', Dom.byId('main')).length, 2);
    });
});

describe('State', () => {
    it('besitzt nachvollziehbare Defaults', () => {
        const { context } = createDomContext();
        const State = loadScript(context, 'js/core/state.js', 'State');
        assert.equal(State.view, 'dashboard');
        assert.equal(State.topic, null);
        assert.equal(State.level, null);
        assert.equal(State.difficulty, 'normal');
    });

    it('speichert Setter-Werte und setzt nur Übungsstate zurück', () => {
        const { context } = createDomContext();
        const State = loadScript(context, 'js/core/state.js', 'State');
        State.view = 'calendar';
        State.calYear = 2026;
        State.calMonth = 6;
        State.topic = 'steuerrecht';
        State.level = 4;
        State.difficulty = 'schwer';
        State.lastText = 'Text';
        State.resetExerciseState();
        assert.deepEqual(
            clone({
                view: State.view,
                calYear: State.calYear,
                calMonth: State.calMonth,
                topic: State.topic,
                level: State.level,
                difficulty: State.difficulty,
                lastText: State.lastText
            }),
            {
                view: 'calendar',
                calYear: 2026,
                calMonth: 6,
                topic: null,
                level: null,
                difficulty: 'normal',
                lastText: null
            }
        );
    });
});
