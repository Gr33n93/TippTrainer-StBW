import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';

const require = createRequire(import.meta.url);
const { scaleCssCoordinate } = require('./helpers/electron-input.cjs');

describe('Electron-Eingabekoordinaten', () => {
    it('bewahrt CSS-Koordinaten bei normalem Zoom', () => {
        assert.equal(scaleCssCoordinate(120, 1), 120);
    });

    it('übersetzt CSS-Pixel bei 200 Prozent Zoom in Widget-Pixel', () => {
        assert.equal(scaleCssCoordinate(120, 2), 240);
    });

    it('rundet erst nach der Skalierung auf ein Eingabepixel', () => {
        assert.equal(scaleCssCoordinate(12.25, 2), 25);
    });
});
