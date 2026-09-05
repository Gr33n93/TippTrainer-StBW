'use strict';

const Storage = (() => {
    const PREFIX = 'tippTrainer_';
    const BACKUP_VERSION = 1;
    const DEFAULT_TARGET_DATE = '';
    const TOPICS = new Set(['buchfuehrung', 'steuerrecht', 'bilanzen', 'klr']);
    const DIFFICULTIES = new Set(['leicht', 'normal', 'schwer', 'sehrSchwer']);
    const ACHIEVEMENT_IDS = new Set([
        'first_exercise',
        'first_perfect',
        'speed_40',
        'speed_60',
        'speed_80',
        'speed_100',
        'accuracy_95',
        'accuracy_98',
        'accuracy_streak_10',
        'streak_3',
        'streak_7',
        'streak_14',
        'streak_30',
        'streak_50',
        'topic_buchfuehrung',
        'topic_steuerrecht',
        'topic_bilanzen',
        'topic_klr',
        'all_topics',
        'night_owl',
        'early_bird',
        'marathon',
        'exercises_10',
        'exercises_50',
        'exercises_100',
        'all_levels',
        'hard_mode',
        'hard_perfect',
        'extreme_mode',
        'extreme_perfect',
        'weekend_warrior',
        'level_5_reached'
    ]);
    const MAX_LEVEL = 10;
    const KEYS = {
        PROGRESS: 'progress',
        ACHIEVEMENTS: 'achievements',
        LEVELS: 'levels',
        SETTINGS: 'settings',
        CALENDAR: 'calendar',
        XP: 'xp'
    };

    // XP-Kurve: kumulativ, Level N braucht sum(50 * 1.15^i) fuer i=1..N-1
    const XP_BASE = 50;
    const XP_GROWTH = 1.15;
    const XP_MAX_LEVEL = 50;
    const JOURNAL_KEY = `${PREFIX}__transaction_journal__`;
    const TRANSACTION_ABORT = Symbol('transaction-abort');
    let transactionWrites = null;
    let transactionRejected = false;

    function _key(name) {
        return PREFIX + name;
    }

    function _recoverPendingTransaction() {
        let raw;
        try {
            raw = localStorage.getItem(JOURNAL_KEY);
            if (raw === null) return true;

            const journal = JSON.parse(raw);
            const valid =
                _isPlainObject(journal) &&
                ['prepared', 'committed'].includes(journal.phase) &&
                _isPlainObject(journal.previous) &&
                Object.entries(journal.previous).every(
                    ([key, value]) =>
                        key.startsWith(PREFIX) &&
                        key !== JOURNAL_KEY &&
                        (value === null || typeof value === 'string')
                );
            if (!valid) {
                localStorage.removeItem(JOURNAL_KEY);
                return true;
            }

            if (journal.phase === 'prepared') {
                for (const [key, oldValue] of Object.entries(journal.previous)) {
                    if (oldValue === null) localStorage.removeItem(key);
                    else localStorage.setItem(key, oldValue);
                }
            }
            localStorage.removeItem(JOURNAL_KEY);
            return true;
        } catch (error) {
            console.error('Offene Speichertransaktion konnte nicht wiederhergestellt werden:', error);
            return false;
        }
    }

    function _rejectWrite() {
        if (transactionWrites) transactionRejected = true;
        return false;
    }

    function save(key, data) {
        let serialized;
        try {
            serialized = JSON.stringify(data);
            if (serialized === undefined) return _rejectWrite();
        } catch (e) {
            console.error('Fehler beim Serialisieren:', e);
            return _rejectWrite();
        }

        const storageKey = _key(key);
        if (transactionWrites) {
            transactionWrites.set(storageKey, serialized);
            return true;
        }
        if (!_recoverPendingTransaction()) {
            console.warn('LocalStorage nicht verfügbar');
            return false;
        }
        try {
            localStorage.setItem(storageKey, serialized);
            return true;
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
            return false;
        }
    }

    function load(key, fallback = null) {
        const storageKey = _key(key);
        if (!transactionWrites) {
            if (!_recoverPendingTransaction()) return fallback;
        }
        try {
            const raw = transactionWrites?.has(storageKey)
                ? transactionWrites.get(storageKey)
                : localStorage.getItem(storageKey);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            console.error('Fehler beim Laden:', e);
            return fallback;
        }
    }

    function remove(key) {
        const storageKey = _key(key);
        if (transactionWrites) {
            transactionWrites.set(storageKey, null);
            return true;
        }
        if (!_recoverPendingTransaction()) return false;
        try {
            localStorage.removeItem(storageKey);
            return true;
        } catch (e) {
            console.error('Fehler beim Löschen:', e);
            return false;
        }
    }

    function getProgress() {
        const sessions = load(KEYS.PROGRESS, []);
        if (!Array.isArray(sessions)) return [];
        return sessions.filter(_validSession).map(_sanitizeSession);
    }

    function saveProgress(sessions) {
        if (!Array.isArray(sessions) || sessions.length > 10000 || !sessions.every(_validSession)) {
            return _rejectWrite();
        }
        return save(KEYS.PROGRESS, sessions.map(_sanitizeSession));
    }

    function addSession(session) {
        const sessions = getProgress();
        sessions.push(session);
        return saveProgress(sessions);
    }

    function getAchievements() {
        return _sanitizeAchievements(load(KEYS.ACHIEVEMENTS, {}), false) || {};
    }

    function saveAchievements(achievements) {
        const clean = _sanitizeAchievements(achievements, true);
        return clean ? save(KEYS.ACHIEVEMENTS, clean) : _rejectWrite();
    }

    function unlockAchievement(id) {
        const achievements = getAchievements();
        if (achievements[id]) return false;
        achievements[id] = { unlockedAt: new Date().toISOString() };
        saveAchievements(achievements);
        return true;
    }

    function getLevels() {
        return _sanitizeLevels(load(KEYS.LEVELS, {}), false) || {};
    }

    function saveLevels(levels) {
        const clean = _sanitizeLevels(levels, true);
        return clean ? save(KEYS.LEVELS, clean) : _rejectWrite();
    }

    function getSettings() {
        return _sanitizeSettings(load(KEYS.SETTINGS, {}), false);
    }

    function saveSettings(settings) {
        const clean = _sanitizeSettings(settings, true);
        return clean ? save(KEYS.SETTINGS, clean) : _rejectWrite();
    }

    function getCalendarData() {
        return _sanitizeCalendar(load(KEYS.CALENDAR, {}), false) || {};
    }

    function saveCalendarData(data) {
        const clean = _sanitizeCalendar(data, true);
        return clean ? save(KEYS.CALENDAR, clean) : _rejectWrite();
    }

    function getXP() {
        return _sanitizeXP(load(KEYS.XP, {})) || { total: 0, userLevel: 1 };
    }

    function saveXP(xp) {
        const clean = _sanitizeXP(xp);
        return clean ? save(KEYS.XP, clean) : _rejectWrite();
    }

    function addXP(amount) {
        const xp = getXP();
        const total = xp.total + amount;
        if (!Number.isSafeInteger(amount) || amount < 0 || !Number.isSafeInteger(total)) {
            _rejectWrite();
            return null;
        }
        xp.total = total;
        xp.userLevel = _userLevelForXP(xp.total);
        return saveXP(xp) ? xp : null;
    }

    function _userLevelForXP(total) {
        const thresholds = _xpThresholds();
        let level = 1;
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (total >= thresholds[i]) {
                level = i + 2;
                break;
            }
        }
        return Math.min(level, XP_MAX_LEVEL);
    }

    function _xpThresholds() {
        const thresholds = [];
        let cumulative = 0;
        for (let i = 1; i <= XP_MAX_LEVEL; i++) {
            cumulative += Math.floor(XP_BASE * Math.pow(XP_GROWTH, i));
            thresholds.push(cumulative);
        }
        return thresholds;
    }

    function getXPThresholdForLevel(level) {
        if (level >= XP_MAX_LEVEL) return getCumulativeXPForLevel(XP_MAX_LEVEL);
        const thresholds = _xpThresholds();
        if (level <= 0) return 0;
        if (level > thresholds.length) return thresholds[thresholds.length - 1];
        return thresholds[level - 1];
    }

    function getCumulativeXPForLevel(level) {
        let cumulative = 0;
        for (let i = 1; i < level; i++) {
            cumulative += Math.floor(XP_BASE * Math.pow(XP_GROWTH, i));
        }
        return cumulative;
    }

    function exportAll() {
        return {
            version: BACKUP_VERSION,
            progress: getProgress(),
            achievements: getAchievements(),
            levels: getLevels(),
            settings: getSettings(),
            calendar: getCalendarData(),
            xp: getXP(),
            exportedAt: new Date().toISOString()
        };
    }

    function _validSession(s) {
        return (
            _isPlainObject(s) &&
            _isDateTime(s.timestamp) &&
            TOPICS.has(s.topic) &&
            Number.isInteger(s.level) &&
            s.level >= 1 &&
            s.level <= MAX_LEVEL &&
            DIFFICULTIES.has(s.difficulty) &&
            Number.isInteger(s.wpm) &&
            _isNumberInRange(s.wpm, 0, 2000) &&
            Number.isInteger(s.accuracy) &&
            _isNumberInRange(s.accuracy, 0, 100) &&
            Number.isInteger(s.totalChars) &&
            s.totalChars >= 0 &&
            (s.targetChars === undefined ||
                (Number.isInteger(s.targetChars) && s.targetChars >= 0 && s.targetChars <= s.totalChars)) &&
            _isNumberInRange(s.elapsedSeconds, 0, 604800) &&
            Number.isInteger(s.correctChars) &&
            _isNumberInRange(s.correctChars, 0, s.totalChars) &&
            Number.isInteger(s.incorrectChars) &&
            _isNumberInRange(s.incorrectChars, 0, s.totalChars) &&
            s.correctChars + s.incorrectChars === s.totalChars &&
            Number.isInteger(s.cpm) &&
            _isNumberInRange(s.cpm, 0, 10000) &&
            Number.isInteger(s.avgTimePerChar) &&
            _isNumberInRange(s.avgTimePerChar, 0, 604800000) &&
            (s.id === undefined || (typeof s.id === 'string' && s.id.length <= 100)) &&
            (s.text === undefined || (typeof s.text === 'string' && s.text.length <= 1000000))
        );
    }

    function _sanitizeSession(session) {
        const allowed = [
            'id',
            'text',
            'targetChars',
            'totalChars',
            'correctChars',
            'incorrectChars',
            'accuracy',
            'wpm',
            'cpm',
            'elapsedSeconds',
            'avgTimePerChar',
            'timestamp',
            'topic',
            'level',
            'difficulty'
        ];
        return Object.fromEntries(
            allowed.filter((key) => session[key] !== undefined).map((key) => [key, session[key]])
        );
    }

    function _sanitizeAchievements(value, strict) {
        if (!_isPlainObject(value)) return null;
        const result = {};
        for (const [id, record] of Object.entries(value)) {
            const valid = ACHIEVEMENT_IDS.has(id) && _isPlainObject(record) && _isDateTime(record.unlockedAt);
            if (!valid) {
                if (strict) return null;
                continue;
            }
            result[id] = { unlockedAt: record.unlockedAt };
        }
        return result;
    }

    function _sanitizeLevels(value, strict) {
        if (!_isPlainObject(value)) return null;
        const result = {};
        for (const [topic, topicState] of Object.entries(value)) {
            if (!TOPICS.has(topic) || !_isPlainObject(topicState)) {
                if (strict) return null;
                continue;
            }
            const unlocked = topicState.unlockedLevels;
            const completions = topicState.completedLevels;
            if (
                !Array.isArray(unlocked) ||
                !unlocked.includes(1) ||
                !unlocked.every((level) => Number.isInteger(level) && level >= 1 && level <= MAX_LEVEL) ||
                !_isPlainObject(completions)
            ) {
                if (strict) return null;
                continue;
            }

            const cleanCompletions = {};
            let invalidCompletion = false;
            for (const [key, record] of Object.entries(completions)) {
                const match = /^(10|[1-9])_(leicht|normal|schwer|sehrSchwer)$/.exec(key);
                const valid =
                    match &&
                    _isPlainObject(record) &&
                    _isNumberInRange(record.accuracy, 0, 100) &&
                    _isNumberInRange(record.wpm, 0, 2000) &&
                    _isDateTime(record.completedAt);
                if (!valid) {
                    invalidCompletion = true;
                    if (strict) break;
                    continue;
                }
                cleanCompletions[key] = {
                    accuracy: record.accuracy,
                    wpm: record.wpm,
                    completedAt: record.completedAt
                };
            }
            if (invalidCompletion && strict) return null;
            result[topic] = {
                unlockedLevels: [...new Set(unlocked)].sort((a, b) => a - b),
                completedLevels: cleanCompletions
            };
        }
        return result;
    }

    function _defaultSettings() {
        return {
            difficulty: 'normal',
            topic: null,
            level: null,
            soundEnabled: true,
            targetDate: DEFAULT_TARGET_DATE
        };
    }

    function _sanitizeSettings(value, strict) {
        if (!_isPlainObject(value)) return strict ? null : _defaultSettings();
        const defaults = _defaultSettings();
        const valid =
            (value.difficulty === undefined || DIFFICULTIES.has(value.difficulty)) &&
            (value.topic === undefined || value.topic === null || TOPICS.has(value.topic)) &&
            (value.level === undefined ||
                value.level === null ||
                (Number.isInteger(value.level) && value.level >= 1 && value.level <= MAX_LEVEL)) &&
            (value.soundEnabled === undefined || typeof value.soundEnabled === 'boolean') &&
            (value.targetDate === undefined || value.targetDate === '' || _isDateOnly(value.targetDate));
        if (!valid) return strict ? null : defaults;
        return {
            difficulty: value.difficulty ?? defaults.difficulty,
            topic: value.topic ?? defaults.topic,
            level: value.level ?? defaults.level,
            soundEnabled: value.soundEnabled ?? defaults.soundEnabled,
            targetDate: value.targetDate ?? defaults.targetDate
        };
    }

    function _sanitizeCalendar(value, strict) {
        if (!_isPlainObject(value)) return null;
        const result = {};
        for (const [date, day] of Object.entries(value)) {
            const valid =
                _isDateOnly(date) &&
                _isPlainObject(day) &&
                _isNumberInRange(day.totalSeconds, 0, 604800000) &&
                Number.isInteger(day.exercises) &&
                day.exercises >= 0 &&
                _isDateTime(day.firstAt) &&
                (day.lastAt === undefined || _isDateTime(day.lastAt));
            if (!valid) {
                if (strict) return null;
                continue;
            }
            result[date] = {
                totalSeconds: day.totalSeconds,
                exercises: day.exercises,
                firstAt: day.firstAt,
                ...(day.lastAt === undefined ? {} : { lastAt: day.lastAt })
            };
        }
        return result;
    }

    function _sanitizeXP(value) {
        if (!_isPlainObject(value) || !Number.isSafeInteger(value.total) || value.total < 0) return null;
        return { total: value.total, userLevel: _userLevelForXP(value.total) };
    }

    function _isPlainObject(value) {
        if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
        const prototype = Object.getPrototypeOf(value);
        return prototype === Object.prototype || prototype === null;
    }

    function _isNumberInRange(value, min, max) {
        return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
    }

    function _isDateTime(value) {
        if (
            typeof value !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ||
            !Number.isFinite(Date.parse(value))
        ) {
            return false;
        }
        return new Date(value).toISOString() === value;
    }

    function _isDateOnly(value) {
        if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }

    function _validateBackup(data) {
        const sections = ['progress', 'achievements', 'levels', 'settings', 'calendar', 'xp'];
        if (
            !_isPlainObject(data) ||
            !sections.every((key) => Object.prototype.hasOwnProperty.call(data, key)) ||
            (data.version !== undefined && data.version !== BACKUP_VERSION) ||
            (data.exportedAt !== undefined && !_isDateTime(data.exportedAt)) ||
            !Array.isArray(data.progress) ||
            data.progress.length > 10000 ||
            !data.progress.every(_validSession)
        ) {
            return null;
        }

        const backup = {
            progress: data.progress.map(_sanitizeSession),
            achievements: _sanitizeAchievements(data.achievements, true),
            levels: _sanitizeLevels(data.levels, true),
            settings: _sanitizeSettings(data.settings, true),
            calendar: _sanitizeCalendar(data.calendar, true),
            xp: _sanitizeXP(data.xp)
        };
        return Object.values(backup).every((value) => value !== null) ? backup : null;
    }

    function importAll(data) {
        const backup = _validateBackup(data);
        if (!backup || !_recoverPendingTransaction()) return false;

        return _commitWrites(
            new Map([
                [_key(KEYS.PROGRESS), JSON.stringify(backup.progress)],
                [_key(KEYS.ACHIEVEMENTS), JSON.stringify(backup.achievements)],
                [_key(KEYS.LEVELS), JSON.stringify(backup.levels)],
                [_key(KEYS.SETTINGS), JSON.stringify(backup.settings)],
                [_key(KEYS.CALENDAR), JSON.stringify(backup.calendar)],
                [_key(KEYS.XP), JSON.stringify(backup.xp)]
            ])
        );
    }

    /**
     * Fuehrt mehrere Storage-Schreibvorgaenge als logische Einheit aus.
     * Alle Werte werden zuerst im Speicher vorbereitet und erst danach
     * gemeinsam geschrieben. Scheitert ein Schreibvorgang, wird der zuvor
     * gespeicherte Stand bestmoeglich wiederhergestellt.
     */
    function _commitWrites(writes) {
        try {
            const previous = Object.fromEntries(
                [...writes.keys()].map((key) => [key, localStorage.getItem(key)])
            );
            const prepared = JSON.stringify({ phase: 'prepared', previous });
            localStorage.setItem(JOURNAL_KEY, prepared);
            for (const [key, serialized] of writes) {
                if (serialized === null) localStorage.removeItem(key);
                else localStorage.setItem(key, serialized);
            }
            localStorage.setItem(JOURNAL_KEY, JSON.stringify({ phase: 'committed', previous: {} }));
        } catch (error) {
            console.error('Fehler beim Speichern, vorheriger Stand wird wiederhergestellt:', error);
            _recoverPendingTransaction();
            return false;
        }

        try {
            localStorage.removeItem(JOURNAL_KEY);
        } catch (error) {
            console.error('Abgeschlossenes Speicherjournal konnte nicht entfernt werden:', error);
        }
        return true;
    }

    function runTransaction(operation) {
        if (typeof operation !== 'function' || transactionWrites || !_recoverPendingTransaction()) {
            return { committed: false, value: null };
        }

        transactionWrites = new Map();
        transactionRejected = false;
        let value;
        try {
            value = operation(() => TRANSACTION_ABORT);
        } catch (error) {
            transactionWrites = null;
            transactionRejected = false;
            throw error;
        }

        const writes = transactionWrites;
        const rejected = transactionRejected;
        transactionWrites = null;
        transactionRejected = false;
        if (value === TRANSACTION_ABORT || rejected) return { committed: false, value: null };
        return { committed: _commitWrites(writes), value };
    }

    function clearAll() {
        return Object.values(KEYS).map(remove).every(Boolean);
    }

    return {
        KEYS,
        BACKUP_VERSION,
        DEFAULT_TARGET_DATE,
        save,
        load,
        getProgress,
        saveProgress,
        addSession,
        getAchievements,
        saveAchievements,
        unlockAchievement,
        getLevels,
        saveLevels,
        getSettings,
        saveSettings,
        getCalendarData,
        saveCalendarData,
        getXP,
        saveXP,
        addXP,
        getXPThresholdForLevel,
        getCumulativeXPForLevel,
        exportAll,
        importAll,
        runTransaction,
        clearAll
    };
})();
