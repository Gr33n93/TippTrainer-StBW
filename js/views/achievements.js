'use strict';

/**
 * Achievements-View: Zeigt alle Achievements gruppiert nach Kategorien.
 */
const AchievementsView = (() => {
    const CATEGORIES = {
        milestone: 'Meilensteine',
        speed: 'Geschwindigkeit',
        accuracy: 'Genauigkeit',
        streak: 'Streaks',
        topic: 'Themen',
        time: 'Zeit',
        session: 'Session'
    };

    function render() {
        const all = Achievements.getAll();
        const unlocked = all.filter((a) => a.unlocked).length;
        const total = all.length;

        Dom.byId('achievementSummary').innerHTML = `
            <span><strong>${unlocked}</strong> von ${total} Achievements freigeschaltet</span>
            <span>${Math.round((unlocked / total) * 100)}% vollständig</span>
        `;

        let html = '';
        let markIndex = 0;
        for (const [catKey, catName] of Object.entries(CATEGORIES)) {
            const catAchs = all.filter((a) => a.category === catKey);
            if (catAchs.length === 0) continue;

            html += `<h3 class="achievement-category">${Dom.escapeHtml(catName)}</h3>`;
            for (const ach of catAchs) {
                markIndex++;
                const date = ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString('de-DE') : '';
                html += `
                    <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
                        <div class="ach-icon" aria-hidden="true">${ach.unlocked ? String(markIndex).padStart(2, '0') : '—'}</div>
                        <div class="ach-info">
                            <div class="ach-name">${Dom.escapeHtml(String(ach.name))}</div>
                            <div class="ach-desc">${Dom.escapeHtml(String(ach.description))}</div>
                            ${date ? `<div class="ach-date">Freigeschaltet am ${date}</div>` : ''}
                        </div>
                    </div>
                `;
            }
        }

        Dom.byId('achievementsGrid').innerHTML = html;
    }

    return { render };
})();
