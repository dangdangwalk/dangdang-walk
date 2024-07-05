export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getWeekNumber(date: Date): number {
    const currentDate = date.getDate();
    const firstDay = new Date(date.setDate(1)).getDay();

    return Math.ceil((currentDate + firstDay) / 7);
}

interface DateRange {
    startDate: Date;
    endDate: Date;
}

export function getStartAndEndOfMonth(date: Date): DateRange {
    const startDate = new Date(date);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
}

export function getStartAndEndOfWeek(date: Date): DateRange {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
}

export function getStartAndEndOfDay(date: Date): DateRange {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
}

export function getOneMonthAgo(date: Date): DateRange {
    const startDate = new Date(date);
    startDate.setMonth(date.getMonth() - 1);

    const endDate = new Date(date);

    return { startDate, endDate };
}

export function getLastSunday() {
    const now = new Date();
    let lastSunday;

    if (now.getDay() > 0) {
        const millisecondsToLastSunday = (now.getDay() - 1) * 24 * 60 * 60 * 1000 + 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastSunday = new Date(today.getTime() - millisecondsToLastSunday);
    } else {
        lastSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8, 23, 59, 59);
    }

    return lastSunday;
}

export function getStartOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
}
