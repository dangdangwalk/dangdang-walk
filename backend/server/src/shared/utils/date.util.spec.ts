import {
    formatDate,
    getLastSunday,
    getOneMonthAgo,
    getStartAndEndOfDay,
    getStartAndEndOfMonth,
    getStartAndEndOfWeek,
    getWeekNumber,
} from './date.util';

describe('formatDate', () => {
    it('날짜 객체를 문자열로 입력하면 "YYYY-MM-DD" 형식의 문자열을 반환한다', () => {
        const date = new Date('2024-05-21');

        expect(formatDate(date)).toBe('2024-05-21');
    });
});

describe('getWeekNumber', () => {
    it('주어진 날짜에 대한 올바른 주 번호를 반환한다', () => {
        const date = new Date('2024-05-17');

        expect(getWeekNumber(date)).toBe(3);
    });
});

describe('getStartAndEndOfMonth', () => {
    it('주어진 날짜의 달에 대한 올바른 시작일과 종료일을 반환한다', () => {
        const date = new Date('2024-05-17');
        const { startDate, endDate } = getStartAndEndOfMonth(date);

        expect(formatDate(startDate)).toBe('2024-05-01');
        expect(formatDate(endDate)).toBe('2024-05-31');
    });
});

describe('getStartAndEndOfWeek', () => {
    it('주어진 날짜의 주에 대한 올바른 시작일과 종료일을 반환한다', () => {
        const date = new Date('2024-05-30');
        const { startDate, endDate } = getStartAndEndOfWeek(date);

        expect(formatDate(startDate)).toBe('2024-05-26');
        expect(formatDate(endDate)).toBe('2024-06-01');
    });
});

describe('getStartAndEndOfDay', () => {
    it('주어진 날짜에 대한 정확한 시작 시간(00:00:00)과 종료 시간(23:59:59)을 반환한다', () => {
        const date = new Date('2024-05-12T12:30:00');
        const { startDate, endDate } = getStartAndEndOfDay(date);

        expect(startDate.getTime()).toBe(new Date('2024-05-12T00:00:00').getTime());
        expect(endDate.getTime()).toBe(new Date('2024-05-12T23:59:59.999').getTime());
    });
});

describe('getOneMonthAgo', () => {
    it('주어진 날짜로부터 한 달 전의 정확한 날짜를 반환한다', () => {
        const date = new Date('2024-03-01');
        const { startDate, endDate } = getOneMonthAgo(date);

        expect(formatDate(startDate)).toBe('2024-02-01');
        expect(formatDate(endDate)).toBe('2024-03-01');
    });
});

describe('getLastSunday', () => {
    it('현재 날짜의 마지막 일요일을 반환한다', () => {
        const lastSunday = getLastSunday();

        expect(formatDate(lastSunday)).toEqual(expect.any(String));
    });
});
