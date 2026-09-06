'use strict';

/**
 * Electron-Hauptprozess.
 *
 * Oeffnet ein BrowserWindow und laedt die index.html der Web-App.
 * Die Web-App bleibt eine reine Vanilla-JS-Anwendung - Electron ist
 * nur der Chrome-Wrapper dafuer.
 *
 * Datei-Endung .cjs, weil package.json auf "type": "module" steht
 * (ESM) - Electron braucht aber CommonJS.
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function createWindow(options = {}) {
    const appRoot = options.appRoot || path.join(__dirname, '..');
    const browserOptions = {
        width: 1280,
        height: 800,
        show: options.show ?? true,
        title: 'TippTrainer StBW',
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#f0ede4',
        webPreferences: {
            preload: path.join(appRoot, 'electron', 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            webSecurity: true,
            ...(options.partition ? { partition: options.partition } : {})
        }
    };
    if (!options.allowSmallViewport) {
        browserOptions.minWidth = 800;
        browserOptions.minHeight = 600;
    }
    const win = new BrowserWindow(browserOptions);

    const indexPath = path.join(appRoot, 'index.html');
    const appUrl = pathToFileURL(indexPath).toString();

    win.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
        callback(false);
    });

    // Top-Level-Navigation darf die lokale App nicht verlassen.
    win.webContents.on('will-navigate', (event, url) => {
        if (url === appUrl) return;
        event.preventDefault();
        if (isExternalHttpUrl(url)) shell.openExternal(url);
    });

    // Externe Links im Standard-Browser oeffnen, nicht in der App
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (isExternalHttpUrl(url)) {
            shell.openExternal(url);
        }
        return { action: 'deny' };
    });

    await win.loadFile(indexPath);
    return win;
}

function isExternalHttpUrl(value) {
    try {
        const { protocol } = new URL(value);
        return protocol === 'http:' || protocol === 'https:';
    } catch {
        return false;
    }
}

async function runApplication() {
    const smokeTest = process.argv.includes('--smoke-test');
    const win = await createWindow({ show: !smokeTest });

    if (smokeTest) {
        const ready = await win.webContents.executeJavaScript(`(() => ({
            title: document.title,
            activeView: document.querySelector('.view.active')?.id,
            topics: document.querySelectorAll('#dashboardTopics .topic-card').length
        }))()`);
        if (
            ready.title !== 'TippTrainer StBW' ||
            ready.activeView !== 'view-dashboard' ||
            ready.topics !== 4
        ) {
            throw new Error(`Renderer-Smoke-Test fehlgeschlagen: ${JSON.stringify(ready)}`);
        }
        win.destroy();
        app.exit(0);
    }
}

if (require.main === module) {
    app.whenReady()
        .then(runApplication)
        .catch((error) => {
            console.error(error);
            app.exit(1);
        });

    // macOS: neues Fenster bei Dock-Click, wenn keines offen
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) void createWindow();
    });

    // Fenster schliessen beendet App (ausser macOS)
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
}

module.exports = { createWindow, isExternalHttpUrl };
