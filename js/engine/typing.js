'use strict';

const Typing = (() => {
    const graphemeSegmenter = new Intl.Segmenter('de', { granularity: 'grapheme' });
    let currentText = '';
    let currentTextChars = [];
    let typedChars = [];
    let correctAttempts = 0;
    let incorrectAttempts = 0;
    let startTime = null;
    let isActive = false;
    let isFinished = false;
    let timerInterval = null;
    let onCharCallback = null;
    let onFinishCallback = null;
    let onTimerCallback = null;

    function splitGraphemes(value) {
        const normalized = String(value ?? '').normalize('NFC');
        return [...graphemeSegmenter.segment(normalized)].map(({ segment }) => segment);
    }

    function start(text, onChar, onFinish, onTimer) {
        currentText = String(text ?? '').normalize('NFC');
        currentTextChars = splitGraphemes(currentText);
        typedChars = [];
        correctAttempts = 0;
        incorrectAttempts = 0;
        startTime = null;
        isActive = true;
        isFinished = false;
        onCharCallback = onChar;
        onFinishCallback = onFinish;
        onTimerCallback = onTimer;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        return {
            text: currentText,
            displayChars: _buildDisplayChars()
        };
    }

    function handleInput(char) {
        if (!isActive || isFinished) return null;

        const inputChars = splitGraphemes(char);
        if (
            inputChars.length !== 1 ||
            currentTextChars.length === 0 ||
            typedChars.length >= currentTextChars.length
        ) {
            return null;
        }
        const inputChar = inputChars[0];

        if (typedChars.length === 0 && !startTime) {
            startTime = Date.now();
            timerInterval = setInterval(() => {
                if (onTimerCallback) {
                    onTimerCallback(getElapsedTime(), getCurrentWPM(), getCurrentAccuracy());
                }
            }, 100);
        }

        const expectedIndex = typedChars.length;
        const expected = currentTextChars[expectedIndex];
        const isCorrect = inputChar === expected;
        if (isCorrect) correctAttempts++;
        else incorrectAttempts++;

        typedChars.push({
            char: inputChar,
            expected,
            correct: isCorrect,
            timestamp: Date.now()
        });

        const result = {
            index: expectedIndex,
            char: inputChar,
            expected,
            correct: isCorrect,
            totalTyped: typedChars.length,
            totalChars: currentTextChars.length,
            isComplete:
                typedChars.length >= currentTextChars.length && typedChars.every(({ correct }) => correct)
        };

        if (onCharCallback) {
            onCharCallback(result);
        }

        if (result.isComplete) {
            _finish();
        }

        return result;
    }

    function handleBackspace() {
        if (!isActive || typedChars.length === 0) return null;

        const removed = typedChars.pop();
        if (removed.correct) {
            correctAttempts = Math.max(0, correctAttempts - 1);
        }

        return {
            index: typedChars.length,
            totalTyped: typedChars.length,
            totalChars: currentTextChars.length,
            removedChar: removed
        };
    }

    function _finish() {
        isActive = false;
        isFinished = true;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        const stats = getFinalStats();
        if (onFinishCallback) {
            onFinishCallback(stats);
        }
    }

    function getElapsedTime() {
        if (!startTime) return 0;
        return (Date.now() - startTime) / 1000;
    }

    function getCurrentWPM() {
        if (!startTime || typedChars.length === 0) return 0;

        const elapsed = getElapsedTime();
        if (elapsed === 0) return 0;

        const correctChars = typedChars.filter((c) => c.correct).length;
        const words = correctChars / 5;
        const minutes = elapsed / 60;

        return Math.round(words / minutes);
    }

    function getCurrentCPM() {
        if (!startTime || typedChars.length === 0) return 0;

        const elapsed = getElapsedTime();
        if (elapsed === 0) return 0;

        const correctChars = typedChars.filter((c) => c.correct).length;
        const minutes = elapsed / 60;

        return Math.round(correctChars / minutes);
    }

    function getCurrentAccuracy() {
        const attempts = correctAttempts + incorrectAttempts;
        if (attempts === 0) return 100;
        return Math.round((correctAttempts / attempts) * 100);
    }

    function getFinalStats() {
        const elapsed = getElapsedTime();
        const targetChars = currentTextChars.length;
        const totalChars = correctAttempts + incorrectAttempts;
        const correctChars = correctAttempts;
        const incorrectChars = incorrectAttempts;
        const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
        const wpm = elapsed > 0 ? targetChars / 5 / (elapsed / 60) : 0;
        const cpm = elapsed > 0 ? targetChars / (elapsed / 60) : 0;

        const charTimings = [];
        for (let i = 1; i < typedChars.length; i++) {
            charTimings.push(typedChars[i].timestamp - typedChars[i - 1].timestamp);
        }
        const avgTimePerChar =
            charTimings.length > 0 ? charTimings.reduce((a, b) => a + b, 0) / charTimings.length : 0;

        return {
            text: currentText,
            targetChars,
            totalChars,
            correctChars,
            incorrectChars,
            accuracy: Math.round(accuracy),
            wpm: Math.round(wpm),
            cpm: Math.round(cpm),
            elapsedSeconds: Math.round(elapsed * 10) / 10,
            avgTimePerChar: Math.round(avgTimePerChar),
            timestamp: new Date().toISOString()
        };
    }

    function _buildDisplayChars() {
        return currentTextChars.map((char, index) => ({
            index,
            char,
            status: 'pending'
        }));
    }

    function getDisplayState() {
        return currentTextChars.map((char, index) => {
            let status = 'pending';
            if (index < typedChars.length) {
                status = typedChars[index].correct ? 'correct' : 'incorrect';
            } else if (index === typedChars.length) {
                status = 'current';
            }
            return { index, char, status };
        });
    }

    function stop() {
        isActive = false;
        isFinished = true;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function reset() {
        stop();
        currentText = '';
        currentTextChars = [];
        typedChars = [];
        correctAttempts = 0;
        incorrectAttempts = 0;
        startTime = null;
        onCharCallback = null;
        onFinishCallback = null;
        onTimerCallback = null;
    }

    function getState() {
        return {
            isActive,
            isFinished,
            hasStarted: startTime !== null,
            progress: currentTextChars.length > 0 ? typedChars.length / currentTextChars.length : 0,
            totalChars: currentTextChars.length,
            typedCount: typedChars.length
        };
    }

    return {
        start,
        splitGraphemes,
        handleInput,
        handleBackspace,
        getElapsedTime,
        getCurrentWPM,
        getCurrentCPM,
        getCurrentAccuracy,
        getFinalStats,
        getDisplayState,
        stop,
        reset,
        getState
    };
})();
