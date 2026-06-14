'use strict';

/**
 * Empfehlungs-Service: Berechnet, ob nach einer Uebung eine hoehere
 * Schwierigkeitsstufe empfohlen werden kann.
 *
 * Vorher als _getDifficultyRecommendation in app.js gekapselt; das
 * gehoert fachlich in die Service-Schicht (keine DOM-Abhaengigkeit).
 */
const Recommendation = (() => {
    /**
     * Prueft von der hoechsten Stufe abwaerts, welche Schwierigkeit
     * mit dem erreichten Ergebnis noch bedient werden koennte.
     *
     * @param {object} stats - Ergebnis der Uebung ({wpm, accuracy, ...})
     * @param {string} currentDifficulty - aktuell gewaehlte Stufe
     * @returns {object|null} Empfehlung oder null
     */
    function recommend(stats, currentDifficulty) {
        const allDiffs = Levels.DIFFICULTIES;
        const currentIndex = allDiffs.indexOf(currentDifficulty);

        for (let i = allDiffs.length - 1; i > currentIndex; i--) {
            const candidate = allDiffs[i];
            const thresholds = Levels.getThresholds(candidate);
            if (stats.wpm >= thresholds.minWPM && stats.accuracy >= thresholds.minAccuracy) {
                return {
                    nextDiff: candidate,
                    nextName: Texts.DIFFICULTY_NAMES[candidate],
                    reason: `Mit ${stats.wpm} WPM und ${stats.accuracy}% Genauigkeit erfüllst du die Anforderungen für "${Texts.DIFFICULTY_NAMES[candidate]}" (${thresholds.minWPM} WPM, ${thresholds.minAccuracy}%).`
                };
            }
        }
        return null;
    }

    return { recommend };
})();
