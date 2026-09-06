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
        if (State.view === 'typing' && viewName !== 'typing') {
            Typing.stop();
        }
        State.view = viewName;

        Dom.all('.view').forEach((v) => v.classList.remove('active'));
        Dom.all('.nav-item').forEach((n) => n.classList.remove('active'));
        Dom.all('.nav-item').forEach((n) => n.removeAttribute('aria-current'));

        const viewEl = Dom.byId(`view-${viewName}`);
        if (viewEl) viewEl.classList.add('active');

        const navEl = document.querySelector(`.nav-item[data-view="${viewName}"]`);
        if (navEl) {
            navEl.classList.add('active');
            navEl.setAttribute('aria-current', 'page');
        }

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
        const toggle = Dom.byId('mobileToggle');
        toggle.addEventListener('click', () => {
            const sidebar = Dom.byId('sidebar');
            const willOpen = !sidebar.classList.contains('open');
            sidebar.classList.toggle('open');
            syncMobileSidebar();
            if (willOpen) {
                const activeItem = sidebar.querySelector('.nav-item.active');
                if (activeItem) activeItem.focus();
            }
        });
        Dom.byId('sidebarBackdrop').addEventListener('click', closeMobileSidebar);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && Dom.byId('sidebar').classList.contains('open')) {
                event.preventDefault();
                closeMobileSidebar();
            }
        });
        window.addEventListener('resize', syncMobileSidebar);
        syncMobileSidebar();
    }

    function closeMobileSidebar() {
        const sidebar = Dom.byId('sidebar');
        const wasOpen = sidebar.classList.contains('open');
        sidebar.classList.remove('open');
        syncMobileSidebar();
        if (wasOpen && sidebar.inert) Dom.byId('mobileToggle').focus();
    }

    function syncMobileSidebar() {
        const sidebar = Dom.byId('sidebar');
        const toggle = Dom.byId('mobileToggle');
        const backdrop = Dom.byId('sidebarBackdrop');
        const main = document.querySelector('.main-content');
        const mobile = window.matchMedia
            ? window.matchMedia('(max-width: 768px)').matches
            : window.innerWidth <= 768;
        const open = mobile && sidebar.classList.contains('open');

        sidebar.inert = mobile && !open;
        if (mobile) sidebar.setAttribute('aria-hidden', String(!open));
        else sidebar.removeAttribute('aria-hidden');
        if (main) main.inert = open;
        backdrop.classList.toggle('visible', open);
        backdrop.setAttribute('aria-hidden', String(!open));
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
        toggle.textContent = open ? 'Schließen' : 'Menü';
    }

    return {
        register,
        showView,
        bindNavigation,
        bindMobileToggle,
        syncMobileSidebar
    };
})();
