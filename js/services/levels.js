'use strict';

const Levels = (() => {
    const MAX_LEVEL = 10;
    const DIFFICULTIES = ['leicht', 'normal', 'schwer', 'sehrSchwer'];
    const COMPLETIONS_PER_TOPIC = MAX_LEVEL * DIFFICULTIES.length;

    const THRESHOLDS = {
        leicht: { minAccuracy: 85, minWPM: 20 },
        normal: { minAccuracy: 90, minWPM: 35 },
        schwer: { minAccuracy: 95, minWPM: 50 },
        sehrSchwer: { minAccuracy: 97, minWPM: 75 }
    };

    const XP_REWARD = {
        leicht: { base: 10, perWord: 0.5, accuracyBonus: 15 },
        normal: { base: 30, perWord: 0.8, accuracyBonus: 25 },
        schwer: { base: 60, perWord: 1.2, accuracyBonus: 40 },
        sehrSchwer: { base: 100, perWord: 1.8, accuracyBonus: 60 }
    };

    function _getState() {
        return Storage.getLevels();
    }

    function _saveState(state) {
        Storage.saveLevels(state);
    }

    function _initTopic(topic) {
        const state = _getState();
        if (!state[topic]) {
            state[topic] = {
                unlockedLevels: [1],
                completedLevels: {}
            };
            _saveState(state);
        }
        return state[topic];
    }

    function isLevelUnlocked(topic, level) {
        const topicState = _initTopic(topic);
        return topicState.unlockedLevels.includes(level);
    }

    function isLevelCompleted(topic, level, difficulty) {
        const topicState = _initTopic(topic);
        const key = `${level}_${difficulty}`;
        return !!topicState.completedLevels[key];
    }

    function getCompletedInfo(topic, level, difficulty) {
        const topicState = _initTopic(topic);
        const key = `${level}_${difficulty}`;
        return topicState.completedLevels[key] || null;
    }

    function checkLevelCompletion(topic, level, difficulty, accuracy, wpm) {
        const thresholds = THRESHOLDS[difficulty];
        const passed = accuracy >= thresholds.minAccuracy && wpm >= thresholds.minWPM;

        if (passed) {
            const state = _getState();
            if (!state[topic]) state[topic] = { unlockedLevels: [1], completedLevels: {} };

            const key = `${level}_${difficulty}`;
            const existing = state[topic].completedLevels[key];

            if (!existing || accuracy > existing.accuracy || wpm > existing.wpm) {
                state[topic].completedLevels[key] = {
                    accuracy,
                    wpm,
                    completedAt: new Date().toISOString()
                };
            }

            const nextLevel = level + 1;
            if (nextLevel <= MAX_LEVEL && !state[topic].unlockedLevels.includes(nextLevel)) {
                state[topic].unlockedLevels.push(nextLevel);
                state[topic].unlockedLevels.sort((a, b) => a - b);
            }

            _saveState(state);
        }

        return passed;
    }

    function calculateXP(difficulty, accuracy, wpm, textLength) {
        const config = XP_REWARD[difficulty];
        let xp = config.base;
        xp += Math.floor(textLength * config.perWord);

        // Accuracy-Bonus: einmal fuer >=95%, zusaetzlich nochmal bei 100% (Perfect Bonus)
        if (accuracy >= 95) xp += config.accuracyBonus;
        if (accuracy === 100) xp += config.accuracyBonus;

        // Speed-Bonus: 5 XP pro angefangene 10 WPM
        const speedBonus = Math.floor(wpm / 10) * 5;
        xp += speedBonus;

        return Math.max(xp, 5);
    }

    function getUnlockedLevels(topic) {
        const topicState = _initTopic(topic);
        return topicState.unlockedLevels || [1];
    }

    function getLevelProgress(topic, level) {
        const completions = [];
        for (const diff of DIFFICULTIES) {
            completions.push({
                difficulty: diff,
                completed: isLevelCompleted(topic, level, diff),
                info: getCompletedInfo(topic, level, diff),
                thresholds: THRESHOLDS[diff]
            });
        }
        return completions;
    }

    function getTopicSummary(topic) {
        const unlocked = getUnlockedLevels(topic);
        const maxUnlocked = unlocked.reduce((max, l) => Math.max(max, l), 0);
        let completedCount = 0;

        for (let level = 1; level <= maxUnlocked; level++) {
            for (const diff of DIFFICULTIES) {
                if (isLevelCompleted(topic, level, diff)) {
                    completedCount++;
                }
            }
        }

        return {
            maxUnlockedLevel: maxUnlocked,
            totalCompletions: completedCount,
            maxPossible: maxUnlocked * DIFFICULTIES.length,
            progressPercent: Math.round((completedCount / COMPLETIONS_PER_TOPIC) * 100)
        };
    }

    function getThresholds(difficulty) {
        return THRESHOLDS[difficulty] || THRESHOLDS.normal;
    }

    function resetProgress(topic) {
        const state = _getState();
        if (state[topic]) {
            state[topic] = { unlockedLevels: [1], completedLevels: {} };
            _saveState(state);
        }
    }

    function resetAllProgress() {
        Storage.saveLevels({});
    }

    return {
        MAX_LEVEL,
        DIFFICULTIES,
        COMPLETIONS_PER_TOPIC,
        THRESHOLDS,
        isLevelUnlocked,
        isLevelCompleted,
        getCompletedInfo,
        checkLevelCompletion,
        calculateXP,
        getUnlockedLevels,
        getLevelProgress,
        getTopicSummary,
        getThresholds,
        resetProgress,
        resetAllProgress
    };
})();
