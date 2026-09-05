import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { clone, createBrowserContext, inRealm, loadScripts } from './helpers/browser-context.js';

describe('Levels', () => {
    let context;
    let Levels;

    beforeEach(() => {
        context = createBrowserContext();
        loadScripts(context, [
            ['js/engine/storage.js', 'Storage'],
            ['js/services/levels.js', 'Levels']
        ]);
        Levels = context.Levels;
    });

    it('initialisiert jeden Themenbereich ausschließlich mit Level 1', () => {
        assert.deepEqual(clone(Levels.getUnlockedLevels('buchfuehrung')), [1]);
        assert.equal(Levels.isLevelUnlocked('buchfuehrung', 2), false);
    });

    for (const [difficulty, minAccuracy, minWPM] of [
        ['leicht', 85, 20],
        ['normal', 90, 35],
        ['schwer', 95, 50],
        ['sehrSchwer', 97, 75]
    ]) {
        it(`wendet die Grenzwerte für ${difficulty} exakt an`, () => {
            assert.equal(
                Levels.checkLevelCompletion('buchfuehrung', 1, difficulty, minAccuracy - 1, minWPM),
                false
            );
            assert.equal(
                Levels.checkLevelCompletion('buchfuehrung', 1, difficulty, minAccuracy, minWPM - 1),
                false
            );
            assert.equal(
                Levels.checkLevelCompletion('buchfuehrung', 1, difficulty, minAccuracy, minWPM),
                true
            );
        });
    }

    it('schaltet nach Erfolg genau das nächste Level frei', () => {
        Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 95, 40);
        assert.deepEqual(clone(Levels.getUnlockedLevels('buchfuehrung')), [1, 2]);
        Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 96, 41);
        assert.deepEqual(clone(Levels.getUnlockedLevels('buchfuehrung')), [1, 2]);
    });

    it('schaltet nach Level 10 kein Level 11 frei', () => {
        context.Storage.saveLevels(
            inRealm(context, {
                buchfuehrung: { unlockedLevels: [1, 10], completedLevels: {} }
            })
        );
        Levels.checkLevelCompletion('buchfuehrung', 10, 'normal', 100, 100);
        assert.equal(Levels.getUnlockedLevels('buchfuehrung').includes(11), false);
    });

    it('bewahrt Bestwerte bei gegenläufigen Verbesserungen', () => {
        Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 92, 80);
        Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 99, 40);
        Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 91, 90);
        const info = Levels.getCompletedInfo('buchfuehrung', 1, 'normal');
        assert.equal(info.accuracy, 99);
        assert.equal(info.wpm, 90);
    });

    it('berechnet Textanteile pro Normwort statt pro Zeichen', () => {
        assert.equal(Levels.calculateXP('normal', 100, 40, 100, true), 116);
    });

    it('vergibt für einen Fehlschlag nur Trost-XP', () => {
        assert.equal(Levels.calculateXP('sehrSchwer', 0, 0, 650, false), 5);
        assert.equal(Levels.calculateXP('normal', 100, 100, 100, false), 5);
    });

    it('liefert einen stabilen Themenfortschritt', () => {
        Levels.checkLevelCompletion('buchfuehrung', 1, 'leicht', 100, 100);
        Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 100, 100);
        const summary = clone(Levels.getTopicSummary('buchfuehrung'));
        assert.deepEqual(summary, {
            maxUnlockedLevel: 2,
            totalCompletions: 2,
            maxPossible: 8,
            progressPercent: 5
        });
    });

    it('setzt Fortschritt eines Themas und global zurück', () => {
        Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 100, 100);
        Levels.checkLevelCompletion('steuerrecht', 1, 'normal', 100, 100);
        Levels.resetProgress('buchfuehrung');
        assert.deepEqual(clone(Levels.getUnlockedLevels('buchfuehrung')), [1]);
        assert.deepEqual(clone(Levels.getUnlockedLevels('steuerrecht')), [1, 2]);
        Levels.resetAllProgress();
        assert.deepEqual(clone(context.Storage.getLevels()), {});
    });
});
