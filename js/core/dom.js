'use strict';

/**
 * DOM- und Rendering-Utilities.
 *
 * Zentrale Anlaufstelle fuer haeufig genutzte Helper, die vorher in app.js
 * als _escapeHtml, _confirm, _showToast usw. verstreut waren.
 */
const Dom = (() => {
    const HTML_ESCAPES = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    /** HTML-Escaping fuer sichere innerHTML-Zuweisungen. */
    function escapeHtml(text) {
        if (text == null) return '';
        return String(text).replace(/[&<>"']/g, (m) => HTML_ESCAPES[m]);
    }

    /** Kurzform fuer document.getElementById. */
    function byId(id) {
        return document.getElementById(id);
    }

    /** Kurzform fuer document.querySelectorAll. */
    function all(selector, root = document) {
        return root.querySelectorAll(selector);
    }

    /** window.confirm-Wrapper (fuer Mocks/Tests). */
    function confirm(message) {
        return window.confirm(message);
    }

    /**
     * Zeigt einen Toast an (4s Auto-Dismiss).
     * Icon, Titel und Text werden escaped.
     */
    function showToast(icon, title, text) {
        const container = byId('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">${escapeHtml(String(icon))}</span>
            <div>
                <div class="toast-title">${escapeHtml(String(title))}</div>
                <div class="toast-text">${escapeHtml(String(text))}</div>
            </div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 4000);
    }

    /**
     * Rendert eine Stat-Card als HTML-String.
     * @param {string|number} value - Angezeigter Wert
     * @param {string} label - Beschriftung
     * @param {string} [modifier=''] - optionale CSS-Klasse (success/warning)
     */
    function statCard(value, label, modifier = '') {
        const cls = modifier ? `stat-card ${modifier}` : 'stat-card';
        return `<div class="${cls}"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
    }

    /** Klassifizierung fuer Accuracy-Anzeige (good/warn/bad). */
    function classifyAccuracy(acc) {
        return acc >= 95 ? 'good' : acc >= 85 ? 'warn' : 'bad';
    }

    /** Klassifizierung fuer WPM-Anzeige (good/warn/bad). */
    function classifyWpm(wpm) {
        return wpm >= 60 ? 'good' : wpm >= 35 ? 'warn' : 'bad';
    }

    /** Formatierung: deutsches Datum. */
    function formatDate(timestamp, opts = { day: '2-digit', month: '2-digit' }) {
        return new Date(timestamp).toLocaleDateString('de-DE', opts);
    }

    /** Formatierung: Zeit im m:ss-Format aus Sekunden. */
    function formatTime(seconds) {
        const total = Math.floor(seconds || 0);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    return {
        escapeHtml,
        byId,
        all,
        confirm,
        showToast,
        statCard,
        classifyAccuracy,
        classifyWpm,
        formatDate,
        formatTime
    };
})();
