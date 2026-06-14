'use strict';

/**
 * Levels-View: Schwierigkeits-Tabs, Level-Grid und Fortschrittsanzeige
 * fuer den aktuell gewaehlten Themenbereich.
 */
const LevelsView = (() => {
    function render() {
        if (!State.topic) {
            State.topic = Texts.getAllTopics()[0];
        }

        const name = Texts.getTopicName(State.topic);
        Dom.byId('levelTitle').textContent = `${name} – Levelauswahl`;

        renderDifficultyTabs();
        renderLevelsGrid();
        renderLevelProgress();
    }

    function renderDifficultyTabs() {
        const container = Dom.byId('difficultyTabs');
        container.innerHTML = Levels.DIFFICULTIES.map((diff) => {
            const active = diff === State.difficulty ? 'active' : '';
            return `<div class="diff-tab ${active}" data-diff="${Dom.escapeHtml(diff)}">${Dom.escapeHtml(Texts.DIFFICULTY_NAMES[diff])}</div>`;
        }).join('');

        container.querySelectorAll('.diff-tab').forEach((tab) => {
            tab.addEventListener('click', () => {
                State.difficulty = tab.dataset.diff;
                renderDifficultyTabs();
                renderLevelsGrid();
                renderLevelProgress();
            });
        });
    }

    function renderLevelsGrid() {
        const container = Dom.byId('levelsGrid');
        const unlocked = Levels.getUnlockedLevels(State.topic);

        container.innerHTML = '';
        for (let level = 1; level <= Levels.MAX_LEVEL; level++) {
            const isUnlocked = unlocked.includes(level);
            const isCompleted = Levels.isLevelCompleted(State.topic, level, State.difficulty);
            const info = Levels.getCompletedInfo(State.topic, level, State.difficulty);

            let statusText = '';
            let classes = 'level-btn';

            if (!isUnlocked) {
                classes += ' locked';
                statusText = '🔒';
            } else if (isCompleted) {
                classes += ' completed';
                statusText = `✓ ${info.wpm} WPM`;
            } else {
                statusText = 'Offen';
            }

            const btn = document.createElement('div');
            btn.className = classes;
            btn.innerHTML = `<span class="level-num">${level}</span><span class="level-status">${statusText}</span>`;

            if (isUnlocked) {
                btn.addEventListener('click', () => {
                    State.level = level;
                    TypingView.start();
                });
            }

            container.appendChild(btn);
        }
    }

    function renderLevelProgress() {
        const container = Dom.byId('levelProgressInfo');
        const unlocked = Levels.getUnlockedLevels(State.topic);

        if (unlocked.length === 0) return;

        let html = '<div class="stats-grid">';
        for (const level of unlocked.slice(-3)) {
            const data = Progress.getProgressForLevelDisplay(State.topic, level, State.difficulty);
            html += `
                <div class="stat-card ${data.passed ? 'success' : ''}">
                    <div class="stat-value" style="font-size: 1.2rem">Level ${level}</div>
                    <div class="stat-label">${data.attempts} Versuche | Ø ${data.avgWPM} WPM | ${data.avgAccuracy}%</div>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    return { render };
})();
