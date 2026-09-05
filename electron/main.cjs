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

// Produktiv-Modus: Dateien liegen unterdist/, in Dev unter Projekt-Root
const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: 'TippTrainer StBW',
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#0d1117',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            webSecurity: true
        }
    });

    // index.html laden - in Dev und Paket relativ zum Electron-Hauptprozess
    const indexPath = path.join(__dirname, isDev ? '..' : '..', 'index.html');
    const appUrl = pathToFileURL(indexPath).toString();
    win.loadFile(indexPath);

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
}

function isExternalHttpUrl(value) {
    try {
        const { protocol } = new URL(value);
        return protocol === 'http:' || protocol === 'https:';
    } catch {
        return false;
    }
}

// App-Lifecycle
app.whenReady().then(() => {
    createWindow();

    // macOS: neues Fenster bei Dock-Click, wenn keines offen
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Fenster schliessen beendet App (ausser macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
