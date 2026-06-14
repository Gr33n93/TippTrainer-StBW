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
        for (const [catKey, catName] of Object.entries(CATEGORIES)) {
            const catAchs = all.filter((a) => a.category === catKey);
            if (catAchs.length === 0) continue;

            html += `<h3 class="section-title" style="grid-column: 1/-1; margin-top: 16px;">${catName}</h3>`;
            for (const ach of catAchs) {
                const date = ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString('de-DE') : '';
                html += `
                    <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
                        <div class="ach-icon">${ach.unlocked ? ach.icon : '🔒'}</div>
                        <div class="ach-info">
                            <div class="ach-name">${ach.name}</div>
                            <div class="ach-desc">${ach.description}</div>
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
