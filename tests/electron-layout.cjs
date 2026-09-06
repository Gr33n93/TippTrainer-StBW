'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { app } = require('electron');
const { createWindow } = require('../electron/main.cjs');
const { scaleCssCoordinate } = require('./helpers/electron-input.cjs');

const projectRoot = path.resolve(__dirname, '..');
const testedAppRoot = process.argv[2] ? path.resolve(process.argv[2]) : projectRoot;

app.commandLine.appendSwitch('disable-gpu');

async function settle() {
    await new Promise((resolve) => setTimeout(resolve, 50));
}

async function waitForRenderer(window, expression, description) {
    const deadline = Date.now() + 3000;
    do {
        if (await window.webContents.executeJavaScript(`Boolean(${expression})`)) return;
        await settle();
    } while (Date.now() < deadline);
    assert.fail(`${description}: Zustand nach 3 Sekunden nicht erreicht`);
}

async function setViewport(window, width, height) {
    window.setContentSize(width, height);
    const deadline = Date.now() + 3000;
    let viewport;
    do {
        await settle(window);
        viewport = await window.webContents.executeJavaScript('[innerWidth, innerHeight]');
    } while ((viewport[0] !== width || viewport[1] !== height) && Date.now() < deadline);
    assert.deepEqual(viewport, [width, height]);
}

async function clickElement(window, selector) {
    const clickMarker = `native-click-${Date.now()}-${Math.random()}`;
    const target = await window.webContents.executeJavaScript(`(() => {
        const element = document.querySelector(${JSON.stringify(selector)});
        if (!element) return { found: false };
        element.addEventListener('click', event => {
            window.__layoutNativeClick = {
                marker: ${JSON.stringify(clickMarker)},
                trusted: event.isTrusted
            };
        }, { once: true });
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const hit = document.elementFromPoint(x, y);
        return {
            found: true,
            hit: hit === element || element.contains(hit),
            pointerEvents: getComputedStyle(element).pointerEvents,
            x,
            y
        };
    })()`);
    assert.equal(target.found, true, selector);
    assert.equal(target.hit, true, `${selector}: Mittelpunkt nicht klickbar`);
    assert.notEqual(target.pointerEvents, 'none', `${selector}: pointer-events`);
    const zoomFactor = window.webContents.getZoomFactor();
    const x = scaleCssCoordinate(target.x, zoomFactor);
    const y = scaleCssCoordinate(target.y, zoomFactor);
    window.webContents.sendInputEvent({ type: 'mouseMove', x, y });
    window.webContents.sendInputEvent({
        type: 'mouseDown',
        x,
        y,
        button: 'left',
        clickCount: 1
    });
    window.webContents.sendInputEvent({
        type: 'mouseUp',
        x,
        y,
        button: 'left',
        clickCount: 1
    });
    await waitForRenderer(
        window,
        `window.__layoutNativeClick?.marker === ${JSON.stringify(clickMarker)} && window.__layoutNativeClick.trusted`,
        `${selector}: nativen Klick verarbeiten`
    );
}

async function activateNavigationView(window, viewName) {
    const mobileDrawerClosed = await window.webContents.executeJavaScript(`
        innerWidth <= 768 && !document.getElementById('sidebar').classList.contains('open')
    `);
    if (mobileDrawerClosed) {
        await clickElement(window, '#mobileToggle');
        await waitForRenderer(
            window,
            "document.getElementById('sidebar').classList.contains('open') && !document.getElementById('sidebar').inert && document.querySelector('.main-content').inert",
            'Mobile Navigation öffnen'
        );
    }
    await clickElement(window, `.nav-item[data-view="${viewName}"]`);
    await waitForRenderer(
        window,
        `State.view === ${JSON.stringify(viewName)} && document.querySelectorAll('.view.active').length === 1 && document.querySelector('.view.active')?.id === ${JSON.stringify(`view-${viewName}`)} && document.querySelector('.nav-item[aria-current="page"]')?.dataset.view === ${JSON.stringify(viewName)} && !document.getElementById('sidebar').classList.contains('open') && !document.querySelector('.main-content').inert && (innerWidth > 768 || document.getElementById('sidebar').inert)`,
        `Navigation zu ${viewName}`
    );
}

