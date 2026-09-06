import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { projectRoot } from './helpers/browser-context.js';

function read(relativePath) {
    return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function workflowJob(workflow, jobId) {
    const lines = workflow.split(/\r?\n/);
    const start = lines.findIndex((line) => line === `    ${jobId}:`);
    assert.notEqual(start, -1, `Workflow-Job ${jobId} fehlt`);

    let end = start + 1;
    while (end < lines.length && !/^ {4}[a-zA-Z0-9_-]+:\s*$/.test(lines[end])) end += 1;
    return lines.slice(start, end).join('\n');
}

describe('Packaging und CI', () => {
    const packageJson = JSON.parse(read('package.json'));
    const packageLock = JSON.parse(read('package-lock.json'));
    const builder = read('electron-builder.yml');
    const metaInfo = read('build/de.gr33n93.TippTrainer.metainfo.xml');
    const desktopPath = `build/${packageJson.desktopName}`;

    it('hält Paket-, Lockfile- und neueste AppStream-Version synchron', () => {
        const newestAppStreamRelease = metaInfo.match(
            /<releases>\s*<release version="([^"]+)" date="([^"]+)">/
        );
        assert.equal(packageLock.version, packageJson.version);
        assert.equal(packageLock.packages[''].version, packageJson.version);
        assert.equal(newestAppStreamRelease?.[1], packageJson.version);
        assert.match(newestAppStreamRelease?.[2] || '', /^\d{4}-\d{2}-\d{2}$/);
    });

    it('verwendet eine konsistente Desktop- und AppStream-Identität', () => {
        const appId = packageJson.desktopName.replace(/\.desktop$/, '');
        assert.match(builder, new RegExp(`appId: ${appId}`));
        assert.match(builder, /executableName: tipptrainer-stbw/);
        assert.match(builder, /syncDesktopName: true/);
        assert.match(metaInfo, new RegExp(`<launchable type="desktop-id">${packageJson.desktopName}</`));
        assert.match(metaInfo, /<developer_name>gr33n93<\/developer_name>/);
        assert.doesNotMatch(metaInfo, /<developer(?:\s|>)/);
        assert.doesNotMatch(metaInfo, /<url type="vcs-browser">/);
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
        assert.match(
            builder,
            /appImage:\s+[\s\S]*?artifactName: TippTrainer-StBW-\$\{version\}-\$\{arch\}\.AppImage/
        );
    });

    it('erzwingt im AppImage keinen globalen Chromium-Sandbox-Opt-out', () => {
        const qualityWorkflow = read('.github/workflows/lint.yml');
        assert.match(builder, /appImage:\s+[\s\S]*?executableArgs: \[\]/);
        assert.doesNotMatch(builder, /--no-sandbox/);
        assert.doesNotMatch(builder, /--filesystem=home/);
        assert.match(qualityWorkflow, /sudo chown root:root .*\/chrome-sandbox/);
        assert.match(qualityWorkflow, /sudo chmod 4755 .*\/chrome-sandbox/);
        assert.match(qualityWorkflow, /--disable-gpu --smoke-test/);
        assert.match(qualityWorkflow, /test "\$status" -eq 0/);
        assert.doesNotMatch(qualityWorkflow, /"\$status" -eq 124/);
    });

    it('prüft das responsive Layout im echten Electron-Browser', () => {
        const qualityWorkflow = read('.github/workflows/lint.yml');
        const releaseWorkflow = read('.github/workflows/build.yml');
        const metadataCompatJob = workflowJob(qualityWorkflow, 'metadata-compat');
        const packageSmokeJob = workflowJob(qualityWorkflow, 'package-smoke');
        assert.equal(packageJson.scripts['test:layout'], 'electron tests/electron-layout.cjs');
        assert.match(qualityWorkflow, /sudo apt-get install --yes appstream desktop-file-utils xvfb/);
        assert.match(metadataCompatJob, /runs-on: ubuntu-22\.04/);
        assert.match(metadataCompatJob, /sudo apt-get install --yes appstream desktop-file-utils/);
        assert.match(
            metadataCompatJob,
            /appstreamcli validate --no-net build\/de\.gr33n93\.TippTrainer\.metainfo\.xml/
        );
        assert.match(metadataCompatJob, /desktop-file-validate build\/de\.gr33n93\.TippTrainer\.desktop/);
        assert.match(packageSmokeJob, /needs: \[quality, metadata-compat\]/);
        assert.match(packageSmokeJob, /if: always\(\)/);
        assert.match(packageSmokeJob, /test "\$\{\{ needs\.quality\.result \}\}" = "success"/);
        assert.match(packageSmokeJob, /test "\$\{\{ needs\.metadata-compat\.result \}\}" = "success"/);
        assert.match(
            qualityWorkflow,
            /node node_modules\/electron\/install\.js[\s\S]*sudo chown root:root node_modules\/electron\/dist\/chrome-sandbox/
        );
        assert.match(
            qualityWorkflow,
            /xvfb-run -a npm run test:layout -- dist-electron\/linux-unpacked\/resources\/app\.asar/
        );
        assert.match(qualityWorkflow, /sudo chown root:root node_modules\/electron\/dist\/chrome-sandbox/);
        assert.match(qualityWorkflow, /sudo chmod 4755 node_modules\/electron\/dist\/chrome-sandbox/);
        assert.match(releaseWorkflow, /sudo apt-get install --yes appstream desktop-file-utils xvfb/);
        assert.match(releaseWorkflow, /appstreamcli validate --no-net/);
        assert.match(releaseWorkflow, /desktop-file-validate/);
        assert.match(
            releaseWorkflow,
            /node node_modules\/electron\/install\.js[\s\S]*sudo chown root:root node_modules\/electron\/dist\/chrome-sandbox/
        );
        assert.match(
            releaseWorkflow,
            /xvfb-run -a npm run test:layout -- dist-electron\/linux-unpacked\/resources\/app\.asar/
        );
        assert.match(releaseWorkflow, /sudo chown root:root node_modules\/electron\/dist\/chrome-sandbox/);
        assert.match(releaseWorkflow, /sudo chmod 4755 node_modules\/electron\/dist\/chrome-sandbox/);
        assert.match(releaseWorkflow, /tipptrainer-stbw --disable-gpu --smoke-test/);
        assert.match(releaseWorkflow, /test "\$status" -eq 0/);
    });
});
