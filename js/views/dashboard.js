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
            Dom.statCard(calStats.currentStreak, 'Aktuelle Serie') +
            Dom.statCard(stats.totalMinutes, 'Minuten geübt');
    }

    function renderTopics() {
        const topics = Texts.getAllTopics();
        const container = Dom.byId('dashboardTopics');

        container.innerHTML = topics
            .map((topic) => {
                const summary = Levels.getTopicSummary(topic);
                const name = Texts.getTopicName(topic);
                const abbreviation = Texts.getTopicIcon(topic);

                return `
                <button type="button" class="topic-card" data-topic="${Dom.escapeHtml(topic)}">
                    <div class="topic-icon">${Dom.escapeHtml(String(abbreviation))}</div>
                    <div class="topic-name">${Dom.escapeHtml(name)}</div>
                    <div class="topic-desc">Level ${summary.maxUnlockedLevel} von ${Levels.MAX_LEVEL} freigeschaltet</div>
                    <div class="topic-progress-bar">
                    <div class="topic-progress-fill" style="--topic-progress: ${summary.progressPercent}%"></div>
                    </div>
                    <div class="topic-progress-text">${summary.totalCompletions} / ${Levels.COMPLETIONS_PER_TOPIC} bestanden (${summary.progressPercent}%)</div>
                </button>
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
                    <div class="empty-icon">—</div>
                    <p>Noch keine Übungen. Wähle einen Themenbereich und beginne mit der ersten Zeile.</p>
                </div>
            `;
            return;
        }

        let html =
            '<div class="sessions-scroll"><table class="sessions-table"><thead><tr>' +
            '<th scope="col">Datum</th><th scope="col">Thema</th><th scope="col">Level</th><th scope="col">WPM</th><th scope="col">Genauigkeit</th>' +
            '</tr></thead><tbody>';

        for (const s of sessions) {
            const date = Dom.formatDate(s.timestamp);
            const topicName = Dom.escapeHtml(Texts.getTopicName(s.topic));
            const accClass = s.accuracy >= 95 ? 'good' : s.accuracy >= 85 ? 'warn' : 'bad';

            html += `<tr>
                <td>${date}</td>
                <td>${topicName}</td>
                <td>${Dom.escapeHtml(String(s.level))}</td>
                <td>${Dom.escapeHtml(String(s.wpm))}</td>
                <td class="${accClass}">${Dom.escapeHtml(String(s.accuracy))}%</td>
            </tr>`;
        }

        html += '</tbody></table></div>';
        container.innerHTML = html;
    }

    return { render };
})();
