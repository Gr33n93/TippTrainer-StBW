// ESLint-Konfiguration fuer TippTrainer StBW
// Vanilla JS mit IIFE-Modul-Pattern (Browser-Globals, keine ES6-Module)
//
// Die Module sind `const X = (() => { ... })()` auf Top-Level und werden
// implizit zu globalen Konstanten. ESLint muss sie als writable globals
// kennen, damit keine no-redeclare/no-undef-False-Positives entstehen.
import js from '@eslint/js';
import globals from 'globals';

const MODULE_NAMES = [
    'State',
    'Dom',
    'Router',
    'Storage',
    'Typing',
    'Texts',
    'TextsExtra',
    'TextsSehrSchwer',
    'Levels',
    'Calendar',
    'Progress',
    'Achievements',
    'Recommendation',
    'SessionCompletion',
    'ChromeView',
    'DashboardView',
    'LevelsView',
    'TypingView',
    'ResultView',
    'CalendarView',
    'AchievementsView',
    'ProgressView',
    'SettingsView',
    'App'
];

const moduleGlobals = Object.fromEntries(MODULE_NAMES.map((name) => [name, 'writable']));
// Top-Level IIFE-Module werden in anderen Dateien verwendet; ESLint ohne
// ES6-Module kann das nicht sehen - diese Konstanten sind explizit erlaubt.
const moduleNamesPattern = '^(' + MODULE_NAMES.join('|') + ')$';

export default [
    js.configs.recommended,
    {
        files: ['js/**/*.js', 'data/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...moduleGlobals
            }
        },
        rules: {
            // Module duerfen als const neu deklariert werden (IIFE-Pattern)
            'no-redeclare': 'off',
            // Top-Level-Module werden in anderen Dateien verwendet; ESLint kann das
            // ohne ES6-Module nicht sehen. Daher nur fuer lokale Variablen aktiv.
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: moduleNamesPattern
                }
            ],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prefer-const': 'error',
            'no-var': 'error',
            eqeqeq: ['error', 'always', { null: 'ignore' }]
        }
    },
    {
        ignores: ['node_modules/', 'dist/', 'build/', '**/*.min.js']
    }
];
