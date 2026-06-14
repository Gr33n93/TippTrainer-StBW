'use strict';

const Storage = (() => {
    const PREFIX = 'tippTrainer_';
    const DEFAULT_TARGET_DATE = '2026-06-01';
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

    function _key(name) {
        return PREFIX + name;
    }

    function _isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    function save(key, data) {
        if (!_isAvailable()) {
            console.warn('LocalStorage nicht verfügbar');
            return false;
        }
        try {
            localStorage.setItem(_key(key), JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
            return false;
        }
    }

    function load(key, fallback = null) {
        if (!_isAvailable()) {
            return fallback;
        }
        try {
            const raw = localStorage.getItem(_key(key));
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            console.error('Fehler beim Laden:', e);
            return fallback;
        }
    }

    function remove(key) {
        if (!_isAvailable()) return false;
        try {
            localStorage.removeItem(_key(key));
            return true;
        } catch (e) {
            console.error('Fehler beim Löschen:', e);
            return false;
        }
    }

    function getProgress() {
        return load(KEYS.PROGRESS, []);
    }

    function saveProgress(sessions) {
        return save(KEYS.PROGRESS, sessions);
    }

    function addSession(session) {
        const sessions = getProgress();
        sessions.push(session);
        return saveProgress(sessions);
    }

    function getAchievements() {
        return load(KEYS.ACHIEVEMENTS, {});
    }

    function saveAchievements(achievements) {
        return save(KEYS.ACHIEVEMENTS, achievements);
    }

    function unlockAchievement(id) {
        const achievements = getAchievements();
        if (achievements[id]) return false;
        achievements[id] = { unlockedAt: new Date().toISOString() };
        saveAchievements(achievements);
        return true;
    }

    function getLevels() {
        return load(KEYS.LEVELS, {});
    }

    function saveLevels(levels) {
        return save(KEYS.LEVELS, levels);
    }

    function getSettings() {
        return load(KEYS.SETTINGS, {
            difficulty: 'normal',
            topic: null,
            level: null,
            soundEnabled: true,
            targetDate: DEFAULT_TARGET_DATE
        });
    }

    function saveSettings(settings) {
        return save(KEYS.SETTINGS, settings);
    }

    function getCalendarData() {
        return load(KEYS.CALENDAR, {});
    }

    function saveCalendarData(data) {
        return save(KEYS.CALENDAR, data);
    }

    function getXP() {
        return load(KEYS.XP, { total: 0, userLevel: 1 });
    }

    function saveXP(xp) {
        return save(KEYS.XP, xp);
    }

    function addXP(amount) {
        const xp = getXP();
        xp.total += amount;
        const thresholds = _xpThresholds();
        let level = 1;
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (xp.total >= thresholds[i]) {
                level = i + 2;
                break;
            }
        }
        xp.userLevel = Math.min(level, XP_MAX_LEVEL);
        saveXP(xp);
        return xp;
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
        if (!s || typeof s !== 'object') return false;
        if (typeof s.timestamp !== 'string' || !s.timestamp) return false;
        if (typeof s.wpm !== 'number' && typeof s.wpm !== 'undefined') return false;
        if (typeof s.accuracy !== 'number' && typeof s.accuracy !== 'undefined') return false;
        if (typeof s.totalChars !== 'number' && typeof s.totalChars !== 'undefined') return false;
        if (typeof s.elapsedSeconds !== 'number' && typeof s.elapsedSeconds !== 'undefined') return false;
        // topic, level, difficulty are optional but must be simple types if present
        if (s.topic != null && typeof s.topic !== 'string') return false;
        if (s.level != null && typeof s.level !== 'number') return false;
        if (s.difficulty != null && typeof s.difficulty !== 'string') return false;
        return true;
    }

    function importAll(data) {
        if (!data || typeof data !== 'object') return false;
        let success = true;
        if (Array.isArray(data.progress)) {
            const validSessions = data.progress.filter(_validSession);
            success = saveProgress(validSessions) && success;
        }
        if (data.achievements && typeof data.achievements === 'object')
            success = saveAchievements(data.achievements) && success;
        if (data.levels && typeof data.levels === 'object') success = saveLevels(data.levels) && success;
        if (data.settings && typeof data.settings === 'object')
            success = saveSettings(data.settings) && success;
        if (data.calendar && typeof data.calendar === 'object')
            success = saveCalendarData(data.calendar) && success;
        if (data.xp && typeof data.xp === 'object' && typeof data.xp.total === 'number')
            success = saveXP(data.xp) && success;
        return success;
    }

    function clearAll() {
        Object.values(KEYS).forEach((key) => remove(key));
    }

    return {
        KEYS,
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
        clearAll
    };
})();
