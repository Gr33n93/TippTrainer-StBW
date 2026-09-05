import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import {
    clone,
    createBrowserContext,
    inRealm,
    loadScripts,
    sampleSession
} from './helpers/browser-context.js';

describe('Progress', () => {
    let context;
    let Progress;

    beforeEach(() => {
        context = createBrowserContext({ now: Date.parse('2026-06-15T10:00:00.000Z') });
        loadScripts(context, [
            ['js/engine/storage.js', 'Storage'],
            ['js/services/levels.js', 'Levels'],
            ['js/services/progress.js', 'Progress']
        ]);
        Progress = context.Progress;
    });

    function saveSessions(sessions) {
        assert.equal(context.Storage.saveProgress(inRealm(context, sessions)), true);
    }

    it('liefert Nullstatistiken ohne Sessions', () => {
        assert.deepEqual(clone(Progress.getOverallStats()), {
            totalSessions: 0,
            totalChars: 0,
            avgWPM: 0,
            avgAccuracy: 0,
            bestWPM: 0,
            totalMinutes: 0
        });
    });

    it('aggregiert gemischte Sessions', () => {
        saveSessions([
            sampleSession({ id: 'a', wpm: 30, accuracy: 80, totalChars: 100, elapsedSeconds: 60 }),
            sampleSession({ id: 'b', wpm: 50, accuracy: 100, totalChars: 200, elapsedSeconds: 120 })
        ]);
        assert.deepEqual(clone(Progress.getOverallStats()), {
            totalSessions: 2,
            totalChars: 300,
            avgWPM: 40,
            avgAccuracy: 90,
            bestWPM: 50,
            totalMinutes: 3
        });
    });

    it('filtert nach Topic, Level und Difficulty', () => {
        saveSessions([
            sampleSession({ id: 'a' }),
            sampleSession({ id: 'b', topic: 'steuerrecht', level: 2, difficulty: 'schwer' })
        ]);
        assert.equal(Progress.getSessionsByTopic('buchfuehrung').length, 1);
        assert.equal(Progress.getSessionsByLevel('steuerrecht', 2).length, 1);
        assert.equal(Progress.getSessionsByDifficulty('schwer').length, 1);
        assert.equal(Progress.getSessionsByTopicLevelDifficulty('steuerrecht', 2, 'schwer').length, 1);
    });

    it('behandelt Bereichsgrenzen inklusiv', () => {
        saveSessions([
            sampleSession({ id: 'a', timestamp: '2026-06-01T00:00:00.000Z' }),
            sampleSession({ id: 'b', timestamp: '2026-06-30T23:59:59.000Z' }),
            sampleSession({ id: 'c', timestamp: '2026-07-01T00:00:00.000Z' })
        ]);
        assert.equal(
            Progress.getSessionsInRange('2026-06-01T00:00:00.000Z', '2026-06-30T23:59:59.000Z').length,
            2
        );
    });

    it('liefert die neuesten Sessions in umgekehrter Reihenfolge', () => {
        saveSessions(['a', 'b', 'c'].map((id) => sampleSession({ id })));
        assert.deepEqual(
            clone(Progress.getRecentSessions(2)).map(({ id }) => id),
            ['c', 'b']
        );
    });

    it('berechnet Mittel- und Bestwerte', () => {
        saveSessions([
            sampleSession({ id: 'a', wpm: 31, accuracy: 91 }),
            sampleSession({ id: 'b', wpm: 42, accuracy: 98 })
        ]);
        assert.equal(Progress.getAverageWPM('buchfuehrung', 1, 'normal'), 37);
        assert.equal(Progress.getAverageAccuracy('buchfuehrung', 1, 'normal'), 94.5);
        assert.equal(Progress.getBestWPM('buchfuehrung', 1, 'normal'), 42);
        assert.equal(Progress.getBestAccuracy('buchfuehrung', 1, 'normal'), 98);
    });

    it('gruppiert eine Berliner Montagssession in die lokale Montagwoche', () => {
        saveSessions([
            sampleSession({
                timestamp: '2026-05-31T22:30:00.000Z',
                elapsedSeconds: 60
            })
        ]);
        const weekly = clone(Progress.getWeeklyProgress());
        assert.equal(weekly.length, 1);
        assert.equal(weekly[0].week, '2026-06-01');
    });

    it('liefert ohne Prüfungstermin keinen irreführenden Countdown', () => {
        assert.equal(Progress.getTargetDate(), null);
        assert.equal(Progress.getDaysUntilTarget(), null);
    });

    it('berechnet den Countdown auf lokale Kalendertage', () => {
        const settings = clone(context.Storage.getSettings());
        settings.targetDate = '2026-06-20';
        context.Storage.saveSettings(inRealm(context, settings));
        assert.equal(Progress.getDaysUntilTarget(), 5);
    });

    it('zaehlt ueber das Ende der Sommerzeit genau einen Kalendertag', () => {
        context.advanceTime(Date.parse('2026-10-24T22:00:00.000Z') - Date.parse('2026-06-15T10:00:00.000Z'));
        const settings = clone(context.Storage.getSettings());
        settings.targetDate = '2026-10-26';
        context.Storage.saveSettings(inRealm(context, settings));
        assert.equal(Progress.getDaysUntilTarget(), 1);
    });

    it('erzeugt beim Hinzufügen ID und autoritativen Zeitstempel', () => {
        const input = sampleSession({ id: undefined, timestamp: '2020-01-01T00:00:00.000Z' });
        const stored = Progress.addSession(inRealm(context, input));
        assert.ok(stored.id.length >= 6);
        assert.equal(stored.timestamp, '2026-06-15T10:00:00.000Z');
        assert.equal(Progress.getAllSessions().length, 1);
    });

    it('zeigt Levelversuche und Ziele an', () => {
        saveSessions([sampleSession({ wpm: 40, accuracy: 95 })]);
        context.Levels.checkLevelCompletion('buchfuehrung', 1, 'normal', 95, 40);
        const display = clone(Progress.getProgressForLevelDisplay('buchfuehrung', 1, 'normal'));
        assert.equal(display.attempts, 1);
        assert.equal(display.passed, true);
        assert.equal(display.targetWPM, 35);
        assert.equal(display.targetAccuracy, 90);
    });
});
