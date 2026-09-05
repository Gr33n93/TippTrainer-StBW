import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { clone, createBrowserContext, loadScript } from './helpers/browser-context.js';

describe('Typing', () => {
    let context;
    let Typing;

    beforeEach(() => {
        context = createBrowserContext();
        Typing = loadScript(context, 'js/engine/typing.js', 'Typing');
    });

    it('initialisiert eine neue Übung ohne laufenden Timer', () => {
        const result = clone(Typing.start('abc'));
        assert.equal(result.text, 'abc');
        assert.equal(result.displayChars.length, 3);
        assert.deepEqual(clone(Typing.getState()), {
            isActive: true,
            isFinished: false,
            hasStarted: false,
            progress: 0,
            totalChars: 3,
            typedCount: 0
        });
        assert.equal(context.activeIntervalCount(), 0);
    });

    it('startet den Timer erst mit dem ersten Zeichen', () => {
        Typing.start('ab');
        context.advanceTime(5000);
        assert.equal(Typing.getElapsedTime(), 0);
        Typing.handleInput('a');
        assert.equal(context.activeIntervalCount(), 1);
        context.advanceTime(1500);
        assert.equal(Typing.getElapsedTime(), 1.5);
    });

    it('lässt ein falsches letztes Zeichen vor dem Abschluss korrigieren', () => {
        let finishes = 0;
        Typing.start('ab', null, () => finishes++);
        assert.equal(Typing.handleInput('a').correct, true);
        assert.equal(Typing.handleInput('x').isComplete, false);
        assert.equal(Typing.getState().isActive, true);
        assert.equal(finishes, 0);
        Typing.handleBackspace();
        assert.equal(Typing.handleInput('b').isComplete, true);
        assert.equal(finishes, 1);
        assert.deepEqual(
            {
                targetChars: Typing.getFinalStats().targetChars,
                totalChars: Typing.getFinalStats().totalChars,
                correctChars: Typing.getFinalStats().correctChars,
                incorrectChars: Typing.getFinalStats().incorrectChars,
                accuracy: Typing.getFinalStats().accuracy
            },
            { targetChars: 2, totalChars: 3, correctChars: 2, incorrectChars: 1, accuracy: 67 }
        );
    });

    it('nimmt Backspace zurück und erlaubt die Korrektur', () => {
        Typing.start('ab');
        Typing.handleInput('x');
        const removed = Typing.handleBackspace();
        assert.equal(removed.removedChar.char, 'x');
        assert.equal(Typing.getState().typedCount, 0);
        assert.equal(Typing.handleInput('a').correct, true);
    });

    it('wertet zurückgenommene korrekte Zeichen nicht als zusätzliche Versuche', () => {
        Typing.start('ab');
        Typing.handleInput('x');
        Typing.handleBackspace();

        for (let index = 0; index < 20; index++) {
            Typing.handleInput('a');
            Typing.handleBackspace();
        }

        Typing.handleInput('a');
        Typing.handleInput('b');

        assert.deepEqual(
            {
                targetChars: Typing.getFinalStats().targetChars,
                totalChars: Typing.getFinalStats().totalChars,
                correctChars: Typing.getFinalStats().correctChars,
                incorrectChars: Typing.getFinalStats().incorrectChars,
                accuracy: Typing.getFinalStats().accuracy
            },
            { targetChars: 2, totalChars: 3, correctChars: 2, incorrectChars: 1, accuracy: 67 }
        );
    });

    it('berechnet WPM und CPM aus korrekten Zeichen', () => {
        Typing.start('abcde');
        for (const char of 'abcde') {
            Typing.handleInput(char);
            if (char !== 'e') context.advanceTime(15000);
        }
        const stats = Typing.getFinalStats();
        assert.equal(stats.elapsedSeconds, 60);
        assert.equal(stats.wpm, 1);
        assert.equal(stats.cpm, 5);
    });

    it('meldet Live-Werte über den Timer-Callback', () => {
        const updates = [];
        Typing.start('ab', null, null, (...args) => updates.push(args));
        Typing.handleInput('a');
        context.advanceTime(1200);
        context.runIntervals();
        assert.equal(updates.length, 1);
        assert.equal(updates[0][0], 1.2);
        assert.equal(updates[0][2], 100);
    });

    it('ruft den Abschluss-Callback genau einmal auf', () => {
        let finishes = 0;
        Typing.start('a', null, () => finishes++);
        assert.equal(Typing.handleInput('a').isComplete, true);
        assert.equal(Typing.handleInput('a'), null);
        assert.equal(finishes, 1);
        assert.equal(context.activeIntervalCount(), 0);
    });

    it('bildet den Anzeigezustand korrekt ab', () => {
        Typing.start('abc');
        Typing.handleInput('a');
        Typing.handleInput('x');
        assert.deepEqual(
            clone(Typing.getDisplayState()).map(({ status }) => status),
            ['correct', 'incorrect', 'current']
        );
    });

    it('behandelt Unicode-Grapheme und Normalformen als einzelne Zeichen', () => {
        Typing.start('A👨‍👩‍👧‍👦é');
        assert.equal(Typing.getState().totalChars, 3);
        for (const char of Typing.splitGraphemes('A👨‍👩‍👧‍👦é')) Typing.handleInput(char);
        assert.equal(Typing.getFinalStats().correctChars, 3);
        assert.equal(Typing.getFinalStats().accuracy, 100);
    });

    it('weist leere und Mehrzeicheneingaben ab', () => {
        Typing.start('abc');
        assert.equal(Typing.handleInput(''), null);
        assert.equal(Typing.handleInput('ab'), null);
        assert.equal(Typing.getState().typedCount, 0);
    });

    it('beendet keine leere Übung durch eine Fremdeingabe', () => {
        Typing.start('');
        assert.equal(Typing.handleInput('x'), null);
        assert.equal(Typing.getState().isFinished, false);
        assert.equal(context.activeIntervalCount(), 0);
    });

    it('stoppt eine laufende Übung und räumt den Timer auf', () => {
        Typing.start('ab');
        Typing.handleInput('a');
        Typing.stop();
        assert.equal(Typing.getState().isActive, false);
        assert.equal(Typing.getState().isFinished, true);
        assert.equal(context.activeIntervalCount(), 0);
    });

    it('räumt beim Neustart einen alten Timer auf', () => {
        Typing.start('abc');
        Typing.handleInput('a');
        Typing.start('xyz');
        assert.equal(context.activeIntervalCount(), 0);
        assert.equal(Typing.getState().typedCount, 0);
        assert.equal(Typing.getState().totalChars, 3);
    });

    it('setzt sämtliche Zustände zurück', () => {
        Typing.start('abc');
        Typing.handleInput('a');
        Typing.reset();
        assert.deepEqual(clone(Typing.getState()), {
            isActive: false,
            isFinished: true,
            hasStarted: false,
            progress: 0,
            totalChars: 0,
            typedCount: 0
        });
    });
});
