import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import {
    clone,
    createBrowserContext,
    createMemoryStorage,
    inRealm,
    loadScript,
    sampleSession
} from './helpers/browser-context.js';

function emptyBackup(overrides = {}) {
    return {
        version: 1,
        progress: [],
        achievements: {},
        levels: {},
        settings: {
            difficulty: 'normal',
            topic: null,
            level: null,
            soundEnabled: true,
            targetDate: ''
        },
        calendar: {},
        xp: { total: 0, userLevel: 1 },
        exportedAt: '2026-06-15T10:00:00.000Z',
        ...overrides
    };
}

describe('Storage', () => {
    let context;
    let storage;
    let Storage;

    beforeEach(() => {
        storage = createMemoryStorage();
        context = createBrowserContext({
            localStorage: storage,
            console: { warn() {}, error() {} }
        });
        Storage = loadScript(context, 'js/engine/storage.js', 'Storage');
    });

    it('liefert sichere Defaults für einen frischen Start', () => {
        assert.deepEqual(clone(Storage.getProgress()), []);
        assert.deepEqual(clone(Storage.getAchievements()), {});
        assert.deepEqual(clone(Storage.getLevels()), {});
        assert.deepEqual(clone(Storage.getXP()), { total: 0, userLevel: 1 });
        assert.equal(Storage.getSettings().targetDate, '');
    });

    it('speichert ausschließlich im App-Namespace', () => {
        assert.equal(Storage.save('probe', { ok: true }), true);
        assert.equal(storage.getItem('probe'), null);
        assert.equal(storage.getItem('tippTrainer_probe'), '{"ok":true}');
    });

    it('fängt beschädigtes JSON ab', () => {
        storage.setItem('tippTrainer_progress', '{broken');
        assert.deepEqual(clone(Storage.getProgress()), []);
    });

    it('filtert beschädigte persistierte Sessions beim Lesen', () => {
        storage.setItem(
            'tippTrainer_progress',
            JSON.stringify([sampleSession(), sampleSession({ accuracy: 101 }), { evil: true }])
        );
        assert.equal(Storage.getProgress().length, 1);
    });

    it('weist ungültige Sessions beim Speichern ab', () => {
        assert.equal(Storage.saveProgress(inRealm(context, [sampleSession({ wpm: -1 })])), false);
        assert.equal(storage.getItem('tippTrainer_progress'), null);
    });

    it('exportiert ein versioniertes, vollständiges Backup', () => {
        const backup = clone(Storage.exportAll());
        assert.equal(backup.version, Storage.BACKUP_VERSION);
        assert.deepEqual(Object.keys(backup).sort(), [
            'achievements',
            'calendar',
            'exportedAt',
            'levels',
            'progress',
            'settings',
            'version',
            'xp'
        ]);
    });

    it('lehnt leere und unvollständige Backups ab', () => {
        assert.equal(Storage.importAll(inRealm(context, {})), false);
        assert.equal(Storage.importAll(inRealm(context, { progress: [] })), false);
    });

    for (const [name, invalidSession] of [
        ['ungültiges Datum', sampleSession({ timestamp: 'kein-datum' })],
        ['nicht kanonisches ISO-Datum', sampleSession({ timestamp: '2026-06-15' })],
        ['negative WPM', sampleSession({ wpm: -3 })],
        ['zu hohe Accuracy', sampleSession({ accuracy: 999 })],
        ['gebrochenes Level', sampleSession({ level: 1.5 })],
        ['unbekannte Difficulty', sampleSession({ difficulty: 'evil' })],
        ['unbekanntes Topic', sampleSession({ topic: 'evil' })]
    ]) {
        it(`lehnt Sessions mit ${name} ab`, () => {
            const backup = emptyBackup({ progress: [invalidSession] });
            assert.equal(Storage.importAll(inRealm(context, backup)), false);
        });
    }

    it('lehnt widersprüchliche Zeichenzähler ab', () => {
        const backup = emptyBackup({
            progress: [sampleSession({ totalChars: 14, correctChars: 14, incorrectChars: 1 })]
        });
        assert.equal(Storage.importAll(inRealm(context, backup)), false);
    });

    it('blockiert persistente HTML-Injection in Level-Bestwerten', () => {
        const backup = emptyBackup({
            levels: {
                buchfuehrung: {
                    unlockedLevels: [1],
                    completedLevels: {
                        '1_normal': {
                            accuracy: 100,
                            wpm: '<img src=x onerror=alert(1)>',
                            completedAt: '2026-06-15T10:00:00.000Z'
                        }
                    }
                }
            }
        });
        assert.equal(Storage.importAll(inRealm(context, backup)), false);
        assert.deepEqual(clone(Storage.getLevels()), {});
    });

    it('lehnt strukturell defekte Leveldaten ab', () => {
        const backup = emptyBackup({
            levels: { buchfuehrung: { unlockedLevels: {}, completedLevels: {} } }
        });
        assert.equal(Storage.importAll(inRealm(context, backup)), false);
    });

    it('lehnt negative XP ab und rekonstruiert das Userlevel aus total', () => {
        assert.equal(Storage.importAll(inRealm(context, emptyBackup({ xp: { total: -1 } }))), false);
        assert.equal(
            Storage.importAll(inRealm(context, emptyBackup({ xp: { total: 57, userLevel: 99 } }))),
            true
        );
        assert.deepEqual(clone(Storage.getXP()), { total: 57, userLevel: 2 });
    });

    it('lehnt unbekannte Achievement-IDs beim Import ab', () => {
        const backup = emptyBackup({
            achievements: { evil_badge: { unlockedAt: '2026-06-15T10:00:00.000Z' } }
        });
        assert.equal(Storage.importAll(inRealm(context, backup)), false);
        assert.deepEqual(clone(Storage.getAchievements()), {});
    });

    it('ersetzt alle Bereiche bei einem vollständigen Import', () => {
        Storage.save('unrelated', 'bleibt');
        const backup = emptyBackup({
            progress: [sampleSession()],
            achievements: { first_exercise: { unlockedAt: '2026-06-15T10:00:00.000Z' } },
            levels: {
                buchfuehrung: {
                    unlockedLevels: [2, 1, 2],
                    completedLevels: {
                        '1_normal': {
                            accuracy: 100,
                            wpm: 42,
                            completedAt: '2026-06-15T10:00:00.000Z'
                        }
                    }
                }
            },
            calendar: {
                '2026-06-15': {
                    totalSeconds: 60,
                    exercises: 1,
                    firstAt: '2026-06-15T10:00:00.000Z',
                    lastAt: '2026-06-15T10:01:00.000Z'
                }
            },
            xp: { total: 57 }
        });

        assert.equal(Storage.importAll(inRealm(context, backup)), true);
        assert.equal(Storage.getProgress().length, 1);
        assert.deepEqual(clone(Storage.getLevels().buchfuehrung.unlockedLevels), [1, 2]);
        assert.equal(Storage.getCalendarData()['2026-06-15'].exercises, 1);
        assert.equal(Storage.load('unrelated'), 'bleibt');
    });

    it('rollt einen Import nach Schreibfehler vollständig zurück', () => {
        const original = emptyBackup({ xp: { total: 57 } });
        assert.equal(Storage.importAll(inRealm(context, original)), true);
        const before = storage.dump();
        storage.failNextSetFor('tippTrainer_calendar');

        const replacement = emptyBackup({ progress: [sampleSession()], xp: { total: 500 } });
        assert.equal(Storage.importAll(inRealm(context, replacement)), false);
        assert.deepEqual(storage.dump(), before);
    });

    it('holt einen unterbrochenen Rollback vor dem nächsten Lesen nach', () => {
        const original = emptyBackup({ xp: { total: 57 } });
        assert.equal(Storage.importAll(inRealm(context, original)), true);
        storage.failSetSequence(['tippTrainer_calendar', 'tippTrainer_progress']);

        const replacement = emptyBackup({ progress: [sampleSession()], xp: { total: 500 } });
        assert.equal(Storage.importAll(inRealm(context, replacement)), false);

        assert.equal(Storage.getProgress().length, 0);
        assert.deepEqual(clone(Storage.getXP()), { total: 57, userLevel: 2 });
        assert.equal(storage.getItem('tippTrainer___transaction_journal__'), null);
    });

    it('begrenzt die XP-Anzeige auf Level 50 und zeigt dort einen vollen Balken', () => {
        const threshold = Storage.getCumulativeXPForLevel(50);
        assert.equal(Storage.saveXP(inRealm(context, { total: threshold, userLevel: 1 })), true);
        assert.equal(Storage.getXP().userLevel, 50);
        assert.equal(Storage.getXPThresholdForLevel(50), threshold);
    });

    it('löscht nur die bekannten App-Daten', () => {
        Storage.importAll(inRealm(context, emptyBackup({ progress: [sampleSession()] })));
        Storage.save('unrelated', 'bleibt');
        Storage.clearAll();
        assert.equal(Storage.getProgress().length, 0);
        assert.equal(Storage.load('unrelated'), 'bleibt');
    });

    it('liest und löscht vorhandene Daten auch wenn neue Writes am Quota scheitern', () => {
        storage.setItem('tippTrainer_xp', JSON.stringify({ total: 57, userLevel: 2 }));
        const originalSetItem = storage.setItem;
        storage.setItem = (key, value) => {
            if (storage.getItem(key) === null) throw new Error('Quota exceeded');
            originalSetItem(key, value);
        };

        assert.deepEqual(clone(Storage.getXP()), { total: 57, userLevel: 2 });
        assert.equal(Storage.clearAll(), true);
        assert.equal(storage.getItem('tippTrainer_xp'), null);
    });
});
