import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createBrowserContext, loadScripts, projectRoot } from './helpers/browser-context.js';

const publicDocuments = ['README.md', 'ARCHITECTURE.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md'];

function read(relativePath) {
    return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function localLinks(markdown) {
    const markdownTargets = [...markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)].map(([, target]) => target);
    const referenceTargets = [...markdown.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)].map(([, target]) => target);
    const htmlTargets = [...markdown.matchAll(/(?:href|src)="([^"]+)"/g)].map(([, target]) => target);
    return [...markdownTargets, ...referenceTargets, ...htmlTargets]
        .map((target) => target.split('#')[0])
        .filter((target) => target && !/^(?:https?:|mailto:)/.test(target));
}

function issueFormFields(source) {
    return source
        .split(/\n(?= {4}- type: )/)
        .map((block) => {
            const type = block.match(/^ {4}- type: ([a-z]+)$/m)?.[1];
            if (!type) return null;
            return {
                type,
                id: block.match(/^ {6}id: ([a-z0-9_-]+)$/m)?.[1] ?? null,
                required: /^ {10}required: true$/m.test(block)
            };
        })
        .filter(Boolean);
}

describe('Öffentliche Dokumentation', () => {
    it('verweist ausschließlich auf vorhandene Dateien im Repository', () => {
        for (const document of publicDocuments) {
            for (const target of localLinks(read(document))) {
                const resolved = path.resolve(projectRoot, path.dirname(document), decodeURI(target));
                const relative = path.relative(projectRoot, resolved);
                assert.equal(
                    relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative),
                    false,
                    `${document}: Link verlässt das Repository (${target})`
                );
                assert.equal(fs.existsSync(resolved), true, `${document}: ${target}`);
            }
        }
    });

    it('hält Ko-fi-Verweise in README, Paket und GitHub Funding synchron', () => {
        const expected = 'https://ko-fi.com/nilsarnold';
        const packageJson = JSON.parse(read('package.json'));
        const packageLock = JSON.parse(read('package-lock.json'));
        assert.equal(packageJson.funding, expected);
        assert.equal(packageLock.packages[''].funding.url, expected);
        assert.match(read('README.md'), new RegExp(escapeRegex(expected)));
        assert.match(read('.github/FUNDING.yml'), /^ko_fi: nilsarnold$/m);
    });

    it('dokumentiert den tatsächlichen Text- und Leistungsumfang', () => {
        const context = createBrowserContext();
        loadScripts(context, [
            ['data/texts.js', 'Texts'],
            ['data/texts-extra.js', 'TextsExtra'],
            ['data/texts-sehrSchwer.js', 'TextsSehrSchwer'],
            ['js/services/achievements.js', 'Achievements']
        ]);
        assert.equal(context.Texts.getTotalTextCount(), 960);
        context.TextsExtra.apply();
        assert.equal(context.Texts.getTotalTextCount(), 1620);
        context.TextsSehrSchwer.apply();

        assert.equal(context.Texts.getTotalTextCount(), 1940);
        assert.equal(context.Achievements.getTotalCount(), 32);
        let poolCount = 0;
        for (const topic of context.Texts.getAllTopics()) {
            for (let level = 1; level <= 10; level += 1) {
                for (const difficulty of Object.keys(context.Texts.DIFFICULTY_NAMES)) {
                    const pool = context.Texts.getTexts(topic, level, difficulty);
                    assert.equal(new Set(pool).size, pool.length, `${topic}/${level}/${difficulty}`);
                    poolCount += 1;
                }
            }
        }
        assert.equal(poolCount, 160);
        assert.match(
            read('README.md'),
            /1\.940 Übungstexte in 160 Auswahlpools, jeweils ohne interne Dubletten/
        );
        assert.match(read('README.md'), /32 Leistungen/);
        assert.match(read('ARCHITECTURE.md'), /960 Basistexte, 660 Ergänzungen und 320 Texte/);
        assert.match(
            read('build/de.gr33n93.TippTrainer.metainfo.xml'),
            /1\.940 fachbezogene Übungstexte in 160 Auswahlpools/
        );
        assert.doesNotMatch(read('README.md'), /ohne Wiederholungen/);
    });

    it('verwendet dauerhafte Release-Links und valide Screenshot-Dateien', () => {
        const readme = read('README.md');
        const metaInfo = read('build/de.gr33n93.TippTrainer.metainfo.xml');
        assert.match(readme, /https:\/\/github\.com\/Gr33n93\/TippTrainer-StBW\/releases\/latest/);
        for (const image of ['docs/screenshots/dashboard.png', 'docs/screenshots/typing.png']) {
            assert.match(readme, new RegExp(escapeRegex(image)));
            assert.match(
                metaInfo,
                new RegExp(
                    escapeRegex(`https://raw.githubusercontent.com/Gr33n93/TippTrainer-StBW/main/${image}`)
                )
            );
            const png = fs.readFileSync(path.join(projectRoot, image));
            assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], image);
            assert.equal(png.toString('ascii', 12, 16), 'IHDR', image);
            assert.ok(png.readUInt32BE(16) >= 1200, `${image}: Breite`);
            assert.ok(png.readUInt32BE(20) >= 700, `${image}: Höhe`);
        }
        const packageJson = JSON.parse(read('package.json'));
        assert.match(read('CHANGELOG.md'), new RegExp(`\\[${escapeRegex(packageJson.version)}\\]`));
    });

    it('enthält in den Hauptdokumenten keine internen Sitzungs- oder Review-Protokolle', () => {
        const combined = publicDocuments.map(read).join('\n');
        assert.doesNotMatch(combined, /\bSession [0-9]+\b|\bReview-Protokoll\b/i);
        assert.equal(fs.existsSync(path.join(projectRoot, 'PROGRESS.md')), false);
    });

    it('hält Projekt- und Lizenzmetadaten konsistent', () => {
        const packageJson = JSON.parse(read('package.json'));
        const packageLock = JSON.parse(read('package-lock.json'));
        const metaInfo = read('build/de.gr33n93.TippTrainer.metainfo.xml');
        assert.equal(packageJson.homepage, 'https://github.com/Gr33n93/TippTrainer-StBW');
        assert.equal(packageJson.repository.url, 'https://github.com/Gr33n93/TippTrainer-StBW.git');
        assert.equal(packageJson.bugs.url, 'https://github.com/Gr33n93/TippTrainer-StBW/issues');
        assert.equal(packageJson.license, 'MIT');
        assert.equal(packageLock.packages[''].license, packageJson.license);
        assert.match(metaInfo, /<project_license>MIT<\/project_license>/);
        assert.match(read('LICENSE'), /Copyright \(c\) 2026 gr33n93/);
    });

    it('stellt vollständige und eindeutige GitHub-Issue-Formulare bereit', () => {
        const forms = [
            {
                form: '.github/ISSUE_TEMPLATE/bug_report.yml',
                label: 'bug',
                fields: [
                    { type: 'markdown', id: null, required: false },
                    { type: 'textarea', id: 'description', required: true },
                    { type: 'textarea', id: 'steps', required: true },
                    { type: 'input', id: 'environment', required: true },
                    { type: 'textarea', id: 'logs', required: false }
                ]
            },
            {
                form: '.github/ISSUE_TEMPLATE/feature_request.yml',
                label: 'enhancement',
                fields: [
                    { type: 'markdown', id: null, required: false },
                    { type: 'textarea', id: 'problem', required: true },
                    { type: 'textarea', id: 'proposal', required: true },
                    { type: 'textarea', id: 'alternatives', required: false }
                ]
            }
        ];

        for (const { form, label, fields } of forms) {
            const source = read(form);
            assert.match(source, /^name: .+$/m, form);
            assert.match(source, /^description: .+$/m, form);
            assert.match(source, /^body:$/m, form);
            assert.match(source, new RegExp(`^labels: \\[${label}\\]$`, 'm'), form);
            assert.deepEqual(issueFormFields(source), fields, `${form}: Felder`);
            const ids = fields.map(({ id }) => id).filter(Boolean);
            assert.equal(new Set(ids).size, ids.length, `${form}: doppelte Feld-ID`);
        }

        const config = read('.github/ISSUE_TEMPLATE/config.yml');
        assert.match(config, /^blank_issues_enabled: false$/m);
        assert.match(config, /^contact_links:$/m);
        assert.match(
            config,
            /url: https:\/\/github\.com\/Gr33n93\/TippTrainer-StBW\/security\/advisories\/new/
        );
    });
});