async function inspectView(window, viewName) {
    if (viewName !== 'typing') {
        await activateNavigationView(window, viewName);
    }
    await settle(window);
    return window.webContents.executeJavaScript(`(() => {
        const active = document.querySelector('.view.active');
        const rect = active.getBoundingClientRect();
        const style = getComputedStyle(active);
        const sidebarRect = document.getElementById('sidebar').getBoundingClientRect();
        return {
            id: active.id,
            count: document.querySelectorAll('.view.active').length,
            display: style.display,
            visibility: style.visibility,
            opacity: Number(style.opacity),
            pointerEvents: style.pointerEvents,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: innerWidth,
            heading: active.querySelector('h2')?.textContent.trim() || '',
            clearsDesktopSidebar: innerWidth <= 768 || rect.left >= sidebarRect.right
        };
    })()`);
}

async function assertViewsFit(window, viewNames) {
    for (const viewName of viewNames) {
        const view = await inspectView(window, viewName);
        assert.equal(view.id, `view-${viewName}`);
        assert.equal(view.count, 1);
        assert.notEqual(view.display, 'none');
        assert.equal(view.visibility, 'visible');
        assert.ok(view.opacity > 0);
        assert.notEqual(view.pointerEvents, 'none');
        assert.ok(view.left >= 0, `${viewName}: linker Rand`);
        assert.ok(view.right <= view.viewportWidth, `${viewName}: rechter Rand`);
        assert.equal(view.clearsDesktopSidebar, true, `${viewName}: Sidebar überdeckt Inhalt`);
        assert.ok(view.width > 0, `${viewName}: Breite`);
        assert.ok(view.height > 0, `${viewName}: Höhe`);
        assert.ok(view.heading, `${viewName}: Überschrift`);
        assert.ok(
            view.documentWidth <= view.viewportWidth,
            `${viewName}: ${view.documentWidth}px Dokument bei ${view.viewportWidth}px Viewport`
        );
    }
}

async function seedThirtySessions(window) {
    const saved = await window.webContents.executeJavaScript(`Storage.saveProgress(
        Array.from({ length: 30 }, (_, index) => ({
            id: 'layout-' + index,
            text: 'Soll und Haben',
            totalChars: 14,
            correctChars: 14,
            incorrectChars: 0,
            accuracy: 85 + (index % 16),
            wpm: 30 + index,
            cpm: (30 + index) * 5,
            elapsedSeconds: 60,
            avgTimePerChar: 285,
            timestamp: new Date(Date.UTC(2026, 7, index + 1, 10)).toISOString(),
            topic: 'buchfuehrung',
            level: 1,
            difficulty: 'normal'
        }))
    )`);
    assert.equal(saved, true);
    const calendarSaved = await window.webContents.executeJavaScript(`(() => {
        const today = Calendar.getLocalDateKey();
        const result = Storage.saveCalendarData({
            [today]: {
                totalSeconds: 720,
                exercises: 2,
                firstAt: new Date().toISOString(),
                lastAt: new Date().toISOString()
            }
        });
        DashboardView.render();
        ProgressView.render();
        CalendarView.render();
        return result;
    })()`);
    assert.equal(calendarSaved, true);
}

