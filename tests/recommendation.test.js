import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { createBrowserContext, loadScripts } from './helpers/browser-context.js';

describe('Recommendation', () => {
    let Recommendation;

    beforeEach(() => {
        const context = createBrowserContext({
            globals: {
                Storage: {},
                Texts: {
                    DIFFICULTY_NAMES: {
                        leicht: 'Leicht',
                        normal: 'Normal',
                        schwer: 'Schwer',
                        sehrSchwer: 'Sehr Schwer'
                    }
                }
            }
        });
        loadScripts(context, [
            ['js/services/levels.js', 'Levels'],
            ['js/services/recommendation.js', 'Recommendation']
        ]);
        Recommendation = context.Recommendation;
    });

    it('empfiehlt die höchste erfüllte Stufe', () => {
        assert.equal(Recommendation.recommend({ wpm: 80, accuracy: 99 }, 'leicht').nextDiff, 'sehrSchwer');
    });

    it('empfiehlt eine direkt höhere Stufe am exakten Grenzwert', () => {
        assert.equal(Recommendation.recommend({ wpm: 35, accuracy: 90 }, 'leicht').nextDiff, 'normal');
    });

    it('empfiehlt keine Stufe bei zu geringer Accuracy', () => {
        assert.equal(Recommendation.recommend({ wpm: 100, accuracy: 89 }, 'leicht'), null);
    });

    it('empfiehlt keinen Downgrade und nichts oberhalb der höchsten Stufe', () => {
        assert.equal(Recommendation.recommend({ wpm: 100, accuracy: 100 }, 'sehrSchwer'), null);
        assert.equal(Recommendation.recommend({ wpm: 40, accuracy: 95 }, 'schwer'), null);
    });

    it('liefert eine nachvollziehbare Begründung', () => {
        const result = Recommendation.recommend({ wpm: 50, accuracy: 95 }, 'normal');
        assert.match(result.reason, /50 WPM/);
        assert.match(result.reason, /95%/);
        assert.match(result.reason, /Schwer/);
    });
});
