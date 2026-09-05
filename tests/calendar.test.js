import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { clone, createBrowserContext, inRealm, loadScripts } from './helpers/browser-context.js';

function day(totalSeconds, exercises = 1) {
    return {
        totalSeconds,
        exercises,
        firstAt: '2026-06-15T10:00:00.000Z',
        lastAt: '2026-06-15T10:01:00.000Z'
    };
}

describe('Calendar', () => {
    let context;
    let Calendar;

    beforeEach(() => {
        context = createBrowserContext({ now: Date.parse('2026-06-15T10:00:00.000Z') });
        loadScripts(context, [
            ['js/engine/storage.js', 'Storage'],
            ['js/services/calendar.js', 'Calendar']
        ]);
        Calendar = context.Calendar;
    });

    it('erzeugt lokale, nullaufgefüllte Datumsschlüssel', () => {
        assert.equal(Calendar.getLocalDateKey(new Date(2026, 0, 2, 23, 30)), '2026-01-02');
    });

    it('akkumuliert mehrere Übungen eines Tages', () => {
        assert.equal(Calendar.recordPractice(30).exercises, 1);
        const entry = Calendar.recordPractice(90);
        assert.equal(entry.exercises, 2);
        assert.equal(entry.totalSeconds, 120);
        assert.equal(Calendar.hasPracticedToday(), true);
    });

    it('weist negative und nicht-endliche Dauer ab', () => {
        assert.equal(Calendar.recordPractice(-1), null);
        assert.equal(Calendar.recordPractice(Number.NaN), null);
        assert.equal(Calendar.getTotalPracticeDays(), 0);
    });

    it('filtert Monatsdaten präzise', () => {
        context.Storage.saveCalendarData(
            inRealm(context, {
                '2026-05-31': day(60),
                '2026-06-01': day(120),
                '2026-06-30': day(180),
                '2026-07-01': day(240)
            })
        );
        assert.deepEqual(Object.keys(Calendar.getMonthData(2026, 6)).sort(), ['2026-06-01', '2026-06-30']);
    });

    it('berechnet Intensitätsgrenzen', () => {
        const dates = ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05'];
        const seconds = [1, 5 * 60, 15 * 60, 30 * 60, 60 * 60];
        context.Storage.saveCalendarData(
            inRealm(context, Object.fromEntries(dates.map((date, index) => [date, day(seconds[index])])))
        );
        assert.deepEqual(
            dates.map((date) => Calendar.getIntensityLevel(date)),
            [1, 2, 3, 4, 5]
        );
    });

    it('berechnet eine aktuelle Serie einschließlich heute', () => {
        context.Storage.saveCalendarData(
            inRealm(context, {
                '2026-06-13': day(60),
                '2026-06-14': day(60),
                '2026-06-15': day(60)
            })
        );
        assert.equal(Calendar.calculateStreak(), 3);
    });

    it('erlaubt für die aktuelle Serie einen noch ungeübten heutigen Tag', () => {
        context.Storage.saveCalendarData(
            inRealm(context, {
                '2026-06-13': day(60),
                '2026-06-14': day(60)
            })
        );
        assert.equal(Calendar.calculateStreak(), 2);
    });

    it('bricht aktuelle Serien an einer Lücke ab', () => {
        context.Storage.saveCalendarData(
            inRealm(context, {
                '2026-06-12': day(60),
                '2026-06-14': day(60),
                '2026-06-15': day(60)
            })
        );
        assert.equal(Calendar.calculateStreak(), 2);
    });

    it('ermittelt die längste historische Serie über Monatsgrenzen', () => {
        context.Storage.saveCalendarData(
            inRealm(context, {
                '2026-01-30': day(60),
                '2026-01-31': day(60),
                '2026-02-01': day(60),
                '2026-02-03': day(60)
            })
        );
        assert.equal(Calendar.getLongestStreak(), 3);
    });

    it('kennt Schaltjahre und Montag-basierte Monatsstarts', () => {
        assert.equal(Calendar.getDaysInMonth(2024, 2), 29);
        assert.equal(Calendar.getDaysInMonth(2025, 2), 28);
        assert.equal(Calendar.getFirstDayOfMonth(2026, 6), 0);
        assert.equal(Calendar.getFirstDayOfMonth(2026, 2), 6);
    });

    it('aggregiert die Kalenderstatistik', () => {
        context.Storage.saveCalendarData(
            inRealm(context, {
                '2026-06-14': day(120),
                '2026-06-15': day(240)
            })
        );
        assert.deepEqual(clone(Calendar.getStats()), {
            totalDays: 2,
            totalMinutes: 6,
            currentStreak: 2,
            longestStreak: 2,
            practicedToday: true
        });
    });
});
