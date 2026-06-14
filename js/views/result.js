'use strict';

/**
 * Result-View: Overlay nach Abschluss einer Uebung mit Statistiken,
 * Achievements, Difficulty-Empfehlung und Weiter-Buttons.
 */
const ResultView = (() => {
    function show(stats, completion) {
        const { passed, xpEarned, newAchievements, recommendation } = completion;
        const overlay = Dom.byId('resultOverlay');
        const card = Dom.byId('resultCard');

        const accClass = Dom.classifyAccuracy(stats.accuracy);
        const wpmClass = Dom.classifyWpm(stats.wpm);
        const thresholds = Levels.getThresholds(State.difficulty);

        const achievementsHtml = newAchievements.length > 0 ? renderAchievements(newAchievements) : '';
        const recommendHtml = recommendation ? renderRecommendation(recommendation) : '';

        card.innerHTML = `
            <h3 class="${passed ? 'passed' : 'failed'}">
                ${passed ? '✅ Level bestanden!' : '⏳ Weiter üben!'}
            </h3>
            <div class="result-stats">
                <div class="result-stat ${wpmClass}">
                    <div class="val">${stats.wpm}</div>
                    <div class="lbl">WPM (Ziel: ${thresholds.minWPM})</div>
                </div>
                <div class="result-stat ${accClass}">
                    <div class="val">${stats.accuracy}%</div>
                    <div class="lbl">Genauigkeit (Ziel: ${thresholds.minAccuracy}%)</div>
                </div>
                <div class="result-stat">
                    <div class="val">${stats.correctChars}/${stats.totalChars}</div>
                    <div class="lbl">Zeichen korrekt</div>
                </div>
                <div class="result-stat">
                    <div class="val">${Dom.formatTime(stats.elapsedSeconds)}</div>
                    <div class="lbl">Dauer</div>
                </div>
            </div>
            <div class="result-xp">+${xpEarned} XP verdient!</div>
            ${achievementsHtml}
            ${recommendHtml}
            <div class="result-actions">
                <button class="btn btn-primary" id="resultRetry">🔄 Nochmal</button>
                <button class="btn btn-secondary" id="resultNext">⏭️ Nächster Text</button>
                ${passed && State.level < Levels.MAX_LEVEL ? '<button class="btn btn-success" id="resultNextLevel">⬆️ Nächstes Level</button>' : ''}
                <button class="btn btn-secondary" id="resultBack">📚 Zurück</button>
            </div>
        `;

        overlay.classList.add('visible');
        bindActions(overlay, recommendation);

        for (const ach of newAchievements) {
            Dom.showToast(ach.icon, ach.name, ach.description);
        }
    }

    function renderAchievements(newAchievements) {
        return `
            <div class="new-achievements">
                <h4>🏆 Neue Achievements freigeschaltet!</h4>
                ${newAchievements
                    .map(
                        (a) => `
                    <div class="achievement-popup">
                        <span class="ach-icon">${Dom.escapeHtml(String(a.icon))}</span>
                        <div>
                            <div class="toast-title">${Dom.escapeHtml(String(a.name))}</div>
                            <div class="toast-text">${Dom.escapeHtml(String(a.description))}</div>
                        </div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    function renderRecommendation(recommendation) {
        return `
            <div class="result-recommendation">
                <div class="recommendation-text">💡 <strong>Herausforderung gesucht?</strong> ${Dom.escapeHtml(String(recommendation.reason))}</div>
                <button class="btn btn-sm btn-success" id="resultHarder">⬆️ Jetzt ${Dom.escapeHtml(String(recommendation.nextName))} probieren</button>
            </div>
        `;
    }

    function bindActions(overlay, recommendation) {
        if (recommendation) {
            Dom.byId('resultHarder').addEventListener('click', () => {
                overlay.classList.remove('visible');
                State.difficulty = recommendation.nextDiff;
                State.lastText = null;
                TypingView.start(false);
            });
        }

        Dom.byId('resultRetry').addEventListener('click', () => {
            overlay.classList.remove('visible');
            TypingView.start(true);
        });

        Dom.byId('resultNext').addEventListener('click', () => {
            overlay.classList.remove('visible');
            TypingView.start(false);
        });

        const nextLevelBtn = Dom.byId('resultNextLevel');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                overlay.classList.remove('visible');
                State.level++;
                State.lastText = null;
                TypingView.start(false);
            });
        }

        Dom.byId('resultBack').addEventListener('click', () => {
            overlay.classList.remove('visible');
            Router.showView('levels');
        });
    }

    return { show };
})();
