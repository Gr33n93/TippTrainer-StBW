'use strict';

/**
 * Result-View: Overlay nach Abschluss einer Uebung mit Statistiken,
 * Achievements, Difficulty-Empfehlung und Weiter-Buttons.
 */
const ResultView = (() => {
    let keyboardBound = false;

    function show(stats, completion) {
        const { passed, xpEarned, newAchievements, recommendation, persisted } = completion;
        const overlay = Dom.byId('resultOverlay');
        const card = Dom.byId('resultCard');

        const accClass = Dom.classifyAccuracy(stats.accuracy);
        const wpmClass = Dom.classifyWpm(stats.wpm);
        const thresholds = Levels.getThresholds(State.difficulty);

        const achievementsHtml = newAchievements.length > 0 ? renderAchievements(newAchievements) : '';
        const recommendHtml = recommendation ? renderRecommendation(recommendation) : '';
        const persistenceHtml = persisted
            ? ''
            : '<div class="result-warning" role="alert"><strong>Speichern fehlgeschlagen.</strong> Mindestens ein Teil des Fortschritts konnte nicht gespeichert werden.</div>';

        card.innerHTML = `
            <h2 id="resultTitle" class="${passed ? 'passed' : 'failed'}">
                ${passed ? 'Level bestanden' : 'Noch nicht bestanden'}
            </h2>
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
            ${persistenceHtml}
            ${achievementsHtml}
            ${recommendHtml}
            <div class="result-actions">
                <button class="btn btn-primary" id="resultRetry">Nochmal</button>
                <button class="btn btn-secondary" id="resultNext">Nächster Text</button>
                ${passed && State.level < Levels.MAX_LEVEL ? '<button class="btn btn-success" id="resultNextLevel">Nächstes Level</button>' : ''}
                <button class="btn btn-secondary" id="resultBack">Zurück</button>
            </div>
        `;

        overlay.classList.add('visible');
        setBackgroundInert(true);
        bindActions(recommendation);
        bindKeyboard(overlay);
        card.focus();
    }

    function setBackgroundInert(inert) {
        const app = document.querySelector('.app-container');
        const mobileToggle = Dom.byId('mobileToggle');
        if (app) app.inert = inert;
        if (mobileToggle) mobileToggle.inert = inert;
    }

    function close() {
        Dom.byId('resultOverlay').classList.remove('visible');
        setBackgroundInert(false);
    }

    function dismissToLevels() {
        close();
        Router.showView('levels');
        Dom.byId('view-levels').focus();
    }

    function bindKeyboard(overlay) {
        if (keyboardBound) return;
        keyboardBound = true;
        overlay.addEventListener('keydown', (event) => {
            if (!overlay.classList.contains('visible')) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                dismissToLevels();
                return;
            }
            if (event.key !== 'Tab') return;

            const focusable = [...overlay.querySelectorAll('button:not([disabled])')];
            if (focusable.length === 0) {
                event.preventDefault();
                Dom.byId('resultCard').focus();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (
                event.shiftKey &&
                (document.activeElement === first || document.activeElement === Dom.byId('resultCard'))
            ) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    function renderAchievements(newAchievements) {
        return `
            <div class="new-achievements">
                <h4>Neue Leistungen freigeschaltet</h4>
                ${newAchievements
                    .map(
                        (a) => `
                    <div class="achievement-popup">
                        <span class="ach-icon" aria-hidden="true">+</span>
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
                <div class="recommendation-text"><strong>Nächster Schritt:</strong> ${Dom.escapeHtml(String(recommendation.reason))}</div>
                <button class="btn btn-sm btn-success" id="resultHarder">Jetzt ${Dom.escapeHtml(String(recommendation.nextName))} probieren</button>
            </div>
        `;
    }

    function bindActions(recommendation) {
        if (recommendation) {
            Dom.byId('resultHarder').addEventListener('click', () => {
                close();
                State.difficulty = recommendation.nextDiff;
                State.lastText = null;
                TypingView.start(false);
            });
        }

        Dom.byId('resultRetry').addEventListener('click', () => {
            close();
            TypingView.start(true);
        });

        Dom.byId('resultNext').addEventListener('click', () => {
            close();
            TypingView.start(false);
        });

        const nextLevelBtn = Dom.byId('resultNextLevel');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                close();
                State.level++;
                State.lastText = null;
                TypingView.start(false);
            });
        }

        Dom.byId('resultBack').addEventListener('click', () => {
            dismissToLevels();
        });
    }

    return { show, dismissToLevels };
})();
