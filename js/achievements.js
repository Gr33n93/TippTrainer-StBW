'use strict';

const Achievements = (() => {
    const DEFINITIONS = [
        {
            id: 'first_exercise',
            name: 'Erste Tippversuche',
            description: 'Schließe deine erste Übung ab.',
            icon: '🎯',
            category: 'milestone'
        },
        {
            id: 'first_perfect',
            name: 'Fehlerfrei',
            description: 'Schließe eine Übung mit 100 % Genauigkeit ab.',
            icon: '💎',
            category: 'accuracy'
        },
        {
            id: 'speed_40',
            name: 'Fließender Tipp',
            description: 'Erreiche 40 Wörter pro Minute.',
            icon: '🏃',
            category: 'speed'
        },
        {
            id: 'speed_60',
            name: 'Blitzschreiber',
            description: 'Erreiche 60 Wörter pro Minute.',
            icon: '⚡',
            category: 'speed'
        },
        {
            id: 'speed_80',
            name: 'Sprintschreiber',
            description: 'Erreiche 80 Wörter pro Minute.',
            icon: '🚀',
            category: 'speed'
        },
        {
            id: 'speed_100',
            name: 'Meisterschreiber',
            description: 'Erreiche 100 Wörter pro Minute.',
            icon: '🏆',
            category: 'speed'
        },
        {
            id: 'accuracy_95',
            name: 'Präzise',
            description: 'Erreiche 95 % Genauigkeit in einer Übung.',
            icon: '✅',
            category: 'accuracy'
        },
        {
            id: 'accuracy_98',
            name: 'Sehr Präzise',
            description: 'Erreiche 98 % Genauigkeit in einer Übung.',
            icon: '🌟',
            category: 'accuracy'
        },
        {
            id: 'accuracy_streak_10',
            name: 'Perfektionist',
            description: '10 Übungen in Folge mit mindestens 98 % Genauigkeit.',
            icon: '👑',
            category: 'accuracy'
        },
        {
            id: 'streak_3',
            name: 'Dranbleiben',
            description: 'Übe 3 Tage in Folge.',
            icon: '🔥',
            category: 'streak'
        },
        {
            id: 'streak_7',
            name: 'Eine Woche stark',
            description: 'Übe 7 Tage in Folge.',
            icon: '💪',
            category: 'streak'
        },
        {
            id: 'streak_14',
            name: 'Zwei Wochen durchgehend',
            description: 'Übe 14 Tage in Folge.',
            icon: '🗡️',
            category: 'streak'
        },
        {
            id: 'streak_30',
            name: 'Monatsmeister',
            description: 'Übe 30 Tage in Folge.',
            icon: '🏅',
            category: 'streak'
        },
        {
            id: 'streak_50',
            name: 'Eiserne Disziplin',
            description: 'Übe 50 Tage in Folge.',
            icon: '⚙️',
            category: 'streak'
        },
        {
            id: 'topic_buchfuehrung',
            name: 'Buchführungs-Kenner',
            description: 'Schließe alle Level-Bereich in Buchführung ab.',
            icon: '📒',
            category: 'topic'
        },
        {
            id: 'topic_steuerrecht',
            name: 'Steuer-Guru',
            description: 'Schließe alle Level-Bereich in Steuerrecht ab.',
            icon: '⚖️',
            category: 'topic'
        },
        {
            id: 'topic_bilanzen',
            name: 'Bilanz-Experte',
            description: 'Schließe alle Level-Bereich in Bilanzen / EÜR ab.',
            icon: '📊',
            category: 'topic'
        },
        {
            id: 'topic_klr',
            name: 'KLR-Profi',
            description: 'Schließe alle Level-Bereich in Kosten- und Leistungsrechnung ab.',
            icon: '📈',
            category: 'topic'
        },
        {
            id: 'all_topics',
            name: 'Steuerberater-Assistent',
            description: 'Schließe alle Themenbereiche ab.',
            icon: '🎓',
            category: 'topic'
        },
        {
            id: 'night_owl',
            name: 'Nachteule',
            description: 'Übe nach 22:00 Uhr.',
            icon: '🦉',
            category: 'time'
        },
        {
            id: 'early_bird',
            name: 'Frühaufsteher',
            description: 'Übe vor 07:00 Uhr.',
            icon: '🌅',
            category: 'time'
        },
        {
            id: 'marathon',
            name: 'Marathon',
            description: 'Übe insgesamt über 60 Minuten in einer Session.',
            icon: '🏃‍♂️',
            category: 'session'
        },
        {
            id: 'exercises_10',
            name: 'Fleißig',
            description: 'Schließe 10 Übungen ab.',
            icon: '📚',
            category: 'session'
        },
        {
            id: 'exercises_50',
            name: 'Unermüdlich',
            description: 'Schließe 50 Übungen ab.',
            icon: '📖',
            category: 'session'
        },
        {
            id: 'exercises_100',
            name: 'Legionär',
            description: 'Schließe 100 Übungen ab.',
            icon: '🏛️',
            category: 'session'
        },
        {
            id: 'all_levels',
            name: 'Vollender',
            description: 'Schließe alle 10 Level in einem beliebigen Thema ab.',
            icon: '🎖️',
            category: 'milestone'
        },
        {
            id: 'hard_mode',
            name: 'Härtefall',
            description: 'Schließe eine Übung auf Schwer ab.',
            icon: '💀',
            category: 'milestone'
        },
        {
            id: 'hard_perfect',
            name: 'Unfassbar',
            description: '100 % Genauigkeit auf Schwer.',
            icon: '🔮',
            category: 'accuracy'
        },
        {
            id: 'weekend_warrior',
            name: 'Wochenend-Krieger',
            description: 'Übe an einem Samstag oder Sonntag.',
            icon: '⚔️',
            category: 'time'
        },
        {
            id: 'level_5_reached',
            name: 'Auf halbem Weg',
            description: 'Schalte Level 5 in einem beliebigen Thema frei.',
            icon: '🗺️',
            category: 'milestone'
        }
    ];

    function getAll() {
        return DEFINITIONS.map(def => {
            const unlocked = _isUnlocked(def.id);
            return {
                ...def,
                unlocked: !!unlocked,
                unlockedAt: unlocked ? unlocked.unlockedAt : null
            };
        });
    }

    function getById(id) {
        const def = DEFINITIONS.find(d => d.id === id);
        if (!def) return null;
        const unlocked = _isUnlocked(id);
        return {
            ...def,
            unlocked: !!unlocked,
            unlockedAt: unlocked ? unlocked.unlockedAt : null
        };
    }

    function _isUnlocked(id) {
        const achievements = Storage.getAchievements();
        return achievements[id] || null;
    }

    function checkAndUnlock(sessionStats) {
        const newlyUnlocked = [];

        if (_checkFirstExercise(sessionStats)) {
            _unlock('first_exercise', newlyUnlocked);
        }
        if (_checkPerfect(sessionStats)) {
            _unlock('first_perfect', newlyUnlocked);
        }
        if (_checkSpeed(sessionStats, 40)) {
            _unlock('speed_40', newlyUnlocked);
        }
        if (_checkSpeed(sessionStats, 60)) {
            _unlock('speed_60', newlyUnlocked);
        }
        if (_checkSpeed(sessionStats, 80)) {
            _unlock('speed_80', newlyUnlocked);
        }
        if (_checkSpeed(sessionStats, 100)) {
            _unlock('speed_100', newlyUnlocked);
        }
        if (_checkAccuracy(sessionStats, 95)) {
            _unlock('accuracy_95', newlyUnlocked);
        }
        if (_checkAccuracy(sessionStats, 98)) {
            _unlock('accuracy_98', newlyUnlocked);
        }
        if (_checkHardMode(sessionStats)) {
            _unlock('hard_mode', newlyUnlocked);
        }
        if (_checkHardPerfect(sessionStats)) {
            _unlock('hard_perfect', newlyUnlocked);
        }

        _checkStreakAchievements(newlyUnlocked);
        _checkTopicAchievements(newlyUnlocked);
        _checkTimeAchievements(newlyUnlocked);
        _checkSessionAchievements(sessionStats, newlyUnlocked);
        _checkLevelAchievements(newlyUnlocked);
        _checkAccuracyStreak(newlyUnlocked);

        return newlyUnlocked;
    }

    function _unlock(id, list) {
        const unlocked = Storage.unlockAchievement(id);
        if (unlocked) {
            const def = DEFINITIONS.find(d => d.id === id);
            if (def) {
                list.push({
                    id,
                    name: def.name,
                    description: def.description,
                    icon: def.icon
                });
            }
        }
    }

    function _checkFirstExercise(stats) {
        return stats && stats.totalChars > 0;
    }

    function _checkPerfect(stats) {
        return stats && stats.accuracy === 100;
    }

    function _checkSpeed(stats, threshold) {
        return stats && stats.wpm >= threshold;
    }

    function _checkAccuracy(stats, threshold) {
        return stats && stats.accuracy >= threshold;
    }

    function _checkHardMode(stats) {
        return stats && stats.difficulty === 'schwer';
    }

    function _checkHardPerfect(stats) {
        return stats && stats.difficulty === 'schwer' && stats.accuracy === 100;
    }

    function _checkStreakAchievements(list) {
        const calendar = Storage.getCalendarData();
        const streak = Calendar.calculateStreak(calendar);

        if (streak >= 3) _unlock('streak_3', list);
        if (streak >= 7) _unlock('streak_7', list);
        if (streak >= 14) _unlock('streak_14', list);
        if (streak >= 30) _unlock('streak_30', list);
        if (streak >= 50) _unlock('streak_50', list);
    }

    function _checkTopicAchievements(list) {
        const topics = Texts.getAllTopics();
        let allComplete = true;

        for (const topic of topics) {
            const summary = Levels.getTopicSummary(topic);
            if (summary.totalCompletions >= Levels.MAX_LEVEL * 3) {
                _unlock('topic_' + topic, list);
            } else {
                allComplete = false;
            }
        }

        if (allComplete) {
            _unlock('all_topics', list);
        }
    }

    function _checkTimeAchievements(list) {
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 5) _unlock('night_owl', list);
        if (hour >= 5 && hour < 7) _unlock('early_bird', list);

        const day = new Date().getDay();
        if (day === 0 || day === 6) _unlock('weekend_warrior', list);
    }

    function _checkSessionAchievements(stats, list) {
        const progress = Storage.getProgress();
        const totalExercises = progress.length;

        if (totalExercises >= 10) _unlock('exercises_10', list);
        if (totalExercises >= 50) _unlock('exercises_50', list);
        if (totalExercises >= 100) _unlock('exercises_100', list);

        if (stats && stats.elapsedSeconds >= 3600) {
            _unlock('marathon', list);
        }
    }

    function _checkLevelAchievements(list) {
        const topics = Texts.getAllTopics();
        for (const topic of topics) {
            const unlocked = Levels.getUnlockedLevels(topic);
            if (unlocked.includes(5)) _unlock('level_5_reached', list);
            if (unlocked.includes(10)) _unlock('all_levels', list);
        }
    }

    function _checkAccuracyStreak(list) {
        const progress = Storage.getProgress();
        if (progress.length < 10) return;

        const last10 = progress.slice(-10);
        const allAbove98 = last10.every(s => s.accuracy >= 98);
        if (allAbove98) _unlock('accuracy_streak_10', list);
    }

    function getUnlockedCount() {
        const achievements = Storage.getAchievements();
        return Object.keys(achievements).length;
    }

    function getTotalCount() {
        return DEFINITIONS.length;
    }

    function getByCategory(category) {
        return getAll().filter(a => a.category === category);
    }

    return {
        getAll,
        getById,
        checkAndUnlock,
        getUnlockedCount,
        getTotalCount,
        getByCategory
    };
})();
