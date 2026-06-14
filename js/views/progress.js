'use strict';

/**
 * Progress-View: Statistiken, Verlaufsdiagramme (WPM/Accuracy) und
 * Sessions-Tabelle mit Filtermoeglichkeiten.
 */
const ProgressView = (() => {
    /** Fuellt die Filter-Dropdowns und bindet Change-Events. */
    function bindFilters() {
        const topicSelect = Dom.byId('filterTopic');
        Texts.getAllTopics().forEach((t) => {
            topicSelect.innerHTML += `<option value="${t}">${Texts.getTopicName(t)}</option>`;
        });

        for (let i = 1; i <= 10; i++) {
            Dom.byId('filterLevel').innerHTML += `<option value="${i}">Level ${i}</option>`;
        }
        Levels.DIFFICULTIES.forEach((d) => {
            Dom.byId('filterDifficulty').innerHTML +=
                `<option value="${d}">${Texts.DIFFICULTY_NAMES[d]}</option>`;
        });

        ['filterTopic', 'filterLevel', 'filterDifficulty'].forEach((id) => {
            Dom.byId(id).addEventListener('change', render);
        });
    }

    function render() {
        const topic = Dom.byId('filterTopic').value || null;
        const level = Dom.byId('filterLevel').value ? parseInt(Dom.byId('filterLevel').value) : null;
        const difficulty = Dom.byId('filterDifficulty').value || null;

        let sessions = Progress.getAllSessions();
        if (topic) sessions = sessions.filter((s) => s.topic === topic);
        if (level) sessions = sessions.filter((s) => s.level === level);
        if (difficulty) sessions = sessions.filter((s) => s.difficulty === difficulty);

        renderStats(sessions);
        renderWpmChart(sessions);
        renderAccuracyChart(sessions);
        renderSessionsTable(sessions);
    }

    function renderStats(sessions) {
        if (sessions.length === 0) {
            Dom.byId('progressStats').innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1">
                    <div class="empty-icon">📊</div>
                    <p>Noch keine Daten für diese Auswahl vorhanden.</p>
                </div>
            `;
            return;
        }

        const avgWPM = Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length);
        const avgAcc =
            Math.round((sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length) * 100) / 100;
        const bestWPM = sessions.reduce((max, s) => Math.max(max, s.wpm), 0);
        const totalTime = Math.round(sessions.reduce((a, s) => a + (s.elapsedSeconds || 0), 0) / 60);

        Dom.byId('progressStats').innerHTML =
            Dom.statCard(sessions.length, 'Übungen') +
            Dom.statCard(avgWPM, 'Ø WPM') +
            Dom.statCard(avgAcc + '%', 'Ø Genauigkeit', 'success') +
            Dom.statCard(bestWPM, 'Beste WPM', 'warning') +
            Dom.statCard(totalTime, 'Minuten gesamt');
    }

    function renderWpmChart(sessions) {
        const chart = Dom.byId('wpmChart');
        if (sessions.length === 0) {
            chart.innerHTML = '<div class="empty-state" style="width:100%"><p>Keine Daten</p></div>';
            return;
        }

        const maxWPM = sessions.reduce((max, s) => Math.max(max, s.wpm), 1);
        const last30 = sessions.slice(-30);

        chart.innerHTML = last30
            .map((s) => {
                const height = Math.max(2, (s.wpm / maxWPM) * 100);
                const color =
                    s.wpm >= 60
                        ? 'var(--success-dim)'
                        : s.wpm >= 35
                          ? 'var(--accent-dim)'
                          : 'var(--error-dim)';
                const date = Dom.formatDate(s.timestamp);
                return `<div class="bar" style="height: ${height}%; background: ${color}">
                <div class="bar-tooltip">${Dom.escapeHtml(date)}: ${Dom.escapeHtml(String(s.wpm))} WPM</div>
            </div>`;
            })
            .join('');
    }

    function renderAccuracyChart(sessions) {
        const chart = Dom.byId('accuracyChart');
        if (sessions.length === 0) {
            chart.innerHTML = '<div class="empty-state" style="width:100%"><p>Keine Daten</p></div>';
            return;
        }

        const last30 = sessions.slice(-30);

        chart.innerHTML = last30
            .map((s) => {
                const height = Math.max(2, s.accuracy);
                const color =
                    s.accuracy >= 95
                        ? 'var(--success-dim)'
                        : s.accuracy >= 85
                          ? 'var(--warning-dim)'
                          : 'var(--error-dim)';
                const date = Dom.formatDate(s.timestamp);
                return `<div class="bar" style="height: ${height}%; background: ${color}">
                <div class="bar-tooltip">${Dom.escapeHtml(date)}: ${Dom.escapeHtml(String(s.accuracy))}%</div>
            </div>`;
            })
            .join('');
    }

    function renderSessionsTable(sessions) {
        const body = Dom.byId('sessionsBody');
        const last20 = sessions.slice(-20).reverse();

        if (last20.length === 0) {
            body.innerHTML =
                '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">Keine Daten</td></tr>';
            return;
        }

        body.innerHTML = last20
            .map((s) => {
                const date = Dom.formatDate(s.timestamp, {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                });
                const topicName = Dom.escapeHtml(Texts.getTopicName(s.topic));
                const diffName = Texts.DIFFICULTY_NAMES[s.difficulty] || Dom.escapeHtml(String(s.difficulty));
                const time = Dom.formatTime(s.elapsedSeconds);
                const accStyle =
                    s.accuracy >= 95 ? 'color: var(--success)' : s.accuracy < 85 ? 'color: var(--error)' : '';

                return `<tr>
                <td>${date}</td>
                <td>${topicName}</td>
                <td>${Dom.escapeHtml(String(s.level))}</td>
                <td>${diffName}</td>
                <td>${Dom.escapeHtml(String(s.wpm))}</td>
                <td style="${accStyle}">${Dom.escapeHtml(String(s.accuracy))}%</td>
                <td>${time}</td>
            </tr>`;
            })
            .join('');
    }

    return { bindFilters, render };
})();
