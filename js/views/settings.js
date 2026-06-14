'use strict';

/**
 * Settings-View: Pruefungsdatum, Daten-Export/Import und Reset-Optionen.
 */
const SettingsView = (() => {
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
        const settings = Storage.getSettings();
        dateInput.value = settings.targetDate || Storage.DEFAULT_TARGET_DATE;
        ChromeView.updateDaysUntilLabel();

        dateInput.addEventListener('change', () => {
            const newDate = dateInput.value;
            if (!newDate) return;

            const current = Storage.getSettings();
            current.targetDate = newDate;
            Storage.saveSettings(current);
            ChromeView.updateCountdown();
            ChromeView.updateDaysUntilLabel();
            DashboardView.render();
        });
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
            Dom.showToast('✅', 'Export erfolgreich', 'Daten wurden heruntergeladen.');
        });
    }

    function bindImport() {
        Dom.byId('btnImport').addEventListener('click', () => {
            Dom.byId('importFile').click();
        });

        Dom.byId('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    if (Storage.importAll(data)) {
                        Dom.showToast('✅', 'Import erfolgreich', 'Alle Daten wurden wiederhergestellt.');
                        ChromeView.updateXPDisplay();
                        DashboardView.render();
                    } else {
                        Dom.showToast('❌', 'Import fehlgeschlagen', 'Ungültiges Dateiformat.');
                    }
                } catch {
                    Dom.showToast('❌', 'Import fehlgeschlagen', 'Datei konnte nicht gelesen werden.');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }

    function bindResetLevels() {
        Dom.byId('btnResetLevels').addEventListener('click', () => {
            if (!Dom.confirm('Level-Fortschritt wirklich zurücksetzen?')) return;
            Levels.resetAllProgress();
            Dom.showToast('🔄', 'Zurückgesetzt', 'Level-Fortschritt wurde gelöscht.');
            DashboardView.render();
        });
    }

    function bindResetAll() {
        Dom.byId('btnResetAll').addEventListener('click', () => {
            if (!Dom.confirm('ALLE Daten wirklich löschen? Dies kann nicht rückgängig gemacht werden!'))
                return;
            Storage.clearAll();
            Dom.showToast('🗑️', 'Gelöscht', 'Alle Daten wurden entfernt.');
            ChromeView.updateXPDisplay();
            DashboardView.render();
        });
    }

    return { bind };
})();
