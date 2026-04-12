'use strict';

const Calendar = (() => {
    function _today() {
        return new Date().toISOString().split('T')[0];
    }

    function recordPractice(durationSeconds) {
        const data = Storage.getCalendarData();
        const today = _today();

        if (!data[today]) {
            data[today] = {
                totalSeconds: 0,
                exercises: 0,
                firstAt: new Date().toISOString()
            };
        }

        data[today].totalSeconds += durationSeconds;
        data[today].exercises += 1;
        data[today].lastAt = new Date().toISOString();

        Storage.saveCalendarData(data);
        return data[today];
    }

    function getDayData(dateStr) {
        const data = Storage.getCalendarData();
        return data[dateStr] || null;
    }

    function getMonthData(year, month) {
        const data = Storage.getCalendarData();
        const result = {};
        const prefix = `${year}-${String(month).padStart(2, '0')}`;

        for (const [dateStr, dayData] of Object.entries(data)) {
            if (dateStr.startsWith(prefix)) {
                result[dateStr] = dayData;
            }
        }

        return result;
    }

    function hasPracticedToday() {
        return getDayData(_today()) !== null;
    }

    function calculateStreak(calendarData) {
        if (!calendarData) {
            calendarData = Storage.getCalendarData();
        }

        const dates = Object.keys(calendarData).sort().reverse();
        if (dates.length === 0) return 0;

        let streak = 0;
        let checkDate = new Date();

        const todayData = calendarData[_today()];
        if (!todayData) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (calendarData[dateStr]) {
                streak++;
            } else {
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }

        return streak;
    }

    function getLongestStreak() {
        const data = Storage.getCalendarData();
        const dates = Object.keys(data).sort();

        if (dates.length === 0) return 0;

        let longest = 1;
        let current = 1;

        for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 1;
            }
        }

        return longest;
    }

    function getTotalPracticeDays() {
        const data = Storage.getCalendarData();
        return Object.keys(data).length;
    }

    function getTotalPracticeMinutes() {
        const data = Storage.getCalendarData();
        let total = 0;
        for (const dayData of Object.values(data)) {
            total += dayData.totalSeconds;
        }
        return Math.round(total / 60);
    }

    function getIntensityLevel(dateStr) {
        const dayData = getDayData(dateStr);
        if (!dayData) return 0;

        const minutes = dayData.totalSeconds / 60;
        if (minutes < 5) return 1;
        if (minutes < 15) return 2;
        if (minutes < 30) return 3;
        if (minutes < 60) return 4;
        return 5;
    }

    function getStats() {
        const data = Storage.getCalendarData();
        return {
            totalDays: getTotalPracticeDays(),
            totalMinutes: getTotalPracticeMinutes(),
            currentStreak: calculateStreak(data),
            longestStreak: getLongestStreak(),
            practicedToday: hasPracticedToday()
        };
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function getFirstDayOfMonth(year, month) {
        const day = new Date(year, month - 1, 1).getDay();
        return day === 0 ? 6 : day - 1;
    }

    return {
        recordPractice,
        getDayData,
        getMonthData,
        hasPracticedToday,
        calculateStreak,
        getLongestStreak,
        getTotalPracticeDays,
        getTotalPracticeMinutes,
        getIntensityLevel,
        getStats,
        getDaysInMonth,
        getFirstDayOfMonth
    };
})();
