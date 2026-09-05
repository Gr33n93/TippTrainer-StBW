'use strict';

/**
 * Session-Completion-Service: Kapselt den Workflow, der nach Abschluss
 * einer Uebung ausgefuehrt wird (Speichern, XP, Achievements, Result-Overlay).
 *
 * Vorher als _onExerciseFinished in app.js; hier sauber von der DOM-Logik
 * getrennt. Die UI-Reaktionen (XP-Update, Result-Overlay) werden hierfuer
 * explizit aufgerufen.
 */
const SessionCompletion = (() => {
    /**
     * Schliesst eine Uebung ab und persistiert alle Nebenwirkungen.
     *
     * @param {object} stats - Ergebnis-Objekt aus der Typing-Engine
     * @returns {{session: object, passed: boolean, xpEarned: number, newAchievements: array, recommendation: object|null}}
     */
    function complete(stats) {
        // Inputfeld deaktivieren (Feedback an den Nutzer)
        const input = Dom.byId('typingInput');
        if (input) input.disabled = true;

        const sessionData = {
            topic: State.topic,
            level: State.level,
            difficulty: State.difficulty,
            ...stats
        };

        const transaction = Storage.runTransaction((abort) => {
            // 1. Session in Historie speichern
            const session = Progress.addSession(sessionData);
            if (!session) return abort();

            // 2. Kalender-Tag registrieren
            const calendarEntry = Calendar.recordPractice(stats.elapsedSeconds);
            if (!calendarEntry) return abort();

            // 3. Level-Fortschritt pruefen
            const passed = Levels.checkLevelCompletion(
                State.topic,
                State.level,
                State.difficulty,
                stats.accuracy,
                stats.wpm
            );

            // 4. XP berechnen und gutschreiben
            const xpEarned = Levels.calculateXP(
                State.difficulty,
                stats.accuracy,
                stats.wpm,
                stats.targetChars ?? stats.totalChars,
                passed
            );
            Storage.addXP(xpEarned);

            // 5. Achievements pruefen
            const newAchievements = Achievements.checkAndUnlock(sessionData);

            return { session, passed, xpEarned, newAchievements };
        });

        const outcome = transaction.value;

        // 6. Hoehere Schwierigkeit empfohlen?
        const recommendation = Recommendation.recommend(stats, State.difficulty);

        return {
            session: outcome?.session || sessionData,
            passed: outcome?.passed ?? false,
            xpEarned: transaction.committed ? outcome.xpEarned : 0,
            newAchievements: transaction.committed ? outcome.newAchievements : [],
            recommendation,
            persisted: transaction.committed
        };
    }

    return { complete };
})();
