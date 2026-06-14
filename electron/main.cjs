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
            sandbox: true
        }
    });

    // index.html laden - in gepackter App unter dist/, in Dev im Root
    const indexPath = path.join(__dirname, isDev ? '..' : '..', 'index.html');
    win.loadFile(indexPath);

    // Externe Links im Standard-Browser oeffnen, nicht in der App
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'deny' };
    });
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