async function run() {
    const window = await createWindow({
        appRoot: testedAppRoot,
        show: true,
        allowSmallViewport: true,
        partition: `layout-test-${Date.now()}`
    });
    await window.webContents.insertCSS(`
        *, *::before, *::after {
            animation-delay: 0s !important;
            animation-duration: 0s !important;
            transition-delay: 0s !important;
            transition-duration: 0s !important;
        }
    `);
    const productionShell = await window.webContents.executeJavaScript(`(() => ({
        title: document.title,
        nodeUnavailable: typeof require === 'undefined' && typeof process === 'undefined'
    }))()`);
    const preferences = window.webContents.getLastWebPreferences();
    assert.equal(productionShell.title, 'TippTrainer StBW');
    assert.equal(productionShell.nodeUnavailable, true);
    assert.equal(preferences.contextIsolation, true);
    assert.equal(preferences.nodeIntegration, false);
    assert.equal(preferences.sandbox, true);

    await seedThirtySessions(window);
    const navigationViews = ['dashboard', 'levels', 'calendar', 'achievements', 'progress', 'settings'];

    await setViewport(window, 1280, 800);
    await assertViewsFit(window, navigationViews);
    window.focus();
    window.webContents.focus();
    await settle(window);
    await activateNavigationView(window, 'dashboard');
    await window.webContents.executeJavaScript("document.querySelector('.topic-card').focus()");
    await settle(window);
    const topicFocus = await window.webContents.executeJavaScript(`(() => ({
        focused: document.activeElement.matches('.topic-card'),
        shadow: getComputedStyle(document.activeElement).boxShadow
    }))()`);
    assert.equal(topicFocus.focused, true);
    assert.notEqual(topicFocus.shadow, 'none');

    await activateNavigationView(window, 'levels');
    await window.webContents.executeJavaScript(
        "document.querySelector('.level-btn:not([disabled])').focus()"
    );
    await settle(window);
    const levelFocus = await window.webContents.executeJavaScript(`(() => ({
        focused: document.activeElement.matches('.level-btn'),
        shadow: getComputedStyle(document.activeElement).boxShadow
    }))()`);
    assert.equal(levelFocus.focused, true);
    assert.notEqual(levelFocus.shadow, 'none');

    await setViewport(window, 769, 800);
    const desktopChrome = await window.webContents.executeJavaScript(`(() => ({
        toggle: getComputedStyle(document.getElementById('mobileToggle')).display,
        sidebarLeft: document.getElementById('sidebar').getBoundingClientRect().left,
        sidebarInert: document.getElementById('sidebar').inert
    }))()`);
    assert.equal(desktopChrome.toggle, 'none');
    assert.equal(desktopChrome.sidebarLeft, 0);
    assert.equal(desktopChrome.sidebarInert, false);

    await setViewport(window, 768, 800);
    const closedDrawer = await window.webContents.executeJavaScript(`(() => ({
        toggle: getComputedStyle(document.getElementById('mobileToggle')).display,
        sidebarRight: document.getElementById('sidebar').getBoundingClientRect().right,
        sidebarInert: document.getElementById('sidebar').inert,
        ariaHidden: document.getElementById('sidebar').getAttribute('aria-hidden')
    }))()`);
    assert.notEqual(closedDrawer.toggle, 'none');
    assert.ok(closedDrawer.sidebarRight <= 0);
    assert.equal(closedDrawer.sidebarInert, true);
    assert.equal(closedDrawer.ariaHidden, 'true');

    await clickElement(window, '#mobileToggle');
    const openDrawer = await window.webContents.executeJavaScript(`(() => {
        const rect = document.getElementById('sidebar').getBoundingClientRect();
        return {
            left: rect.left,
            right: rect.right,
            mainInert: document.querySelector('.main-content').inert,
            expanded: document.getElementById('mobileToggle').getAttribute('aria-expanded'),
            backdrop: getComputedStyle(document.getElementById('sidebarBackdrop')).display
        };
    })()`);
    assert.ok(openDrawer.left >= 0 && openDrawer.right <= 768);
    assert.equal(openDrawer.mainInert, true);
    assert.equal(openDrawer.expanded, 'true');
    assert.notEqual(openDrawer.backdrop, 'none');
    window.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'ESC' });
    window.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'ESC' });
    await settle(window);

    for (const [width, height] of [
        [540, 800],
        [390, 844],
        [320, 568]
    ]) {
        await setViewport(window, width, height);
        await assertViewsFit(window, navigationViews);
    }

    await activateNavigationView(window, 'dashboard');
    const dashboardDataLayout = await window.webContents.executeJavaScript(`(() => {
        const wrapper = document.querySelector('#recentSessions .sessions-scroll');
        const table = document.querySelector('#recentSessions .sessions-table');
        return {
            contained: document.documentElement.scrollWidth <= innerWidth,
            scrollable: wrapper.scrollWidth > wrapper.clientWidth,
            overflow: getComputedStyle(wrapper).overflowX,
            tableWidth: table.scrollWidth
        };
    })()`);
    assert.equal(dashboardDataLayout.contained, true);
    assert.equal(dashboardDataLayout.scrollable, true);
    assert.equal(dashboardDataLayout.overflow, 'auto');
    assert.ok(dashboardDataLayout.tableWidth > 0);

    await activateNavigationView(window, 'progress');
    const progressDataLayout = await window.webContents.executeJavaScript(`(() => ({
        progressTableContained: document.documentElement.scrollWidth <= innerWidth,
        progressTableScrollable:
            document.querySelector('#sessionsTable').parentElement.scrollWidth >
            document.querySelector('#sessionsTable').parentElement.clientWidth,
        barsPerChart: [
            document.querySelectorAll('#wpmChart .bar').length,
            document.querySelectorAll('#accuracyChart .bar').length
        ],
        chartTabStops: document.querySelectorAll('.bar-chart .bar[tabindex="0"]').length,
        chartScrolls: [...document.querySelectorAll('.progress-chart .bar-chart')].every(
            chart => chart.parentElement.scrollWidth > chart.parentElement.clientWidth
        ),
        calendarListItems: document.querySelectorAll('#calendarDays [role="listitem"]').length,
        calendarGridCells: document.querySelectorAll('#calendarDays [role="gridcell"]').length,
        calendarMinutes: document.querySelector('#calendarDays .calendar-day-minutes')?.textContent,
        thirdKpiBorder: getComputedStyle(document.querySelector('#progressStats .stat-card:nth-child(3)')).borderRightWidth,
        fourthKpiBorder: getComputedStyle(document.querySelector('#progressStats .stat-card:nth-child(4)')).borderBottomWidth,
        lastKpiColumns: getComputedStyle(document.querySelector('#progressStats .stat-card:last-child')).gridColumnEnd
    }))()`);
    assert.equal(progressDataLayout.progressTableContained, true);
    assert.equal(progressDataLayout.progressTableScrollable, true);
    assert.deepEqual(progressDataLayout.barsPerChart, [30, 30]);
    assert.equal(progressDataLayout.chartTabStops, 2);
    assert.equal(progressDataLayout.chartScrolls, true);
    assert.ok(progressDataLayout.calendarListItems >= 28);
    assert.equal(progressDataLayout.calendarGridCells, 0);
    assert.equal(progressDataLayout.calendarMinutes, '12m');
    assert.ok(Number.parseFloat(progressDataLayout.thirdKpiBorder) > 0);
    assert.ok(Number.parseFloat(progressDataLayout.fourthKpiBorder) > 0);
    assert.equal(progressDataLayout.lastKpiColumns, '-1');

    await window.webContents.executeJavaScript(`
        State.topic = 'buchfuehrung';
        State.level = 1;
        Texts.getRandomText = () => 'Test';
        TypingView.start();
    `);
    await assertViewsFit(window, ['typing']);
    const resultLayout = await window.webContents.executeJavaScript(`(() => {
        const input = document.getElementById('typingInput');
        input.value = 'Test';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const card = document.getElementById('resultCard').getBoundingClientRect();
        return {
            visible: getComputedStyle(document.getElementById('resultOverlay')).display,
            fits: card.left >= 0 && card.right <= innerWidth && card.top >= 0 && card.bottom <= innerHeight,
            appInert: document.querySelector('.app-container').inert,
            focus: document.activeElement.id,
            titleTag: document.getElementById('resultTitle').tagName,
            toasts: document.querySelectorAll('#toastContainer .toast').length
        };
    })()`);
    assert.notEqual(resultLayout.visible, 'none');
    assert.equal(resultLayout.fits, true);
    assert.equal(resultLayout.appInert, true);
    assert.equal(resultLayout.focus, 'resultCard');
    assert.equal(resultLayout.titleTag, 'H2');
    assert.equal(resultLayout.toasts, 0);

    await setViewport(window, 800, 800);
    const baselineDevicePixelRatio = await window.webContents.executeJavaScript('devicePixelRatio');
    window.webContents.setZoomFactor(2);
    await waitForRenderer(
        window,
        `innerWidth === 400 && innerHeight === 400 && Math.abs(devicePixelRatio - ${JSON.stringify(baselineDevicePixelRatio * 2)}) < 0.01`,
        '200-Prozent-Zoom anwenden'
    );
    await window.webContents.executeJavaScript('ResultView.dismissToLevels()');
    await waitForRenderer(
        window,
        "State.view === 'levels' && document.querySelectorAll('.view.active').length === 1 && document.getElementById('view-levels').classList.contains('active')",
        'Ergebnisdialog zu Levels schließen'
    );
    await assertViewsFit(window, ['dashboard', 'levels', 'settings']);

    window.destroy();
}

app.whenReady()
    .then(run)
    .then(() => app.exit(0))
    .catch((error) => {
        console.error(error);
        app.exit(1);
    });
