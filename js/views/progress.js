'use strict';

/**
 * Progress-View: Statistiken, Verlaufsdiagramme (WPM/Accuracy) und
 * Sessions-Tabelle mit Filtermoeglichkeiten.
 */
const ProgressView = (() => {
    /** Fuellt die Filter-Dropdowns und bindet Change-Events. */
    function bindFilters() {
        const topicSelect = Dom.byId('filterTopic');
        topicSelect.setAttribute('aria-label', 'Nach Themenbereich filtern');
        Dom.byId('filterLevel').setAttribute('aria-label', 'Nach Level filtern');
        Dom.byId('filterDifficulty').setAttribute('aria-label', 'Nach Schwierigkeit filtern');
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
        bindChartKeyboard('wpmChart');
        bindChartKeyboard('accuracyChart');
    }

    function bindChartKeyboard(chartId) {
        Dom.byId(chartId).addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            const current = event.target.closest('.bar');
            if (!current) return;
            const bars = [...event.currentTarget.querySelectorAll('.bar')];
            const currentIndex = bars.indexOf(current);
            let nextIndex = currentIndex;
            if (event.key === 'ArrowLeft') nextIndex = Math.max(0, currentIndex - 1);
            if (event.key === 'ArrowRight') nextIndex = Math.min(bars.length - 1, currentIndex + 1);
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = bars.length - 1;

            event.preventDefault();
            current.tabIndex = -1;
            bars[nextIndex].tabIndex = 0;
            bars[nextIndex].focus();
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
                <div class="empty-state empty-state-wide">
                    <div class="empty-icon">—</div>
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
            chart.setAttribute('role', 'status');
            chart.removeAttribute('aria-label');
            chart.innerHTML = '<div class="empty-state empty-state-wide"><p>Keine Daten</p></div>';
            return;
        }

        const last30 = sessions.slice(-30);
        const maxWPM = last30.reduce((max, s) => Math.max(max, s.wpm), 1);
        chart.setAttribute('role', 'list');
        chart.setAttribute('aria-label', 'WPM der letzten 30 Übungen');

        chart.innerHTML = last30
            .map((s, index) => {
                const height = Math.max(2, (s.wpm / maxWPM) * 100);
                const quality = s.wpm >= 60 ? 'good' : s.wpm >= 35 ? 'warn' : 'bad';
                const date = Dom.formatDate(s.timestamp);
                const label = `${date}: ${s.wpm} WPM`;
                return `<div class="bar ${quality}" role="listitem" tabindex="${index === 0 ? '0' : '-1'}" aria-label="${Dom.escapeHtml(label)}" style="--bar-height: ${height}%">
                <div class="bar-tooltip">${Dom.escapeHtml(date)}: ${Dom.escapeHtml(String(s.wpm))} WPM</div>
            </div>`;
            })
            .join('');
    }

    function renderAccuracyChart(sessions) {
        const chart = Dom.byId('accuracyChart');
        if (sessions.length === 0) {
            chart.setAttribute('role', 'status');
            chart.removeAttribute('aria-label');
            chart.innerHTML = '<div class="empty-state empty-state-wide"><p>Keine Daten</p></div>';
            return;
        }

        const last30 = sessions.slice(-30);
        chart.setAttribute('role', 'list');
        chart.setAttribute('aria-label', 'Genauigkeit der letzten 30 Übungen');

        chart.innerHTML = last30
            .map((s, index) => {
                const height = Math.max(2, s.accuracy);
                const quality = s.accuracy >= 95 ? 'good' : s.accuracy >= 85 ? 'warn' : 'bad';
                const date = Dom.formatDate(s.timestamp);
                const label = `${date}: ${s.accuracy} Prozent Genauigkeit`;
                return `<div class="bar ${quality}" role="listitem" tabindex="${index === 0 ? '0' : '-1'}" aria-label="${Dom.escapeHtml(label)}" style="--bar-height: ${height}%">
                <div class="bar-tooltip">${Dom.escapeHtml(date)}: ${Dom.escapeHtml(String(s.accuracy))}%</div>
            </div>`;
            })
            .join('');
    }

    function renderSessionsTable(sessions) {
        const body = Dom.byId('sessionsBody');
        const last20 = sessions.slice(-20).reverse();

        if (last20.length === 0) {
            body.innerHTML = '<tr><td class="table-empty" colspan="7">Keine Daten</td></tr>';
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
                const diffName = Dom.escapeHtml(Texts.DIFFICULTY_NAMES[s.difficulty] || String(s.difficulty));
                const time = Dom.formatTime(s.elapsedSeconds);
                const accClass = s.accuracy >= 95 ? 'good' : s.accuracy < 85 ? 'bad' : 'warn';

                return `<tr>
                <td>${date}</td>
                <td>${topicName}</td>
                <td>${Dom.escapeHtml(String(s.level))}</td>
                <td>${diffName}</td>
                <td>${Dom.escapeHtml(String(s.wpm))}</td>
                <td class="${accClass}">${Dom.escapeHtml(String(s.accuracy))}%</td>
                <td>${time}</td>
            </tr>`;
            })
            .join('');
    }

    return { bindFilters, render };
})();
