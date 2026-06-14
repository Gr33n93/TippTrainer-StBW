'use strict';

/**
 * Preload-Script: Laeuft isoliert zwischen Renderer (Web-App) und Main-Prozess.
 *
 * Die Web-App benoetigt aktuell KEINE Node- oder Electron-APIs - sie laeuft
 * pur im Browser. Das Preload existiert nur als Security-Layer, um
 * contextIsolation sauber konfiguriert zu haben. Falls spaeter native APIs
 * gebraucht werden (z. B. Menus, Datei-Dialoge), hier exponieren.
 */

// Aktuell keine Exports - App laeuft vollstaendig im Browser-Kontext
window.addEventListener('DOMContentLoaded', () => {
    document.title = 'TippTrainer StBW';
});
