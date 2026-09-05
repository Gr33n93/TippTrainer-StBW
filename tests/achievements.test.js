import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import {
    clone,
    createBrowserContext,
    inRealm,
    loadScripts,
    sampleSession
} from './helpers/browser-context.js';

function createContext(now = Date.parse('2026-06-15T10:00:00.000Z')) {
    const context = createBrowserContext({
        now,
        globals: { Texts: { getAllTopics: () => ['buchfuehrung'] } }
    });
    loadScripts(context, [
        ['js/engine/storage.js', 'Storage'],
        ['js/services/levels.js', 'Levels'],
        ['js/services/calendar.js', 'Calendar'],
        ['js/services/achievements.js', 'Achievements']
    ]);
    return context;
}

function stats(overrides = {}) {
    return {
        totalChars: 100,
        accuracy: 90,
        wpm: 30,
        elapsedSeconds: 60,
        difficulty: 'normal',
        ...overrides
    };
}

describe('Achievements', () => {
    let context;

    beforeEach(() => {
        context = createContext();
    });

    it('stellt alle 32 eindeutigen Definitionen bereit', () => {
        const all = clone(context.Achievements.getAll());
        assert.equal(all.length, 32);
        assert.equal(new Set(all.map(({ id }) => id)).size, 32);
        assert.equal(context.Achievements.getTotalCount(), 32);
    });

    it('schaltet Basis-, Accuracy- und Speed-Erfolge an Grenzwerten frei', () => {
        const unlocked = context.Achievements.checkAndUnlock(
            inRealm(context, stats({ accuracy: 100, wpm: 100 }))
        );
        const ids = new Set(unlocked.map(({ id }) => id));
        for (const id of [
            'first_exercise',
            'first_perfect',
            'speed_40',
            'speed_60',
            'speed_80',
            'speed_100',
            'accuracy_95',
            'accuracy_98'
        ]) {
            assert.equal(ids.has(id), true, id);
        }
    });

    it('meldet bereits freigeschaltete Erfolge nicht erneut', () => {
        const highStats = inRealm(context, stats({ accuracy: 100, wpm: 100 }));
        assert.ok(context.Achievements.checkAndUnlock(highStats).length > 0);
        assert.equal(context.Achievements.checkAndUnlock(highStats).length, 0);
    });

    it('unterscheidet Schwer- und Sehr-Schwer-Erfolge', () => {
        const hard = new Set(
            context.Achievements.checkAndUnlock(
                inRealm(context, stats({ difficulty: 'schwer', accuracy: 100 }))
            ).map(({ id }) => id)
        );
        assert.equal(hard.has('hard_mode'), true);
        assert.equal(hard.has('hard_perfect'), true);

        const extreme = new Set(
            context.Achievements.checkAndUnlock(
                inRealm(context, stats({ difficulty: 'sehrSchwer', accuracy: 100 }))
            ).map(({ id }) => id)
        );
        assert.equal(extreme.has('extreme_mode'), true);
        assert.equal(extreme.has('extreme_perfect'), true);
    });

    it('erkennt zehn präzise Übungen in Folge', () => {
        const sessions = Array.from({ length: 10 }, (_, index) =>
            sampleSession({ id: String(index), accuracy: index === 0 ? 98 : 100 })
        );
        context.Storage.saveProgress(inRealm(context, sessions));
        const ids = context.Achievements.checkAndUnlock(inRealm(context, stats())).map(({ id }) => id);
        assert.equal(ids.includes('accuracy_streak_10'), true);
        assert.equal(ids.includes('exercises_10'), true);
    });

    it('schaltet Streak-Erfolge anhand lokaler Kalendertage frei', () => {
        const calendar = {};
        for (let offset = 0; offset < 3; offset++) {
            const date = new Date(2026, 5, 15 - offset);
            calendar[context.Calendar.getLocalDateKey(date)] = {
                totalSeconds: 60,
                exercises: 1,
                firstAt: '2026-06-15T10:00:00.000Z'
            };
        }
        context.Storage.saveCalendarData(inRealm(context, calendar));
        const ids = context.Achievements.checkAndUnlock(inRealm(context, stats())).map(({ id }) => id);
        assert.equal(ids.includes('streak_3'), true);
    });

    it('erkennt freigeschaltetes Level 5', () => {
        context.Storage.saveLevels(
            inRealm(context, {
                buchfuehrung: { unlockedLevels: [1, 2, 3, 4, 5], completedLevels: {} }
            })
        );
        const ids = context.Achievements.checkAndUnlock(inRealm(context, stats())).map(({ id }) => id);
        assert.equal(ids.includes('level_5_reached'), true);
    });

    it('erkennt alle Level eines Themenbereichs', () => {
        const completedLevels = Object.fromEntries(
            Array.from({ length: 10 }, (_, index) => [
                `${index + 1}_normal`,
                { accuracy: 95, wpm: 50, completedAt: '2026-06-15T10:00:00.000Z' }
            ])
        );
        context.Storage.saveLevels(
            inRealm(context, {
                buchfuehrung: {
                    unlockedLevels: Array.from({ length: 10 }, (_, index) => index + 1),
                    completedLevels
                }
            })
        );
        const ids = context.Achievements.checkAndUnlock(inRealm(context, stats())).map(({ id }) => id);
        assert.equal(ids.includes('all_levels'), true);
    });

    it('filtert Definitionen nach Kategorie', () => {
        const speed = context.Achievements.getByCategory('speed');
        assert.equal(speed.length, 4);
        assert.equal(
            speed.every(({ category }) => category === 'speed'),
            true
        );
    });
});
