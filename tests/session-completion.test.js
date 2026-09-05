import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import {
    clone,
    createBrowserContext,
    createMemoryStorage,
    inRealm,
    loadScripts
} from './helpers/browser-context.js';

describe('SessionCompletion Integration', () => {
    let context;
    let input;
    let storage;

    beforeEach(() => {
        input = { disabled: false };
        storage = createMemoryStorage();
        context = createBrowserContext({
            localStorage: storage,
            console: { warn() {}, error() {} },
            globals: {
                document: {},
                Dom: { byId: (id) => (id === 'typingInput' ? input : null) },
                Texts: {
                    DIFFICULTY_NAMES: {
                        leicht: 'Leicht',
                        normal: 'Normal',
                        schwer: 'Schwer',
                        sehrSchwer: 'Sehr Schwer'
                    },
                    getAllTopics: () => ['buchfuehrung']
                }
            }
        });
        loadScripts(context, [
            ['js/core/state.js', 'State'],
            ['js/engine/storage.js', 'Storage'],
            ['js/services/levels.js', 'Levels'],
            ['js/services/calendar.js', 'Calendar'],
            ['js/services/progress.js', 'Progress'],
            ['js/services/achievements.js', 'Achievements'],
            ['js/services/recommendation.js', 'Recommendation'],
            ['js/services/session-completion.js', 'SessionCompletion']
        ]);
        context.State.topic = 'buchfuehrung';
        context.State.level = 1;
        context.State.difficulty = 'normal';
    });

    function stats(overrides = {}) {
        return inRealm(context, {
            text: 'abcde',
            totalChars: 5,
            correctChars: 5,
            incorrectChars: 0,
            accuracy: 100,
            wpm: 40,
            cpm: 200,
            elapsedSeconds: 1.5,
            avgTimePerChar: 300,
            timestamp: '2026-06-15T10:00:00.000Z',
            ...overrides
        });
    }

    it('persistiert alle Kernfolgen eines erfolgreichen Abschlusses', () => {
        const result = context.SessionCompletion.complete(stats());
        assert.equal(input.disabled, true);
        assert.equal(result.passed, true);
        assert.equal(result.persisted, true);
        assert.equal(context.Progress.getAllSessions().length, 1);
        assert.equal(context.Calendar.getTotalPracticeDays(), 1);
        assert.equal(context.Levels.isLevelCompleted('buchfuehrung', 1, 'normal'), true);
        assert.deepEqual(clone(context.Levels.getUnlockedLevels('buchfuehrung')), [1, 2]);
        assert.equal(context.Storage.getXP().total, result.xpEarned);
        assert.ok(result.newAchievements.some(({ id }) => id === 'first_exercise'));
        assert.ok(result.newAchievements.some(({ id }) => id === 'first_perfect'));
    });

    it('speichert einen Fehlschlag, schaltet aber kein Level frei und begrenzt XP', () => {
        const result = context.SessionCompletion.complete(
            stats({ correctChars: 0, incorrectChars: 5, accuracy: 0, wpm: 0, cpm: 0 })
        );
        assert.equal(result.passed, false);
        assert.equal(result.xpEarned, 5);
        assert.equal(context.Levels.isLevelCompleted('buchfuehrung', 1, 'normal'), false);
        assert.equal(context.Progress.getAllSessions().length, 1);
    });

    it('bricht bei logisch ungültigen Statistiken ohne Nebenwirkungen ab', () => {
        const before = storage.dump();
        const result = context.SessionCompletion.complete(stats({ elapsedSeconds: -1 }));
        assert.equal(result.persisted, false);
        assert.equal(result.xpEarned, 0);
        assert.deepEqual(storage.dump(), before);
    });

    it('rollt bei einem XP-Überlauf alle Nebenwirkungen zurueck', () => {
        assert.equal(
            context.Storage.saveXP(inRealm(context, { total: Number.MAX_SAFE_INTEGER - 1, userLevel: 50 })),
            true
        );
        const before = storage.dump();

        const result = context.SessionCompletion.complete(stats());

        assert.equal(result.persisted, false);
        assert.equal(result.xpEarned, 0);
        assert.deepEqual(storage.dump(), before);
    });

    for (const failingKey of ['progress', 'calendar', 'levels', 'xp', 'achievements']) {
        it(`rollt bei einem Schreibfehler in ${failingKey} alle Nebenwirkungen zurueck`, () => {
            const before = storage.dump();
            storage.failNextSetFor(`tippTrainer_${failingKey}`);

            const result = context.SessionCompletion.complete(stats());

            assert.equal(result.persisted, false);
            assert.equal(result.xpEarned, 0);
            assert.deepEqual(clone(result.newAchievements), []);
            assert.deepEqual(storage.dump(), before);
        });
    }
});
