'use strict';

const Storage = (() => {
    const PREFIX = 'tippTrainer_';
    const KEYS = {
        PROGRESS: 'progress',
        ACHIEVEMENTS: 'achievements',
        LEVELS: 'levels',
        SETTINGS: 'settings',
        CALENDAR: 'calendar',
        XP: 'xp'
    };

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
            targetDate: '2026-06-01'
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
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (xp.total >= thresholds[i]) {
                xp.userLevel = i + 2;
                break;
            }
        }
        saveXP(xp);
        return xp;
    }

    function _xpThresholds() {
        const thresholds = [];
        let cumulative = 0;
        for (let i = 1; i <= 50; i++) {
            cumulative += Math.floor(50 * Math.pow(1.15, i));
            thresholds.push(cumulative);
        }
        return thresholds;
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

    function importAll(data) {
        if (!data || typeof data !== 'object') return false;
        let success = true;
        if (Array.isArray(data.progress)) success = saveProgress(data.progress) && success;
        if (data.achievements && typeof data.achievements === 'object') success = saveAchievements(data.achievements) && success;
        if (data.levels && typeof data.levels === 'object') success = saveLevels(data.levels) && success;
        if (data.settings && typeof data.settings === 'object') success = saveSettings(data.settings) && success;
        if (data.calendar && typeof data.calendar === 'object') success = saveCalendarData(data.calendar) && success;
        if (data.xp && typeof data.xp === 'object' && typeof data.xp.total === 'number') success = saveXP(data.xp) && success;
        return success;
    }

    function clearAll() {
        Object.values(KEYS).forEach(key => remove(key));
    }

    return {
        KEYS,
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
        exportAll,
        importAll,
        clearAll
    };
})();
