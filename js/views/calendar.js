'use strict';

/**
 * Calendar-View: Monatskalender mit Heatmap (Uebungsintensitaet),
 * Streak-Statistiken und Monatsnavigation.
 */
const CalendarView = (() => {
    const MONTH_NAMES = [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ];

    /** Initialisiert die Kalender-Position auf den aktuellen Monat. */
    function initDate() {
        const now = new Date();
        State.calYear = now.getFullYear();
        State.calMonth = now.getMonth() + 1;
    }

    /** Bindet Prev/Next-Monatsbuttons. */
    function bindControls() {
        Dom.byId('calPrev').addEventListener('click', () => {
            State.calMonth--;
            if (State.calMonth < 1) {
                State.calMonth = 12;
                State.calYear--;
            }
            render();
        });

        Dom.byId('calNext').addEventListener('click', () => {
            State.calMonth++;
            if (State.calMonth > 12) {
                State.calMonth = 1;
                State.calYear++;
            }
            render();
        });
    }

    function render() {
        Dom.byId('calTitle').textContent = `${MONTH_NAMES[State.calMonth - 1]} ${State.calYear}`;

        const daysInMonth = Calendar.getDaysInMonth(State.calYear, State.calMonth);
        const firstDay = Calendar.getFirstDayOfMonth(State.calYear, State.calMonth);
        const monthData = Calendar.getMonthData(State.calYear, State.calMonth);
        const today = new Date().toISOString().split('T')[0];

        let html = '';

        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${State.calYear}-${String(State.calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const intensity = Calendar.getIntensityLevel(dateStr);
            const isToday = dateStr === today;

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (intensity > 0) classes += ` intensity-${intensity}`;

            const minutes = monthData[dateStr]?.totalSeconds
                ? Math.round(monthData[dateStr].totalSeconds / 60)
                : 0;
            const titleAttr = intensity > 0 ? ` title="${dateStr} – ${minutes} Min."` : ` title="${dateStr}"`;

            html += `<div class="${classes}"${titleAttr}>${day}</div>`;
        }

        Dom.byId('calendarDays').innerHTML = html;

        const calStats = Calendar.getStats();
        Dom.byId('calendarStats').innerHTML =
            Dom.statCard(`${calStats.currentStreak} 🔥`, 'Aktuelle Streak') +
            Dom.statCard(calStats.longestStreak, 'Längste Streak') +
            Dom.statCard(calStats.totalDays, 'Tage geübt') +
            Dom.statCard(calStats.totalMinutes, 'Minuten gesamt');
    }

    return { initDate, bindControls, render };
})();
