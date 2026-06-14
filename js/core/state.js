'use strict';

/**
 * Zentraler, modulübergreifender App-State.
 *
 * Vorher als Closure-Variablen in app.js gekapselt; jetzt explizit hier
 * gebündelt, damit View- und Service-Module ihn lesen/schreiben koennen,
 * ohne sich untereinander zu kennen.
 */
const State = (() => {
    let currentView = 'dashboard';
    let currentTopic = null;
    let currentLevel = null;
    let currentDifficulty = 'normal';
    let calYear = null;
    let calMonth = null;
    let lastText = null;

    return {
        // Aktuell aktive View ('dashboard', 'levels', 'typing', ...)
        get view() {
            return currentView;
        },
        set view(v) {
            currentView = v;
        },

        // Aktuell ausgewaehlter Themenbereich (z. B. 'buchfuehrung')
        get topic() {
            return currentTopic;
        },
        set topic(t) {
            currentTopic = t;
        },

        // Aktuell ausgewaehltes Level (1-10)
        get level() {
            return currentLevel;
        },
        set level(l) {
            currentLevel = l;
        },

        // Aktuell ausgewaehlte Schwierigkeit ('leicht'|'normal'|'schwer'|'sehrSchwer')
        get difficulty() {
            return currentDifficulty;
        },
        set difficulty(d) {
            currentDifficulty = d;
        },

        // Kalender-Position fuer Monatsansicht
        get calYear() {
            return calYear;
        },
        set calYear(y) {
            calYear = y;
        },

        get calMonth() {
            return calMonth;
        },
        set calMonth(m) {
            calMonth = m;
        },

        // Zuletzt gezogener Uebungs-Text (fuer "Nochmal")
        get lastText() {
            return lastText;
        },
        set lastText(t) {
            lastText = t;
        },

        /** Setzt alle Uebungs-bezogenen Werte zurueck (nicht Kalender/View). */
        resetExerciseState() {
            currentTopic = null;
            currentLevel = null;
            currentDifficulty = 'normal';
            lastText = null;
        }
    };
})();
