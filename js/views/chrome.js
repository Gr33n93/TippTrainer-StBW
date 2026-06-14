'use strict';

/**
 * Chrome-View: Globale UI-Elemente ausserhalb der Views
 * (XP-Bar in der Sidebar, Countdown-Badge, Datums-Label in den Settings).
 */
const ChromeView = (() => {
    /** Aktualisiert die XP-Anzeige in der Sidebar. */
    function updateXPDisplay() {
        const xp = Storage.getXP();
        Dom.byId('xpLevel').textContent = `Level ${xp.userLevel}`;
        Dom.byId('xpPoints').textContent = `${xp.total} XP`;

        const nextLevelXP = Storage.getXPThresholdForLevel(xp.userLevel);
        const prevLevelXP = Storage.getCumulativeXPForLevel(xp.userLevel);
        const progress =
            nextLevelXP > prevLevelXP ? ((xp.total - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100 : 100;

        Dom.byId('xpBar').style.width = Math.min(100, progress) + '%';
    }

    /** Aktualisiert den Countdown in Sidebar und Dashboard-Badge. */
    function updateCountdown() {
        const days = Progress.getDaysUntilTarget();
        Dom.byId('sidebarCountdown').textContent = days;

        const dashboardBadge = Dom.byId('dashboardCountdown');
        if (!dashboardBadge) return;

        const target = Storage.getSettings().targetDate || Storage.DEFAULT_TARGET_DATE;
        const formatted = new Date(target + 'T00:00:00').toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        dashboardBadge.textContent = days > 0 ? `${days} Tage bis ${formatted}` : 'Prüfung ist da!';
    }

    /** Aktualisiert das Datums-Label in den Einstellungen. */
    function updateDaysUntilLabel() {
        const days = Progress.getDaysUntilTarget();
        const target = Storage.getSettings().targetDate || Storage.DEFAULT_TARGET_DATE;
        const formatted = new Date(target + 'T00:00:00').toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const label = Dom.byId('daysUntilLabel');
        if (label) {
            label.textContent =
                days > 0 ? `Noch ${days} Tage bis zum ${formatted}` : 'Prüfungstermin erreicht!';
        }
    }

    return { updateXPDisplay, updateCountdown, updateDaysUntilLabel };
})();
