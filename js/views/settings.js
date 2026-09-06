'use strict';

/**
 * Settings-View: Pruefungsdatum, Daten-Export/Import und Reset-Optionen.
 */
const SettingsView = (() => {
    const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
    /** Bindet alle Settings-Controls (einmalig beim App-Start). */
    function bind() {
        bindDatePicker();
        bindExport();
        bindImport();
        bindResetLevels();
        bindResetAll();
    }

    function bindDatePicker() {
        const dateInput = Dom.byId('targetDateInput');
        refresh();

        dateInput.addEventListener('change', () => {
            const current = Storage.getSettings();
            current.targetDate = dateInput.value;
            if (!Storage.saveSettings(current)) {
                refresh();
                Dom.showToast('!', 'Speichern fehlgeschlagen', 'Das Prüfungsdatum wurde nicht geändert.');
                return;
            }
            DashboardView.render();
            refresh();
        });
    }

    function refresh() {
        const dateInput = Dom.byId('targetDateInput');
        if (dateInput) {
            const settings = Storage.getSettings();
            dateInput.value = settings.targetDate || Storage.DEFAULT_TARGET_DATE;
        }
        ChromeView.updateCountdown();
        ChromeView.updateDaysUntilLabel();
    }

    function bindExport() {
        Dom.byId('btnExport').addEventListener('click', () => {
            const data = Storage.exportAll();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tipptrainer-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            Dom.showToast('OK', 'Export erfolgreich', 'Daten wurden heruntergeladen.');
        });
    }

    function bindImport() {
        Dom.byId('btnImport').addEventListener('click', () => {
            Dom.byId('importFile').click();
        });

        Dom.byId('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > MAX_IMPORT_BYTES) {
                Dom.showToast('!', 'Import fehlgeschlagen', 'Die Backup-Datei ist größer als 10 MB.');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    if (Storage.importAll(data)) {
                        Dom.showToast('OK', 'Import erfolgreich', 'Alle Daten wurden wiederhergestellt.');
                        ChromeView.updateXPDisplay();
                        DashboardView.render();
                        refresh();
                    } else {
                        Dom.showToast('!', 'Import fehlgeschlagen', 'Ungültiges Dateiformat.');
                    }
                } catch {
                    Dom.showToast('!', 'Import fehlgeschlagen', 'Datei konnte nicht gelesen werden.');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }

    function bindResetLevels() {
        Dom.byId('btnResetLevels').addEventListener('click', () => {
            if (!Dom.confirm('Level-Fortschritt wirklich zurücksetzen?')) return;
            if (!Levels.resetAllProgress()) {
                Dom.showToast('!', 'Zurücksetzen fehlgeschlagen', 'Der Level-Fortschritt blieb erhalten.');
                return;
            }
            Dom.showToast('↺', 'Zurückgesetzt', 'Level-Fortschritt wurde gelöscht.');
            DashboardView.render();
        });
    }

    function bindResetAll() {
        Dom.byId('btnResetAll').addEventListener('click', () => {
            if (!Dom.confirm('ALLE Daten wirklich löschen? Dies kann nicht rückgängig gemacht werden!'))
                return;
            if (!Storage.clearAll()) {
                Dom.showToast('!', 'Löschen fehlgeschlagen', 'Nicht alle Daten konnten entfernt werden.');
                refresh();
                return;
            }
            Dom.showToast('×', 'Gelöscht', 'Alle Daten wurden entfernt.');
            ChromeView.updateXPDisplay();
            DashboardView.render();
            refresh();
        });
    }

    return { bind, refresh };
})();
