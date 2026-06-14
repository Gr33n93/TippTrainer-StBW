'use strict';

/**
 * View-Router: Steuert die SPA-Navigation zwischen den Views.
 *
 * Views registrieren sich mit ihrem Namen und einer Render-Funktion.
 * Der Router schaltet beim Wechsel die .active-Klassen um und ruft
 * die zugehoerige Render-Funktion auf.
 */
const Router = (() => {
    const views = new Map();

    /**
     * Registriert eine View mit ihrem Render-Callback.
     * @param {string} name - View-Name (z. B. 'dashboard')
     * @param {function} renderFn - wird beim Wechsel in diese View aufgerufen
     */
    function register(name, renderFn) {
        views.set(name, renderFn);
    }

    /** Zeigt die View mit dem gegebenen Namen an. */
    function showView(viewName) {
        State.view = viewName;

        Dom.all('.view').forEach((v) => v.classList.remove('active'));
        Dom.all('.nav-item').forEach((n) => n.classList.remove('active'));

        const viewEl = Dom.byId(`view-${viewName}`);
        if (viewEl) viewEl.classList.add('active');

        const navEl = document.querySelector(`.nav-item[data-view="${viewName}"]`);
        if (navEl) navEl.classList.add('active');

        const renderFn = views.get(viewName);
        if (renderFn) renderFn();
    }

    /** Bindet die Haupt-Navigation (Sidebar + Back-Buttons). */
    function bindNavigation() {
        Dom.all('.nav-item').forEach((item) => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                if (view) showView(view);
                closeMobileSidebar();
            });
        });

        Dom.byId('backToDashboard').addEventListener('click', () => {
            showView('dashboard');
        });

        Dom.byId('typingBack').addEventListener('click', () => {
            Typing.stop();
            showView('levels');
        });
    }

    /** Bindet den Mobile-Hamburger-Toggle. */
    function bindMobileToggle() {
        Dom.byId('mobileToggle').addEventListener('click', () => {
            Dom.byId('sidebar').classList.toggle('open');
        });
    }

    function closeMobileSidebar() {
        Dom.byId('sidebar').classList.remove('open');
    }

    return {
        register,
        showView,
        bindNavigation,
        bindMobileToggle
    };
})();
