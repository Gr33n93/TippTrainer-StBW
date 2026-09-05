import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function createMemoryStorage(initial = {}) {
    const values = new Map(Object.entries(initial));
    let failingKeys = [];

    return {
        get length() {
            return values.size;
        },
        key(index) {
            return [...values.keys()][index] ?? null;
        },
        getItem(key) {
            return values.has(String(key)) ? values.get(String(key)) : null;
        },
        setItem(key, value) {
            const normalizedKey = String(key);
            if (normalizedKey === failingKeys[0]) {
                failingKeys.shift();
                throw new Error(`Quota exceeded for ${normalizedKey}`);
            }
            values.set(normalizedKey, String(value));
        },
        removeItem(key) {
            values.delete(String(key));
        },
        clear() {
            values.clear();
        },
        failNextSetFor(key) {
            failingKeys = [String(key)];
        },
        failSetSequence(keys) {
            failingKeys = keys.map(String);
        },
        dump() {
            return Object.fromEntries(values);
        }
    };
}

export function createBrowserContext(options = {}) {
    let now = options.now ?? Date.parse('2026-06-15T10:00:00.000Z');
    let nextTimerId = 1;
    const intervals = new Map();
    const localStorage = options.localStorage ?? createMemoryStorage();

    class FakeDate extends Date {
        constructor(...args) {
            super(...(args.length === 0 ? [now] : args));
        }

        static now() {
            return now;
        }
    }

    const context = vm.createContext({
        console: options.console ?? console,
        localStorage,
        Date: FakeDate,
        Blob,
        URL,
        setTimeout,
        clearTimeout,
        setInterval(callback) {
            const id = nextTimerId++;
            intervals.set(id, callback);
            return id;
        },
        clearInterval(id) {
            intervals.delete(id);
        },
        ...options.globals
    });

    context.globalThis = context;
    context.window = options.window ?? context;
    context.advanceTime = (milliseconds) => {
        now += milliseconds;
    };
    context.runIntervals = () => {
        for (const callback of [...intervals.values()]) callback();
    };
    context.activeIntervalCount = () => intervals.size;
    return context;
}

export function createDomContext(html = '<!doctype html><html><body></body></html>', options = {}) {
    const dom = new JSDOM(html, {
        runScripts: 'outside-only',
        url: 'http://localhost/',
        pretendToBeVisual: true
    });
    const context = dom.getInternalVMContext();
    if (options.now !== undefined) {
        const RealDate = context.Date;
        const now = options.now;
        context.Date = class extends RealDate {
            constructor(...args) {
                super(...(args.length === 0 ? [now] : args));
            }

            static now() {
                return now;
            }
        };
    }
    return { context, dom };
}

export function loadScript(context, relativePath, exportName) {
    const absolutePath = path.join(ROOT, relativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');
    const expose = exportName ? `\nglobalThis.${exportName} = ${exportName};` : '';
    vm.runInContext(source + expose, context, { filename: absolutePath });
    return exportName ? context[exportName] : undefined;
}

export function loadScripts(context, modules) {
    for (const [relativePath, exportName] of modules) {
        loadScript(context, relativePath, exportName);
    }
    return context;
}

export function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

export function inRealm(context, value) {
    const serialized = JSON.stringify(value);
    return vm.runInContext(`JSON.parse(${JSON.stringify(serialized)})`, context);
}

export function sampleSession(overrides = {}) {
    const session = {
        id: 'session-1',
        text: 'Soll und Haben',
        totalChars: 14,
        correctChars: 14,
        incorrectChars: 0,
        accuracy: 100,
        wpm: 42,
        cpm: 210,
        elapsedSeconds: 4,
        avgTimePerChar: 285,
        timestamp: '2026-06-15T10:00:00.000Z',
        topic: 'buchfuehrung',
        level: 1,
        difficulty: 'normal',
        ...overrides
    };
    if (
        Object.prototype.hasOwnProperty.call(overrides, 'totalChars') &&
        !Object.prototype.hasOwnProperty.call(overrides, 'correctChars') &&
        !Object.prototype.hasOwnProperty.call(overrides, 'incorrectChars')
    ) {
        session.correctChars = session.totalChars;
        session.incorrectChars = 0;
    }
    return session;
}

export const projectRoot = ROOT;
