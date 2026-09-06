import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createDomContext, projectRoot } from './helpers/browser-context.js';

const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const cssFiles = fs
    .readdirSync(path.join(projectRoot, 'css'), { recursive: true })
    .filter((file) => file.endsWith('.css'));
const css = cssFiles.map((file) => fs.readFileSync(path.join(projectRoot, 'css', file), 'utf8')).join('\n');

describe('DOM-Vertrag des Redesigns', () => {
    it('stellt alle von JavaScript statisch erwarteten Elemente genau einmal bereit', () => {
        const scriptFiles = [
            ...fs.readdirSync(path.join(projectRoot, 'js', 'core')).map((file) => `js/core/${file}`),
            ...fs.readdirSync(path.join(projectRoot, 'js', 'services')).map((file) => `js/services/${file}`),
            ...fs.readdirSync(path.join(projectRoot, 'js', 'views')).map((file) => `js/views/${file}`)
        ];
        const ids = new Set();
        for (const file of scriptFiles) {
            const source = fs.readFileSync(path.join(projectRoot, file), 'utf8');
            for (const match of source.matchAll(/Dom\.byId\('([^']+)'\)/g)) ids.add(match[1]);
        }

        const dynamicResultIds = new Set([
            'resultHarder',
            'resultRetry',
            'resultNext',
            'resultNextLevel',
            'resultBack'
        ]);
        const { context, dom } = createDomContext(html);
        for (const id of ids) {
            if (dynamicResultIds.has(id)) continue;
            assert.equal(context.document.querySelectorAll(`#${id}`).length, 1, id);
        }
        dom.window.close();
    });

    it('bewahrt Elementtypen und Fokusanker kritischer IDs', () => {
        const expectedTags = {
            sidebar: 'ASIDE',
            mobileToggle: 'BUTTON',
            sidebarBackdrop: 'BUTTON',
            backToDashboard: 'BUTTON',
            typingInput: 'INPUT',
            resultOverlay: 'DIV',
            resultCard: 'DIV',
            sessionsTable: 'TABLE',
            targetDateInput: 'INPUT',
            importFile: 'INPUT'
        };
        const { context, dom } = createDomContext(html);
        for (const [id, tag] of Object.entries(expectedTags)) {
            assert.equal(context.document.getElementById(id)?.tagName, tag, id);
        }
        assert.equal(context.document.getElementById('view-levels').getAttribute('tabindex'), '-1');
        dom.window.close();
    });

    it('behält alle sieben View-Wurzeln und sechs Hauptnavigationseinträge', () => {
        const expectedViews = [
            'dashboard',
            'levels',
            'typing',
            'calendar',
            'achievements',
            'progress',
            'settings'
        ];
        const { context, dom } = createDomContext(html);
        assert.deepEqual(
            [...context.document.querySelectorAll('.view')].map(({ id }) => id),
            expectedViews.map((view) => `view-${view}`)
        );
        assert.deepEqual(
            [...context.document.querySelectorAll('.nav-item[data-view]')].map(({ dataset }) => dataset.view),
            expectedViews.filter((view) => view !== 'typing')
        );
        dom.window.close();
    });

    it('liefert semantische Landmarken und benannte Eingaben', () => {
        const { context, dom } = createDomContext(html);
        const document = context.document;
        assert.equal(document.querySelectorAll('main').length, 1);
        assert.equal(document.querySelectorAll('aside').length, 1);
        assert.equal(document.querySelectorAll('nav[aria-label="Hauptnavigation"]').length, 1);
        assert.equal(document.querySelectorAll('input:not([aria-label]):not([type="file"])').length, 1);
        assert.equal(document.querySelector('#targetDateInput').labels.length, 1);
        assert.equal(document.querySelectorAll('.view h2').length, 7);
        dom.window.close();
    });

    it('behält Auswahlaktionen als native Buttons', () => {
        const { context, dom } = createDomContext(html);
        assert.equal(
            [...context.document.querySelectorAll('.nav-item')].every(
                (element) => element.tagName === 'BUTTON'
            ),
            true
        );
        assert.equal(context.document.querySelector('#backToDashboard').tagName, 'BUTTON');
        assert.equal(context.document.querySelector('#typingBack').tagName, 'BUTTON');
        dom.window.close();
    });
});

describe('CSS-Vertrag des Prüfungsateliers', () => {
    it('definiert jede verwendete CSS-Variable oder versieht sie mit einem Fallback', () => {
        const definitions = new Set([...css.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((match) => match[1]));
        const missing = [];
        for (const match of css.matchAll(/var\(\s*(--[\w-]+)(\s*,[^)]*)?\)/g)) {
            if (!definitions.has(match[1]) && !match[2]) missing.push(match[1]);
        }
        assert.deepEqual([...new Set(missing)], []);
    });

    it('hält CSS- und JavaScript-Breakpoint synchron bei 768 Pixeln', () => {
        const router = fs.readFileSync(path.join(projectRoot, 'js/core/router.js'), 'utf8');
        assert.match(css, /@media \(max-width: 768px\)/);
        assert.match(router, /matchMedia\('\(max-width: 768px\)'\)/);
    });

    it('enthält Regeln für sämtliche dynamischen Zustandsklassen', () => {
        for (const state of [
            'active',
            'open',
            'visible',
            'locked',
            'completed',
            'correct',
            'incorrect',
            'current',
            'good',
            'warn',
            'bad'
        ]) {
            assert.match(css, new RegExp(`\\.${state}(?:[\\s:{.,]|$)`), state);
        }
    });

    it('schützt Nutzer mit reduzierter Bewegung', () => {
        assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
        assert.match(css, /animation-duration: 0\.01ms !important/);
        assert.match(css, /transition-duration: 0\.01ms !important/);
    });

    it('verwendet die redaktionelle Palette ohne alten Blau- oder Gradient-Look', () => {
        assert.match(css, /--accent: #a33731/);
        assert.match(css, /--font-editorial:/);
        assert.doesNotMatch(css, /#58a6ff/i);
        assert.doesNotMatch(css, /linear-gradient/i);
    });

    it('enthält in den sichtbaren Kernansichten keine dekorativen Emoji', () => {
        const viewSources = [
            'index.html',
            'js/views/dashboard.js',
            'js/views/levels.js',
            'js/views/typing.js',
            'js/views/result.js',
            'js/views/calendar.js',
            'js/views/achievements.js',
            'js/views/progress.js'
        ]
            .map((file) => fs.readFileSync(path.join(projectRoot, file), 'utf8'))
            .join('\n');
        assert.doesNotMatch(viewSources, /[\u{1F300}-\u{1FAFF}]/u);
    });
});
