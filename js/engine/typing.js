'use strict';

const Typing = (() => {
    let currentText = '';
    let typedChars = [];
    let startTime = null;
    let isActive = false;
    let isFinished = false;
    let timerInterval = null;
    let onCharCallback = null;
    let onFinishCallback = null;
    let onTimerCallback = null;

    function start(text, onChar, onFinish, onTimer) {
        currentText = text;
        typedChars = [];
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

        if (typedChars.length === 0 && !startTime) {
            startTime = Date.now();
            timerInterval = setInterval(() => {
                if (onTimerCallback) {
                    onTimerCallback(getElapsedTime(), getCurrentWPM(), getCurrentAccuracy());
                }
            }, 100);
        }

        const expectedIndex = typedChars.length;
        const expected = currentText[expectedIndex];
        const isCorrect = char === expected;

        typedChars.push({
            char,
            expected,
            correct: isCorrect,
            timestamp: Date.now()
        });

        const result = {
            index: expectedIndex,
            char,
            expected,
            correct: isCorrect,
            totalTyped: typedChars.length,
            totalChars: currentText.length,
            isComplete: typedChars.length >= currentText.length
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

        return {
            index: typedChars.length,
            totalTyped: typedChars.length,
            totalChars: currentText.length,
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
        if (typedChars.length === 0) return 100;
        const correctCount = typedChars.filter((c) => c.correct).length;
        return Math.round((correctCount / typedChars.length) * 100);
    }

    function getFinalStats() {
        const elapsed = getElapsedTime();
        const totalChars = typedChars.length;
        const correctChars = typedChars.filter((c) => c.correct).length;
        const incorrectChars = totalChars - correctChars;
        const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
        const wpm = elapsed > 0 ? correctChars / 5 / (elapsed / 60) : 0;
        const cpm = elapsed > 0 ? correctChars / (elapsed / 60) : 0;

        const charTimings = [];
        for (let i = 1; i < typedChars.length; i++) {
            charTimings.push(typedChars[i].timestamp - typedChars[i - 1].timestamp);
        }
        const avgTimePerChar =
            charTimings.length > 0 ? charTimings.reduce((a, b) => a + b, 0) / charTimings.length : 0;

        return {
            text: currentText,
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
        return currentText.split('').map((char, index) => ({
            index,
            char,
            status: 'pending'
        }));
    }

    function getDisplayState() {
        return currentText.split('').map((char, index) => {
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
        typedChars = [];
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
            progress: currentText.length > 0 ? typedChars.length / currentText.length : 0,
            totalChars: currentText.length,
            typedCount: typedChars.length
        };
    }

    return {
        start,
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
