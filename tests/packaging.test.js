import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { projectRoot } from './helpers/browser-context.js';

function read(relativePath) {
    return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('Packaging und CI', () => {
    const packageJson = JSON.parse(read('package.json'));
    const builder = read('electron-builder.yml');
    const metaInfo = read('build/de.gr33n93.TippTrainer.metainfo.xml');
    const desktopPath = `build/${packageJson.desktopName}`;

    it('verwendet eine konsistente Desktop- und AppStream-Identität', () => {
        const appId = packageJson.desktopName.replace(/\.desktop$/, '');
        assert.match(builder, new RegExp(`appId: ${appId}`));
        assert.match(builder, /executableName: tipptrainer-stbw/);
        assert.match(builder, /syncDesktopName: true/);
        assert.match(metaInfo, new RegExp(`<launchable type="desktop-id">${packageJson.desktopName}</`));
        assert.equal(fs.existsSync(path.join(projectRoot, desktopPath)), true);

        const desktop = read(desktopPath);
        assert.match(desktop, /^Exec=tipptrainer-stbw$/m);
        assert.match(desktop, /^Icon=tipptrainer-stbw$/m);
        assert.match(desktop, new RegExp(`^StartupWMClass=${appId}$`, 'm'));
    });

    it('pinnt alle GitHub Actions auf unveränderliche Commit-SHAs', () => {
        for (const workflow of ['.github/workflows/lint.yml', '.github/workflows/build.yml']) {
            const uses = [...read(workflow).matchAll(/uses:\s+[^@\s]+@([^\s]+)/g)];
            assert.ok(uses.length > 0, workflow);
            for (const [, reference] of uses) assert.match(reference, /^[a-f0-9]{40}$/);
        }
    });

    it('erzeugt eine am Release-Ort prüfbare SHA-256-Datei', () => {
        const workflow = read('.github/workflows/build.yml');
        assert.match(workflow, /working-directory: dist-electron\s+run: sha256sum \.\/\*\.AppImage/);
    });

    it('erzwingt im AppImage keinen globalen Chromium-Sandbox-Opt-out', () => {
        const qualityWorkflow = read('.github/workflows/lint.yml');
        assert.match(builder, /appImage:\s+[\s\S]*?executableArgs: \[\]/);
        assert.doesNotMatch(builder, /--no-sandbox/);
        assert.doesNotMatch(builder, /--filesystem=home/);
        assert.match(qualityWorkflow, /sudo chown root:root .*\/chrome-sandbox/);
        assert.match(qualityWorkflow, /sudo chmod 4755 .*\/chrome-sandbox/);
        assert.match(qualityWorkflow, /xvfb-run -a timeout 10s/);
    });
});
