import {
    formatDate,
    getOneMonthAgo,
    getStartAndEndOfDay,
    getStartAndEndOfMonth,
    getStartAndEndOfWeek,
    getWeek,
} from './date.util';

describe('formatDate', () => {
    test('should return the correct formatted date string', () => {
        const date1 = new Date('2024-05-21');
        expect(formatDate(date1)).toBe('2024-05-21');

        const date2 = new Date('2023-08-09');
        expect(formatDate(date2)).toBe('2023-08-09');

        const date3 = new Date('2001-01-26');
        expect(formatDate(date3)).toBe('2001-01-26');
    });
});

describe('getWeek', () => {
    test('should return the correct week number for a given date', () => {
        const date1 = new Date('2024-05-17');
        expect(getWeek(date1)).toBe(3);

        const date2 = new Date('2024-05-01');
        expect(getWeek(date2)).toBe(1);

        const date3 = new Date('2024-05-31');
        expect(getWeek(date3)).toBe(5);

        const date4 = new Date('2024-06-30');
        expect(getWeek(date4)).toBe(6);

        const date5 = new Date('2023-02-15');
        expect(getWeek(date5)).toBe(3);

        const date6 = new Date('2023-12-19');
        expect(getWeek(date6)).toBe(4);

        const date7 = new Date('2023-12-25');
        expect(getWeek(date7)).toBe(5);
    });
});

describe('getStartAndEndOfMonth', () => {
    test('should return the correct start and end dates for the month of a given date', () => {
        const date1 = new Date('2024-05-17');
        const { startDate: startDate1, endDate: endDate1 } = getStartAndEndOfMonth(date1);
        expect(formatDate(startDate1)).toBe('2024-05-01');
        expect(formatDate(endDate1)).toBe('2024-05-31');

        const date2 = new Date('2023-02-15');
        const { startDate: startDate2, endDate: endDate2 } = getStartAndEndOfMonth(date2);
        expect(formatDate(startDate2)).toBe('2023-02-01');
        expect(formatDate(endDate2)).toBe('2023-02-28');

        const date3 = new Date('2023-12-25');
        const { startDate: startDate3, endDate: endDate3 } = getStartAndEndOfMonth(date3);
        expect(formatDate(startDate3)).toBe('2023-12-01');
        expect(formatDate(endDate3)).toBe('2023-12-31');
    });
});

describe('getStartAndEndOfWeek', () => {
    test('should return the correct start and end dates for the week of a given date', () => {
        const date1 = new Date('2024-05-30');
        const { startDate: startDate1, endDate: endDate1 } = getStartAndEndOfWeek(date1);
        expect(formatDate(startDate1)).toBe('2024-05-26');
        expect(formatDate(endDate1)).toBe('2024-06-01');

        const date2 = new Date('2023-03-01');
        const { startDate: startDate2, endDate: endDate2 } = getStartAndEndOfWeek(date2);
        expect(formatDate(startDate2)).toBe('2023-02-26');
        expect(formatDate(endDate2)).toBe('2023-03-04');

        const date3 = new Date('2001-01-26');
        const { startDate: startDate3, endDate: endDate3 } = getStartAndEndOfWeek(date3);
        expect(formatDate(startDate3)).toBe('2001-01-21');
        expect(formatDate(endDate3)).toBe('2001-01-27');
    });
});

describe('getStartAndEndOfDay', () => {
    test('should return the correct start and end dates for the day of a given date', () => {
        const date1 = new Date('2024-05-12T12:30:00');
        const { startDate: startDate1, endDate: endDate1 } = getStartAndEndOfDay(date1);
        expect(startDate1.getTime()).toBe(new Date('2024-05-12T00:00:00').getTime());
        expect(endDate1.getTime()).toBe(new Date('2024-05-12T23:59:59.999').getTime());

        const date2 = new Date('2023-10-03T23:45:00');
        const { startDate: startDate2, endDate: endDate2 } = getStartAndEndOfDay(date2);
        expect(startDate2.getTime()).toBe(new Date('2023-10-03T00:00:00').getTime());
        expect(endDate2.getTime()).toBe(new Date('2023-10-03T23:59:59.999').getTime());

        const date3 = new Date('2008-02-25T03:14:00');
        const { startDate: startDate3, endDate: endDate3 } = getStartAndEndOfDay(date3);
        expect(startDate3.getTime()).toBe(new Date('2008-02-25T00:00:00').getTime());
        expect(endDate3.getTime()).toBe(new Date('2008-02-25T23:59:59.999').getTime());
    });
});

describe('getOneMonthAgo', () => {
    test('should return the correct date one month ago from the given date', () => {
        const date1 = new Date('2024-03-01');
        const oneMonthAgoDate1 = getOneMonthAgo(date1);
        expect(formatDate(oneMonthAgoDate1)).toBe('2024-02-01');

        const date2 = new Date('2022-06-25');
        const oneMonthAgoDate2 = getOneMonthAgo(date2);
        expect(formatDate(oneMonthAgoDate2)).toBe('2022-05-25');

        const date3 = new Date('1900-10-25');
        const oneMonthAgoDate3 = getOneMonthAgo(date3);
        expect(formatDate(oneMonthAgoDate3)).toBe('1900-09-25');
    });
});
