'use strict';

const Progress = (() => {
    function _getTargetDate() {
        const settings = Storage.getSettings();
        const dateStr = settings.targetDate || '2026-06-01';
        return new Date(dateStr + 'T00:00:00');
    }

    function addSession(sessionData) {
        const session = {
            id: _generateId(),
            ...sessionData,
            timestamp: new Date().toISOString()
        };

        Storage.addSession(session);
        return session;
    }

    function _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function getAllSessions() {
        return Storage.getProgress();
    }

    function getSessionsByTopic(topic) {
        return getAllSessions().filter(s => s.topic === topic);
    }

    function getSessionsByLevel(topic, level) {
        return getAllSessions().filter(s => s.topic === topic && s.level === level);
    }

    function getSessionsByDifficulty(difficulty) {
        return getAllSessions().filter(s => s.difficulty === difficulty);
    }

    function getSessionsByTopicLevelDifficulty(topic, level, difficulty) {
        return getAllSessions().filter(
            s => s.topic === topic && s.level === level && s.difficulty === difficulty
        );
    }

    function getSessionsInRange(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return getAllSessions().filter(s => {
            const t = new Date(s.timestamp).getTime();
            return t >= start && t <= end;
        });
    }

    function getRecentSessions(count = 10) {
        const sessions = getAllSessions();
        return sessions.slice(-count).reverse();
    }

    function getAverageWPM(topic, level, difficulty) {
        const sessions = getSessionsByTopicLevelDifficulty(topic, level, difficulty);
        if (sessions.length === 0) return 0;
        const sum = sessions.reduce((acc, s) => acc + s.wpm, 0);
        return Math.round(sum / sessions.length);
    }

    function getAverageAccuracy(topic, level, difficulty) {
        const sessions = getSessionsByTopicLevelDifficulty(topic, level, difficulty);
        if (sessions.length === 0) return 0;
        const sum = sessions.reduce((acc, s) => acc + s.accuracy, 0);
        return Math.round((sum / sessions.length) * 100) / 100;
    }

    function getBestWPM(topic, level, difficulty) {
        const sessions = difficulty
            ? getSessionsByTopicLevelDifficulty(topic, level, difficulty)
            : getSessionsByLevel(topic, level);
        if (sessions.length === 0) return 0;
        return Math.max(...sessions.map(s => s.wpm));
    }

    function getBestAccuracy(topic, level, difficulty) {
        const sessions = difficulty
            ? getSessionsByTopicLevelDifficulty(topic, level, difficulty)
            : getSessionsByLevel(topic, level);
        if (sessions.length === 0) return 0;
        return Math.max(...sessions.map(s => s.accuracy));
    }

    function getOverallStats() {
        const sessions = getAllSessions();
        if (sessions.length === 0) {
            return {
                totalSessions: 0,
                totalChars: 0,
                avgWPM: 0,
                avgAccuracy: 0,
                bestWPM: 0,
                totalMinutes: 0
            };
        }

        const totalChars = sessions.reduce((acc, s) => acc + (s.totalChars || 0), 0);
        const avgWPM = Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length);
        const avgAccuracy = Math.round(
            (sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) * 100
        ) / 100;
        const bestWPM = Math.max(...sessions.map(s => s.wpm));
        const totalSeconds = sessions.reduce((acc, s) => acc + (s.elapsedSeconds || 0), 0);

        return {
            totalSessions: sessions.length,
            totalChars,
            avgWPM,
            avgAccuracy,
            bestWPM,
            totalMinutes: Math.round(totalSeconds / 60)
        };
    }

    function getWPMHistory(topic, level, difficulty) {
        const sessions = difficulty
            ? getSessionsByTopicLevelDifficulty(topic, level, difficulty)
            : (topic ? getSessionsByLevel(topic, level) : getAllSessions());

        return sessions.map(s => ({
            date: s.timestamp,
            wpm: s.wpm,
            accuracy: s.accuracy
        }));
    }

    function getDaysUntilTarget() {
        const targetDate = _getTargetDate();
        const now = new Date();
        const diff = targetDate - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    function getTargetDate() {
        return _getTargetDate();
    }

    function getWeeklyProgress() {
        const sessions = getAllSessions();
        const weeks = {};

        for (const session of sessions) {
            const date = new Date(session.timestamp);
            const weekStart = _getWeekStart(date);
            const key = weekStart.toISOString().split('T')[0];

            if (!weeks[key]) {
                weeks[key] = { sessions: 0, totalWPM: 0, totalAccuracy: 0, totalMinutes: 0 };
            }

            weeks[key].sessions++;
            weeks[key].totalWPM += session.wpm;
            weeks[key].totalAccuracy += session.accuracy;
            weeks[key].totalMinutes += (session.elapsedSeconds || 0) / 60;
        }

        return Object.entries(weeks).map(([week, data]) => ({
            week,
            sessions: data.sessions,
            avgWPM: Math.round(data.totalWPM / data.sessions),
            avgAccuracy: Math.round((data.totalAccuracy / data.sessions) * 100) / 100,
            totalMinutes: Math.round(data.totalMinutes)
        }));
    }

    function _getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function getProgressForLevelDisplay(topic, level, difficulty) {
        const sessions = getSessionsByTopicLevelDifficulty(topic, level, difficulty);
        const thresholds = Levels.getThresholds(difficulty);

        if (sessions.length === 0) {
            return {
                attempts: 0,
                avgWPM: 0,
                avgAccuracy: 0,
                bestWPM: 0,
                bestAccuracy: 0,
                passed: false,
                targetWPM: thresholds.minWPM,
                targetAccuracy: thresholds.minAccuracy
            };
        }

        const latest = sessions[sessions.length - 1];
        return {
            attempts: sessions.length,
            avgWPM: Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length),
            avgAccuracy: Math.round(
                (sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length) * 100
            ) / 100,
            bestWPM: Math.max(...sessions.map(s => s.wpm)),
            bestAccuracy: Math.max(...sessions.map(s => s.accuracy)),
            latestWPM: latest.wpm,
            latestAccuracy: latest.accuracy,
            passed: Levels.isLevelCompleted(topic, level, difficulty),
            targetWPM: thresholds.minWPM,
            targetAccuracy: thresholds.minAccuracy
        };
    }

    return {
        addSession,
        getAllSessions,
        getSessionsByTopic,
        getSessionsByLevel,
        getSessionsByDifficulty,
        getSessionsByTopicLevelDifficulty,
        getSessionsInRange,
        getRecentSessions,
        getAverageWPM,
        getAverageAccuracy,
        getBestWPM,
        getBestAccuracy,
        getOverallStats,
        getWPMHistory,
        getDaysUntilTarget,
        getTargetDate,
        getWeeklyProgress,
        getProgressForLevelDisplay
    };
})();
