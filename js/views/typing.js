'use strict';

/**
 * Typing-View: Eingabe-Handling, Live-Feedback und Anzeige des
 * aktuellen Uebungstextes. Verwendet die reine Typing-Engine (engine/typing.js)
 * und rendert deren getDisplayState() ins DOM.
 */
const TypingView = (() => {
    /** Initialer Bindings (einmalig beim App-Start aufrufen). */
    function bind() {
        const input = Dom.byId('typingInput');
        if (!input) {
            console.error('TippTrainer: typingInput nicht gefunden. Abbruch.');
            return;
        }

        // Keydown nur fuer Steuerung (Backspace, Escape) - NICHT fuer Zeicheneingabe
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                const result = Typing.handleBackspace();
                if (result) updateDisplay();
                return;
            }

            if (e.key === 'Escape') {
                Typing.stop();
                Router.showView('levels');
                return;
            }
        });

        // Zeicheneingabe ueber input-Event (loest Umlaut-Problem unter Linux)
        input.addEventListener('input', () => {
            const val = input.value;
            if (val.length === 0) return;

            const char = val[val.length - 1];
            input.value = '';

            const result = Typing.handleInput(char);
            if (result) updateDisplay();
        });

        input.addEventListener('paste', (e) => e.preventDefault());

        const textDisplay = document.querySelector('.typing-text-display');
        if (textDisplay) {
            textDisplay.addEventListener('click', () => {
                if (!input.disabled) input.focus();
            });
        }

        // Globaler Escape-Handler fuer Result-Overlay
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const overlay = Dom.byId('resultOverlay');
                if (overlay && overlay.classList.contains('visible')) {
                    overlay.classList.remove('visible');
                    Router.showView('levels');
                }
            }
        });

        const btnRestart = Dom.byId('btnRestart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => start(true));
        }

        const btnSkip = Dom.byId('btnSkip');
        if (btnSkip) {
            btnSkip.addEventListener('click', () => start(false));
        }
    }

    /** Startet eine neue (oder wiederholte) Uebung. */
    function start(reuseText = false) {
        let text;
        if (reuseText && State.lastText) {
            text = State.lastText;
        } else {
            text = Texts.getRandomText(State.topic, State.level, State.difficulty);
            State.lastText = text;
        }
        const topicName = Texts.getTopicName(State.topic);

        Dom.byId('typingTopic').textContent = `${Texts.getTopicIcon(State.topic)} ${topicName}`;
        Dom.byId('typingLevel').textContent = `Level ${State.level}`;
        Dom.byId('typingDifficulty').textContent = Texts.DIFFICULTY_NAMES[State.difficulty];

        Typing.start(
            text,
            () => {}, // onCharTyped - wird via getDisplayState() gezogen
            onFinish,
            onTimerUpdate
        );

        updateDisplay();
        Router.showView('typing');

        const input = Dom.byId('typingInput');
        input.value = '';
        input.disabled = false;
        input.focus();

        Dom.byId('liveWPM').textContent = '0';
        Dom.byId('liveAccuracy').textContent = '100%';
        Dom.byId('liveTime').textContent = '0:00';
        Dom.byId('typingProgress').style.width = '0%';
    }

    /** Live-Update der WPM/Accuracy/Time-Anzeige. */
    function onTimerUpdate(elapsed, wpm, accuracy) {
        Dom.byId('liveWPM').textContent = wpm;
        Dom.byId('liveAccuracy').textContent = accuracy + '%';
        Dom.byId('liveTime').textContent = Dom.formatTime(elapsed);
    }

    /** Rendert den Text mit Status-Klassen + Progress-Bar. */
    function updateDisplay() {
        const state = Typing.getDisplayState();
        const container = Dom.byId('typingText');
        const progress = Dom.byId('typingProgress');

        container.innerHTML = state
            .map((item) => {
                return `<span class="char ${item.status}">${Dom.escapeHtml(item.char)}</span>`;
            })
            .join('');

        const typedCount = state.filter((s) => s.status === 'correct' || s.status === 'incorrect').length;
        const pct = state.length > 0 ? (typedCount / state.length) * 100 : 0;
        progress.style.width = pct + '%';
    }

    /** Wird nach Abschluss der Uebung aus der Engine aufgerufen. */
    function onFinish(stats) {
        const result = SessionCompletion.complete(stats);
        // XP-Anzeige aktualisieren (Sidebar) - nach Service-Aufruf, da DOM-Update
        ChromeView.updateXPDisplay();
        ResultView.show(stats, result);
    }

    return { bind, start };
})();
