'use strict';

/**
 * Dashboard-View: Startseite mit Kennzahlen, Themenkarten und
 * den juengsten Uebungen.
 */
const DashboardView = (() => {
    function render() {
        renderStats();
        renderTopics();
        renderRecentSessions();
    }

    function renderStats() {
        const stats = Progress.getOverallStats();
        const calStats = Calendar.getStats();

        ChromeView.updateCountdown();

        Dom.byId('dashboardStats').innerHTML =
            Dom.statCard(stats.totalSessions, 'Übungen gesamt') +
            Dom.statCard(stats.avgWPM, 'Ø WPM') +
            Dom.statCard(stats.avgAccuracy + '%', 'Ø Genauigkeit', 'success') +
            Dom.statCard(stats.bestWPM, 'Beste WPM', 'warning') +
            Dom.statCard(calStats.currentStreak, 'Tage Streak 🔥') +
            Dom.statCard(stats.totalMinutes, 'Minuten geübt');
    }

    function renderTopics() {
        const topics = Texts.getAllTopics();
        const container = Dom.byId('dashboardTopics');

        container.innerHTML = topics
            .map((topic) => {
                const summary = Levels.getTopicSummary(topic);
                const name = Texts.getTopicName(topic);
                const icon = Texts.getTopicIcon(topic);

                return `
                <div class="topic-card" data-topic="${Dom.escapeHtml(topic)}">
                    <div class="topic-icon">${Dom.escapeHtml(String(icon))}</div>
                    <div class="topic-name">${Dom.escapeHtml(name)}</div>
                    <div class="topic-desc">Level ${summary.maxUnlockedLevel} von ${Levels.MAX_LEVEL} freigeschaltet</div>
                    <div class="topic-progress-bar">
                        <div class="topic-progress-fill" style="width: ${summary.progressPercent}%"></div>
                    </div>
                    <div class="topic-progress-text">${summary.totalCompletions} / ${Levels.COMPLETIONS_PER_TOPIC} bestanden (${summary.progressPercent}%)</div>
                </div>
            `;
            })
            .join('');

        container.querySelectorAll('.topic-card').forEach((card) => {
            card.addEventListener('click', () => {
                State.topic = card.dataset.topic;
                Router.showView('levels');
            });
        });
    }

    function renderRecentSessions() {
        const sessions = Progress.getRecentSessions(5);
        const container = Dom.byId('recentSessions');

        if (sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⌨️</div>
                    <p>Noch keine Übungen. Wähle ein Thema oben und lege los!</p>
                </div>
            `;
            return;
        }

        let html =
            '<table class="sessions-table"><thead><tr>' +
            '<th>Datum</th><th>Thema</th><th>Level</th><th>WPM</th><th>Genauigkeit</th>' +
            '</tr></thead><tbody>';

        for (const s of sessions) {
            const date = Dom.formatDate(s.timestamp);
            const topicName = Dom.escapeHtml(Texts.getTopicName(s.topic));
            const accStyle =
                s.accuracy >= 95
                    ? 'style="color: var(--success)"'
                    : s.accuracy >= 85
                      ? ''
                      : 'style="color: var(--error)"';

            html += `<tr>
                <td>${date}</td>
                <td>${topicName}</td>
                <td>${Dom.escapeHtml(String(s.level))}</td>
                <td>${Dom.escapeHtml(String(s.wpm))}</td>
                <td ${accStyle}>${Dom.escapeHtml(String(s.accuracy))}%</td>
            </tr>`;
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    return { render };
})();
