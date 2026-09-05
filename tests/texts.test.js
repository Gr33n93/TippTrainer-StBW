import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { createBrowserContext, loadScripts } from './helpers/browser-context.js';

describe('Textkorpus', () => {
    let context;
    let Texts;

    before(() => {
        context = createBrowserContext();
        loadScripts(context, [
            ['data/texts.js', 'Texts'],
            ['data/texts-extra.js', 'TextsExtra'],
            ['data/texts-sehrSchwer.js', 'TextsSehrSchwer']
        ]);
        context.TextsExtra.apply();
        context.TextsSehrSchwer.apply();
        Texts = context.Texts;
    });

    it('enthält die vollständige Matrix aus 4 Themen, 10 Leveln und 4 Schwierigkeiten', () => {
        assert.equal(Texts.getAllTopics().length, 4);
        for (const topic of Texts.getAllTopics()) {
            assert.deepEqual(Array.from(Texts.getAvailableLevels(topic)), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            for (let level = 1; level <= 10; level++) {
                assert.deepEqual(Array.from(Texts.getAvailableDifficulties(topic, level)).sort(), [
                    'leicht',
                    'normal',
                    'schwer',
                    'sehrSchwer'
                ]);
            }
        }
    });

    it('enthält ausschließlich nicht-leere Strings', () => {
        for (const topic of Texts.getAllTopics()) {
            for (let level = 1; level <= 10; level++) {
                for (const difficulty of Object.keys(Texts.DIFFICULTY_NAMES)) {
                    const pool = Texts.getTexts(topic, level, difficulty);
                    assert.ok(pool.length > 0, `${topic}/${level}/${difficulty}`);
                    assert.equal(
                        pool.every(
                            (text) => typeof text === 'string' && text.trim() === text && text.length > 0
                        ),
                        true
                    );
                }
            }
        }
    });

    it('enthält innerhalb eines Auswahlpools keine Dubletten', () => {
        for (const topic of Texts.getAllTopics()) {
            for (let level = 1; level <= 10; level++) {
                for (const difficulty of Object.keys(Texts.DIFFICULTY_NAMES)) {
                    const pool = Texts.getTexts(topic, level, difficulty);
                    assert.equal(new Set(pool).size, pool.length, `${topic}/${level}/${difficulty}`);
                }
            }
        }
    });

    it('wendet Erweiterungsmodule idempotent an', () => {
        const count = Texts.getTotalTextCount();
        context.TextsExtra.apply();
        context.TextsSehrSchwer.apply();
        assert.equal(Texts.getTotalTextCount(), count);
    });

    it('zieht Zufallstexte nur aus dem angeforderten Pool', () => {
        const pool = Texts.getTexts('steuerrecht', 4, 'schwer');
        for (let index = 0; index < 20; index++) {
            assert.equal(pool.includes(Texts.getRandomText('steuerrecht', 4, 'schwer')), true);
        }
        assert.equal(
            Texts.getRandomText('unbekannt', 1, 'normal'),
            'Bitte wähle einen gültigen Themenbereich, Level und Schwierigkeitsgrad.'
        );
    });

    it('enthält keine bekannten veralteten Steuergrenzen', () => {
        const allTexts = [];
        for (const topic of Texts.getAllTopics()) {
            for (let level = 1; level <= 10; level++) {
                for (const difficulty of Object.keys(Texts.DIFFICULTY_NAMES)) {
                    allTexts.push(...Texts.getTexts(topic, level, difficulty));
                }
            }
        }
        const corpus = allTexts.join('\n');
        assert.doesNotMatch(corpus, /Kleinunternehmer[^\n]*22\.000/);
        assert.doesNotMatch(corpus, /anschaffungsnahe Herstellungskosten von drei Prozent/);
        assert.doesNotMatch(corpus, /sechs Monate[^\n]*Rechtsbehelfsbelehrung/);
        assert.match(corpus, /25\.000 Euro Gesamtumsatz im Vorjahr/);
        assert.match(corpus, /Buchungsbelege acht Jahre/);
    });

    it('meldet eine belastbare Gesamtzahl', () => {
        assert.ok(Texts.getTotalTextCount() >= 1900);
    });
});
