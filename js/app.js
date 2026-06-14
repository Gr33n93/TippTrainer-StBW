'use strict';

/**
 * App-Bootstrap: Initialisiert alle Module und startet die App.
 *
 * Diese Datei enthaelt absichtlich KEINE Geschaeftslogik und KEIN
 * DOM-Rendering. Sie ausschliesslich fuer die Initialisierungs-Reihenfolge
 * und das Wiring zwischen Modulen verantwortlich.
 *
 * Modul-Hierarchie (Lade-Reihenfolge in index.html):
 *   1. core/      - State, Dom, Router (Infrastruktur)
 *   2. engine/    - Storage, Typing, Texts (Persistenz + Engine)
 *   3. data/      - Texte (Daten)
 *   4. services/  - Levels, Calendar, Progress, Achievements, ...
 *   5. views/     - Dashboard, Levels, Typing, Result, Calendar, ...
 *   6. app.js     - Bootstrap (diese Datei)
 */
const App = (() => {
    function init() {
        // Text-Daten in das Texts-Modul mergen
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
