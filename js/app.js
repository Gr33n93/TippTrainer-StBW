'use strict';

const App = (() => {
    let currentView = 'dashboard';
    let currentTopic = null;
    let currentLevel = null;
    let currentDifficulty = 'normal';
    let calYear, calMonth;

    function init() {
        TextsExtra.apply();
        _initCalendarDate();
        _bindNavigation();
        _bindMobileToggle();
        _bindTyping();
        _bindCalendarControls();
        _bindSettingsControls();
        _bindProgressFilters();
        _updateXPDisplay();
        _updateCountdown();
        _showView('dashboard');
        _renderDashboard();
    }

    // ==================== NAVIGATION ====================

    function _bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                if (view) _showView(view);
                _closeMobileSidebar();
            });
        });

        document.getElementById('backToDashboard').addEventListener('click', () => {
            _showView('dashboard');
        });

        document.getElementById('typingBack').addEventListener('click', () => {
            Typing.stop();
            _showView('levels');
            _renderLevels();
        });
    }

    function _showView(viewName) {
        currentView = viewName;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const viewEl = document.getElementById(`view-${viewName}`);
        if (viewEl) viewEl.classList.add('active');

        const navEl = document.querySelector(`.nav-item[data-view="${viewName}"]`);
        if (navEl) navEl.classList.add('active');

        switch (viewName) {
            case 'dashboard': _renderDashboard(); break;
            case 'levels': _renderLevels(); break;
            case 'calendar': _renderCalendar(); break;
            case 'achievements': _renderAchievements(); break;
            case 'progress': _renderProgress(); break;
        }
    }

    // ==================== MOBILE ====================

    function _bindMobileToggle() {
        document.getElementById('mobileToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    }

    function _closeMobileSidebar() {
        document.getElementById('sidebar').classList.remove('open');
    }

    // ==================== DASHBOARD ====================

    function _renderDashboard() {
        _renderDashboardStats();
        _renderDashboardTopics();
        _renderRecentSessions();
    }

    function _renderDashboardStats() {
        const stats = Progress.getOverallStats();
        const calStats = Calendar.getStats();
        const daysLeft = Progress.getDaysUntilTarget();

        document.getElementById('dashboardCountdown').textContent =
            daysLeft > 0 ? `${daysLeft} Tage bis 01.06.2026` : 'Prüfung ist da!';

        document.getElementById('dashboardStats').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${stats.totalSessions}</div>
                <div class="stat-label">Übungen gesamt</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.avgWPM}</div>
                <div class="stat-label">Ø WPM</div>
            </div>
            <div class="stat-card success">
                <div class="stat-value">${stats.avgAccuracy}%</div>
                <div class="stat-label">Ø Genauigkeit</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-value">${stats.bestWPM}</div>
                <div class="stat-label">Beste WPM</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${calStats.currentStreak}</div>
                <div class="stat-label">Tage Streak 🔥</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalMinutes}</div>
                <div class="stat-label">Minuten geübt</div>
            </div>
        `;
    }

    function _renderDashboardTopics() {
        const topics = Texts.getAllTopics();
        const container = document.getElementById('dashboardTopics');

        container.innerHTML = topics.map(topic => {
            const summary = Levels.getTopicSummary(topic);
            const name = Texts.getTopicName(topic);
            const icon = Texts.getTopicIcon(topic);

            return `
                <div class="topic-card" data-topic="${topic}">
                    <div class="topic-icon">${icon}</div>
                    <div class="topic-name">${name}</div>
                    <div class="topic-desc">Level ${summary.maxUnlockedLevel} von ${Levels.MAX_LEVEL} freigeschaltet</div>
                    <div class="topic-progress-bar">
                        <div class="topic-progress-fill" style="width: ${summary.progressPercent}%"></div>
                    </div>
                    <div class="topic-progress-text">${summary.totalCompletions} / ${Levels.MAX_LEVEL * 3} bestanden (${summary.progressPercent}%)</div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', () => {
                currentTopic = card.dataset.topic;
                _showView('levels');
                _renderLevels();
            });
        });
    }

    function _renderRecentSessions() {
        const sessions = Progress.getRecentSessions(5);
        const container = document.getElementById('recentSessions');

        if (sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⌨️</div>
                    <p>Noch keine Übungen. Wähle ein Thema oben und lege los!</p>
                </div>
            `;
            return;
        }

        let html = '<table class="sessions-table"><thead><tr>' +
            '<th>Datum</th><th>Thema</th><th>Level</th><th>WPM</th><th>Genauigkeit</th>' +
            '</tr></thead><tbody>';

        for (const s of sessions) {
            const date = new Date(s.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
            const topicName = _escapeHtml(Texts.getTopicName(s.topic));
            const accClass = s.accuracy >= 95 ? 'style="color: var(--success)"' :
                             s.accuracy >= 85 ? '' : 'style="color: var(--error)"';

            html += `<tr>
                <td>${date}</td>
                <td>${topicName}</td>
                <td>${_escapeHtml(String(s.level))}</td>
                <td>${_escapeHtml(String(s.wpm))}</td>
                <td ${accClass}>${_escapeHtml(String(s.accuracy))}%</td>
            </tr>`;
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // ==================== LEVELS ====================

    function _renderLevels() {
        if (!currentTopic) {
            currentTopic = Texts.getAllTopics()[0];
        }

        const name = Texts.getTopicName(currentTopic);
        document.getElementById('levelTitle').textContent = `${name} – Levelauswahl`;

        _renderDifficultyTabs();
        _renderLevelsGrid();
        _renderLevelProgress();
    }

    function _renderDifficultyTabs() {
        const container = document.getElementById('difficultyTabs');
        container.innerHTML = Levels.DIFFICULTIES.map(diff => {
            const active = diff === currentDifficulty ? 'active' : '';
            return `<div class="diff-tab ${active}" data-diff="${diff}">${Texts.DIFFICULTY_NAMES[diff]}</div>`;
        }).join('');

        container.querySelectorAll('.diff-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                currentDifficulty = tab.dataset.diff;
                _renderDifficultyTabs();
                _renderLevelsGrid();
                _renderLevelProgress();
            });
        });
    }

    function _renderLevelsGrid() {
        const container = document.getElementById('levelsGrid');
        const unlocked = Levels.getUnlockedLevels(currentTopic);

        container.innerHTML = '';
        for (let level = 1; level <= Levels.MAX_LEVEL; level++) {
            const isUnlocked = unlocked.includes(level);
            const isCompleted = Levels.isLevelCompleted(currentTopic, level, currentDifficulty);
            const info = Levels.getCompletedInfo(currentTopic, level, currentDifficulty);

            let statusText = '';
            let classes = 'level-btn';

            if (!isUnlocked) {
                classes += ' locked';
                statusText = '🔒';
            } else if (isCompleted) {
                classes += ' completed';
                statusText = `✓ ${info.wpm} WPM`;
            } else {
                statusText = 'Offen';
            }

            const btn = document.createElement('div');
            btn.className = classes;
            btn.innerHTML = `<span class="level-num">${level}</span><span class="level-status">${statusText}</span>`;

            if (isUnlocked) {
                btn.addEventListener('click', () => {
                    currentLevel = level;
                    _startExercise();
                });
            }

            container.appendChild(btn);
        }
    }

    function _renderLevelProgress() {
        const container = document.getElementById('levelProgressInfo');
        const unlocked = Levels.getUnlockedLevels(currentTopic);

        if (unlocked.length === 0) return;

        let html = '<div class="stats-grid">';
        for (const level of unlocked.slice(-3)) {
            const data = Progress.getProgressForLevelDisplay(currentTopic, level, currentDifficulty);
            html += `
                <div class="stat-card ${data.passed ? 'success' : ''}">
                    <div class="stat-value" style="font-size: 1.2rem">Level ${level}</div>
                    <div class="stat-label">${data.attempts} Versuche | Ø ${data.avgWPM} WPM | ${data.avgAccuracy}%</div>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    // ==================== TYPING ====================

    let lastText = null;

    function _bindTyping() {
        const input = document.getElementById('typingInput');

        // Keydown nur fuer Steuerung (Backspace, Escape) — NICHT fuer Zeicheneingabe
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                const result = Typing.handleBackspace();
                if (result) _updateTypingDisplay();
                return;
            }

            if (e.key === 'Escape') {
                Typing.stop();
                _showView('levels');
                _renderLevels();
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
            if (result) _updateTypingDisplay();
        });

        input.addEventListener('paste', (e) => e.preventDefault());

        document.querySelector('.typing-text-display').addEventListener('click', () => {
            const inp = document.getElementById('typingInput');
            if (!inp.disabled) inp.focus();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('resultOverlay');
                if (overlay.classList.contains('visible')) {
                    overlay.classList.remove('visible');
                    _showView('levels');
                    _renderLevels();
                }
            }
        });

        document.getElementById('btnRestart').addEventListener('click', () => {
            _startExercise(true);
        });

        document.getElementById('btnSkip').addEventListener('click', () => {
            _startExercise(false);
        });
    }

    function _startExercise(reuseText = false) {
        let text;
        if (reuseText && lastText) {
            text = lastText;
        } else {
            text = Texts.getRandomText(currentTopic, currentLevel, currentDifficulty);
            lastText = text;
        }
        const topicName = Texts.getTopicName(currentTopic);

        document.getElementById('typingTopic').textContent = `${Texts.getTopicIcon(currentTopic)} ${topicName}`;
        document.getElementById('typingLevel').textContent = `Level ${currentLevel}`;
        document.getElementById('typingDifficulty').textContent = Texts.DIFFICULTY_NAMES[currentDifficulty];

        Typing.start(
            text,
            _onCharTyped,
            _onExerciseFinished,
            _onTimerUpdate
        );

        _updateTypingDisplay();
        _showView('typing');

        const input = document.getElementById('typingInput');
        input.value = '';
        input.disabled = false;
        input.focus();

        document.getElementById('liveWPM').textContent = '0';
        document.getElementById('liveAccuracy').textContent = '100%';
        document.getElementById('liveTime').textContent = '0:00';
        document.getElementById('typingProgress').style.width = '0%';
    }

    function _onCharTyped(result) {
        // Handled in _updateTypingDisplay via getDisplayState
    }

    function _onTimerUpdate(elapsed, wpm, accuracy) {
        const mins = Math.floor(elapsed / 60);
        const secs = Math.floor(elapsed % 60);
        document.getElementById('liveWPM').textContent = wpm;
        document.getElementById('liveAccuracy').textContent = accuracy + '%';
        document.getElementById('liveTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function _updateTypingDisplay() {
        const state = Typing.getDisplayState();
        const container = document.getElementById('typingText');
        const progress = document.getElementById('typingProgress');

        container.innerHTML = state.map(item => {
            return `<span class="char ${item.status}">${_escapeHtml(item.char)}</span>`;
        }).join('');

        const typedCount = state.filter(s => s.status === 'correct' || s.status === 'incorrect').length;
        const pct = state.length > 0 ? (typedCount / state.length) * 100 : 0;
        progress.style.width = pct + '%';
    }

    function _onExerciseFinished(stats) {
        const input = document.getElementById('typingInput');
        input.disabled = true;

        const sessionData = {
            topic: currentTopic,
            level: currentLevel,
            difficulty: currentDifficulty,
            ...stats
        };

        Progress.addSession(sessionData);

        Calendar.recordPractice(stats.elapsedSeconds);

        const passed = Levels.checkLevelCompletion(
            currentTopic, currentLevel, currentDifficulty, stats.accuracy, stats.wpm
        );

        const xpEarned = Levels.calculateXP(currentDifficulty, stats.accuracy, stats.wpm, stats.totalChars);
        const xpResult = Storage.addXP(xpEarned);
        _updateXPDisplay();

        const newAchievements = Achievements.checkAndUnlock(sessionData);

        _showResult(stats, passed, xpEarned, newAchievements);
    }

    function _getDifficultyRecommendation(stats, difficulty) {
        const nextMap = { leicht: 'normal', normal: 'schwer' };
        const nextDiff = nextMap[difficulty];
        if (!nextDiff) return null;

        const nextThresholds = Levels.getThresholds(nextDiff);
        const wpmStrong = stats.wpm >= nextThresholds.minWPM * 1.3;
        const accStrong = stats.accuracy >= nextThresholds.minAccuracy;

        if (wpmStrong && accStrong) {
            return {
                nextDiff,
                nextName: Texts.DIFFICULTY_NAMES[nextDiff],
                reason: `${stats.wpm} WPM und ${stats.accuracy}% Genauigkeit übertreffen die Anforderungen für "${Texts.DIFFICULTY_NAMES[nextDiff]}" deutlich.`
            };
        }
        return null;
    }

    function _showResult(stats, passed, xpEarned, newAchievements) {
        const overlay = document.getElementById('resultOverlay');
        const card = document.getElementById('resultCard');

        const accClass = stats.accuracy >= 95 ? 'good' : stats.accuracy >= 85 ? 'warn' : 'bad';
        const wpmClass = stats.wpm >= 60 ? 'good' : stats.wpm >= 35 ? 'warn' : 'bad';
        const thresholds = Levels.getThresholds(currentDifficulty);

        let achievementsHtml = '';
        if (newAchievements.length > 0) {
            achievementsHtml = `
                <div class="new-achievements">
                    <h4>🏆 Neue Achievements freigeschaltet!</h4>
                    ${newAchievements.map(a => `
                        <div class="achievement-popup">
                            <span class="ach-icon">${a.icon}</span>
                            <div>
                                <div class="toast-title">${a.name}</div>
                                <div class="toast-text">${a.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const recommendation = _getDifficultyRecommendation(stats, currentDifficulty);
        let recommendHtml = '';
        if (recommendation) {
            recommendHtml = `
                <div class="result-recommendation">
                    <div class="recommendation-text">💡 <strong>Herausforderung gesucht?</strong> ${recommendation.reason}</div>
                    <button class="btn btn-sm btn-success" id="resultHarder">⬆️ Jetzt ${recommendation.nextName} probieren</button>
                </div>
            `;
        }

        card.innerHTML = `
            <h3 class="${passed ? 'passed' : 'failed'}">
                ${passed ? '✅ Level bestanden!' : '⏳ Weiter üben!'}
            </h3>
            <div class="result-stats">
                <div class="result-stat ${wpmClass}">
                    <div class="val">${stats.wpm}</div>
                    <div class="lbl">WPM (Ziel: ${thresholds.minWPM})</div>
                </div>
                <div class="result-stat ${accClass}">
                    <div class="val">${stats.accuracy}%</div>
                    <div class="lbl">Genauigkeit (Ziel: ${thresholds.minAccuracy}%)</div>
                </div>
                <div class="result-stat">
                    <div class="val">${stats.correctChars}/${stats.totalChars}</div>
                    <div class="lbl">Zeichen korrekt</div>
                </div>
                <div class="result-stat">
                    <div class="val">${Math.floor(stats.elapsedSeconds / 60)}:${Math.floor(stats.elapsedSeconds % 60).toString().padStart(2, '0')}</div>
                    <div class="lbl">Dauer</div>
                </div>
            </div>
            <div class="result-xp">+${xpEarned} XP verdient!</div>
            ${achievementsHtml}
            ${recommendHtml}
            <div class="result-actions">
                <button class="btn btn-primary" id="resultRetry">🔄 Nochmal</button>
                <button class="btn btn-secondary" id="resultNext">⏭️ Nächster Text</button>
                <button class="btn btn-secondary" id="resultBack">📚 Zurück</button>
            </div>
        `;

        overlay.classList.add('visible');

        if (recommendation) {
            document.getElementById('resultHarder').addEventListener('click', () => {
                overlay.classList.remove('visible');
                currentDifficulty = recommendation.nextDiff;
                lastText = null;
                _startExercise(false);
            });
        }

        document.getElementById('resultRetry').addEventListener('click', () => {
            overlay.classList.remove('visible');
            _startExercise(true);
        });

        document.getElementById('resultNext').addEventListener('click', () => {
            overlay.classList.remove('visible');
            _startExercise(false);
        });

        document.getElementById('resultBack').addEventListener('click', () => {
            overlay.classList.remove('visible');
            _showView('levels');
            _renderLevels();
        });

        for (const ach of newAchievements) {
            _showToast(ach.icon, ach.name, ach.description);
        }
    }

    // ==================== CALENDAR ====================

    function _initCalendarDate() {
        const now = new Date();
        calYear = now.getFullYear();
        calMonth = now.getMonth() + 1;
    }

    function _bindCalendarControls() {
        document.getElementById('calPrev').addEventListener('click', () => {
            calMonth--;
            if (calMonth < 1) { calMonth = 12; calYear--; }
            _renderCalendar();
        });

        document.getElementById('calNext').addEventListener('click', () => {
            calMonth++;
            if (calMonth > 12) { calMonth = 1; calYear++; }
            _renderCalendar();
        });
    }

    function _renderCalendar() {
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

        document.getElementById('calTitle').textContent = `${monthNames[calMonth - 1]} ${calYear}`;

        const daysInMonth = Calendar.getDaysInMonth(calYear, calMonth);
        const firstDay = Calendar.getFirstDayOfMonth(calYear, calMonth);
        const monthData = Calendar.getMonthData(calYear, calMonth);
        const today = new Date().toISOString().split('T')[0];

        let html = '';

        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const intensity = Calendar.getIntensityLevel(dateStr);
            const isToday = dateStr === today;

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (intensity > 0) classes += ` intensity-${intensity}`;

            html += `<div class="${classes}" title="${dateStr}${intensity > 0 ? ` – ${monthData[dateStr]?.totalSeconds ? Math.round(monthData[dateStr].totalSeconds / 60) : 0} Min.` : ''}">${day}</div>`;
        }

        document.getElementById('calendarDays').innerHTML = html;

        const calStats = Calendar.getStats();
        document.getElementById('calendarStats').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${calStats.currentStreak} 🔥</div>
                <div class="stat-label">Aktuelle Streak</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${calStats.longestStreak}</div>
                <div class="stat-label">Längste Streak</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${calStats.totalDays}</div>
                <div class="stat-label">Tage geübt</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${calStats.totalMinutes}</div>
                <div class="stat-label">Minuten gesamt</div>
            </div>
        `;
    }

    // ==================== ACHIEVEMENTS ====================

    function _renderAchievements() {
        const all = Achievements.getAll();
        const unlocked = all.filter(a => a.unlocked).length;
        const total = all.length;

        document.getElementById('achievementSummary').innerHTML = `
            <span><strong>${unlocked}</strong> von ${total} Achievements freigeschaltet</span>
            <span>${Math.round((unlocked / total) * 100)}% vollständig</span>
        `;

        const categories = { milestone: 'Meilensteine', speed: 'Geschwindigkeit', accuracy: 'Genauigkeit', streak: 'Streaks', topic: 'Themen', time: 'Zeit', session: 'Session' };

        let html = '';
        for (const [catKey, catName] of Object.entries(categories)) {
            const catAchs = all.filter(a => a.category === catKey);
            if (catAchs.length === 0) continue;

            html += `<h3 class="section-title" style="grid-column: 1/-1; margin-top: 16px;">${catName}</h3>`;
            for (const ach of catAchs) {
                const date = ach.unlockedAt
                    ? new Date(ach.unlockedAt).toLocaleDateString('de-DE')
                    : '';
                html += `
                    <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
                        <div class="ach-icon">${ach.unlocked ? ach.icon : '🔒'}</div>
                        <div class="ach-info">
                            <div class="ach-name">${ach.name}</div>
                            <div class="ach-desc">${ach.description}</div>
                            ${date ? `<div class="ach-date">Freigeschaltet am ${date}</div>` : ''}
                        </div>
                    </div>
                `;
            }
        }

        document.getElementById('achievementsGrid').innerHTML = html;
    }

    // ==================== PROGRESS ====================

    function _bindProgressFilters() {
        const topicSelect = document.getElementById('filterTopic');
        Texts.getAllTopics().forEach(t => {
            topicSelect.innerHTML += `<option value="${t}">${Texts.getTopicName(t)}</option>`;
        });

        for (let i = 1; i <= 10; i++) {
            document.getElementById('filterLevel').innerHTML += `<option value="${i}">Level ${i}</option>`;
        }
        Levels.DIFFICULTIES.forEach(d => {
            document.getElementById('filterDifficulty').innerHTML += `<option value="${d}">${Texts.DIFFICULTY_NAMES[d]}</option>`;
        });

        ['filterTopic', 'filterLevel', 'filterDifficulty'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => _renderProgress());
        });
    }

    function _renderProgress() {
        const topic = document.getElementById('filterTopic').value || null;
        const level = document.getElementById('filterLevel').value ? parseInt(document.getElementById('filterLevel').value) : null;
        const difficulty = document.getElementById('filterDifficulty').value || null;

        let sessions = Progress.getAllSessions();
        if (topic) sessions = sessions.filter(s => s.topic === topic);
        if (level) sessions = sessions.filter(s => s.level === level);
        if (difficulty) sessions = sessions.filter(s => s.difficulty === difficulty);

        _renderProgressStats(sessions);
        _renderWPMChart(sessions);
        _renderAccuracyChart(sessions);
        _renderSessionsTable(sessions);
    }

    function _renderProgressStats(sessions) {
        if (sessions.length === 0) {
            document.getElementById('progressStats').innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1">
                    <div class="empty-icon">📊</div>
                    <p>Noch keine Daten für diese Auswahl vorhanden.</p>
                </div>
            `;
            return;
        }

        const avgWPM = Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length);
        const avgAcc = Math.round((sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length) * 100) / 100;
        const bestWPM = Math.max(...sessions.map(s => s.wpm));
        const totalTime = Math.round(sessions.reduce((a, s) => a + (s.elapsedSeconds || 0), 0) / 60);

        document.getElementById('progressStats').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${sessions.length}</div>
                <div class="stat-label">Übungen</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgWPM}</div>
                <div class="stat-label">Ø WPM</div>
            </div>
            <div class="stat-card success">
                <div class="stat-value">${avgAcc}%</div>
                <div class="stat-label">Ø Genauigkeit</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-value">${bestWPM}</div>
                <div class="stat-label">Beste WPM</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalTime}</div>
                <div class="stat-label">Minuten gesamt</div>
            </div>
        `;
    }

    function _renderWPMChart(sessions) {
        const chart = document.getElementById('wpmChart');
        if (sessions.length === 0) {
            chart.innerHTML = '<div class="empty-state" style="width:100%"><p>Keine Daten</p></div>';
            return;
        }

        const maxWPM = Math.max(...sessions.map(s => s.wpm), 1);
        const last30 = sessions.slice(-30);

        chart.innerHTML = last30.map(s => {
            const height = Math.max(2, (s.wpm / maxWPM) * 100);
            const color = s.wpm >= 60 ? 'var(--success-dim)' : s.wpm >= 35 ? 'var(--accent-dim)' : 'var(--error-dim)';
            const date = new Date(s.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
            return `<div class="bar" style="height: ${height}%; background: ${color}">
                <div class="bar-tooltip">${date}: ${s.wpm} WPM</div>
            </div>`;
        }).join('');
    }

    function _renderAccuracyChart(sessions) {
        const chart = document.getElementById('accuracyChart');
        if (sessions.length === 0) {
            chart.innerHTML = '<div class="empty-state" style="width:100%"><p>Keine Daten</p></div>';
            return;
        }

        const last30 = sessions.slice(-30);

        chart.innerHTML = last30.map(s => {
            const height = Math.max(2, s.accuracy);
            const color = s.accuracy >= 95 ? 'var(--success-dim)' : s.accuracy >= 85 ? 'var(--warning-dim)' : 'var(--error-dim)';
            const date = new Date(s.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
            return `<div class="bar" style="height: ${height}%; background: ${color}">
                <div class="bar-tooltip">${date}: ${s.accuracy}%</div>
            </div>`;
        }).join('');
    }

    function _renderSessionsTable(sessions) {
        const body = document.getElementById('sessionsBody');
        const last20 = sessions.slice(-20).reverse();

        if (last20.length === 0) {
            body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">Keine Daten</td></tr>';
            return;
        }

        body.innerHTML = last20.map(s => {
            const date = new Date(s.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
            const topicName = _escapeHtml(Texts.getTopicName(s.topic));
            const diffName = Texts.DIFFICULTY_NAMES[s.difficulty] || _escapeHtml(String(s.difficulty));
            const time = `${Math.floor(s.elapsedSeconds / 60)}:${Math.floor(s.elapsedSeconds % 60).toString().padStart(2, '0')}`;
            const accStyle = s.accuracy >= 95 ? 'color: var(--success)' : s.accuracy < 85 ? 'color: var(--error)' : '';

            return `<tr>
                <td>${date}</td>
                <td>${topicName}</td>
                <td>${_escapeHtml(String(s.level))}</td>
                <td>${diffName}</td>
                <td>${_escapeHtml(String(s.wpm))}</td>
                <td style="${accStyle}">${_escapeHtml(String(s.accuracy))}%</td>
                <td>${time}</td>
            </tr>`;
        }).join('');
    }

    // ==================== SETTINGS ====================

    function _bindSettingsControls() {
        // Datepicker fuer Pruefungsdatum
        const dateInput = document.getElementById('targetDateInput');
        const settings = Storage.getSettings();
        dateInput.value = settings.targetDate || '2026-06-01';
        _updateDaysUntilLabel();

        dateInput.addEventListener('change', () => {
            const newDate = dateInput.value;
            if (newDate) {
                const current = Storage.getSettings();
                current.targetDate = newDate;
                Storage.saveSettings(current);
                _updateCountdown();
                _updateDaysUntilLabel();
                _renderDashboard();
            }
        });

        document.getElementById('btnExport').addEventListener('click', () => {
            const data = Storage.exportAll();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tipptrainer-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            _showToast('✅', 'Export erfolgreich', 'Daten wurden heruntergeladen.');
        });

        document.getElementById('btnImport').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    if (Storage.importAll(data)) {
                        _showToast('✅', 'Import erfolgreich', 'Alle Daten wurden wiederhergestellt.');
                        _updateXPDisplay();
                        _renderDashboard();
                    } else {
                        _showToast('❌', 'Import fehlgeschlagen', 'Ungültiges Dateiformat.');
                    }
                } catch {
                    _showToast('❌', 'Import fehlgeschlagen', 'Datei konnte nicht gelesen werden.');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });

        document.getElementById('btnResetLevels').addEventListener('click', () => {
            if (_confirm('Level-Fortschritt wirklich zurücksetzen?')) {
                Levels.resetAllProgress();
                _showToast('🔄', 'Zurückgesetzt', 'Level-Fortschritt wurde gelöscht.');
                _renderDashboard();
            }
        });

        document.getElementById('btnResetAll').addEventListener('click', () => {
            if (_confirm('ALLE Daten wirklich löschen? Dies kann nicht rückgängig gemacht werden!')) {
                Storage.clearAll();
                _showToast('🗑️', 'Gelöscht', 'Alle Daten wurden entfernt.');
                _updateXPDisplay();
                _renderDashboard();
            }
        });
    }

    // ==================== XP DISPLAY ====================

    function _updateXPDisplay() {
        const xp = Storage.getXP();
        document.getElementById('xpLevel').textContent = `Level ${xp.userLevel}`;
        document.getElementById('xpPoints').textContent = `${xp.total} XP`;

        const nextLevelXP = _getNextLevelXP(xp.userLevel);
        const prevLevelXP = _getPrevLevelXP(xp.userLevel);
        const progress = nextLevelXP > prevLevelXP
            ? ((xp.total - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100
            : 100;

        document.getElementById('xpBar').style.width = Math.min(100, progress) + '%';
    }

    function _getNextLevelXP(level) {
        let cumulative = 0;
        for (let i = 1; i < level + 1; i++) {
            cumulative += Math.floor(50 * Math.pow(1.15, i));
        }
        return cumulative;
    }

    function _getPrevLevelXP(level) {
        if (level <= 1) return 0;
        let cumulative = 0;
        for (let i = 1; i < level; i++) {
            cumulative += Math.floor(50 * Math.pow(1.15, i));
        }
        return cumulative;
    }

    // ==================== COUNTDOWN ====================

    function _updateCountdown() {
        const days = Progress.getDaysUntilTarget();
        document.getElementById('sidebarCountdown').textContent = days;

        const dashboardBadge = document.getElementById('dashboardCountdown');
        if (dashboardBadge) {
            const target = Storage.getSettings().targetDate || '2026-06-01';
            const formatted = new Date(target + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
            dashboardBadge.textContent = days > 0 ? `${days} Tage bis ${formatted}` : 'Prüfung ist da!';
        }
    }

    function _updateDaysUntilLabel() {
        const days = Progress.getDaysUntilTarget();
        const target = Storage.getSettings().targetDate || '2026-06-01';
        const formatted = new Date(target + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const label = document.getElementById('daysUntilLabel');
        if (label) {
            label.textContent = days > 0 ? `Noch ${days} Tage bis zum ${formatted}` : 'Prüfungstermin erreicht!';
        }
    }

    // ==================== UTILITIES ====================

    function _escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    function _confirm(message) {
        return window.confirm(message);
    }

    function _showToast(icon, title, text) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <div>
                <div class="toast-title">${title}</div>
                <div class="toast-text">${text}</div>
            </div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 4000);
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
