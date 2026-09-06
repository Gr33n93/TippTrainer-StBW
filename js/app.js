'use strict';

/**
 * App-Bootstrap: Initialisiert alle Module und startet die App.
 *
 * Diese Datei enthält bewusst keine Geschäftslogik und kein DOM-Rendering.
 * Sie ist ausschließlich für die Initialisierungsreihenfolge und die
 * Verbindung der Module verantwortlich.
 *
 * Modul-Hierarchie (Lade-Reihenfolge in index.html):
 *   1. core/      - State, Dom (Infrastruktur)
 *   2. engine/    - Storage, Typing (Persistenz + Engine)
 *   3. data/      - Text-API und Übungstexte
 *   4. services/  - Levels, Calendar, Progress, Achievements, ...
 *   5. core/      - Router
 *   6. views/     - Dashboard, Levels, Typing, Result, Calendar, ...
 *   7. app.js     - Bootstrap (diese Datei)
 */
const App = (() => {
    let initialized = false;

    function init() {
        if (initialized) return;
        initialized = true;

        // Textdaten in das Texts-Modul übernehmen
        TextsExtra.apply();
        if (typeof TextsSehrSchwer !== 'undefined') TextsSehrSchwer.apply();

        // Views beim Router registrieren
        Router.register('dashboard', DashboardView.render);
        Router.register('levels', LevelsView.render);
        Router.register('calendar', CalendarView.render);
        Router.register('achievements', AchievementsView.render);
        Router.register('progress', ProgressView.render);

        // Initiale UI-Setups
        CalendarView.initDate();
        Router.bindNavigation();
        Router.bindMobileToggle();
        TypingView.bind();
        CalendarView.bindControls();
        SettingsView.bind();
        ProgressView.bindFilters();

        ChromeView.updateXPDisplay();
        ChromeView.updateCountdown();

        // Start-View anzeigen
        Router.showView('dashboard');
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
