import { getWeek } from './date.utils';

describe('getWeek', () => {
    test('should return the correct week number for a given date', () => {
        const date1 = new Date('2024-05-17'); // May 17, 2024
        expect(getWeek(date1)).toBe(3); // May 17, 2024 is in the 3rd week of May

        const date2 = new Date('2024-05-01'); // May 1, 2024
        expect(getWeek(date2)).toBe(1); // May 1, 2024 is in the 1st week of May

        const date3 = new Date('2024-05-31'); // May 31, 2024
        expect(getWeek(date3)).toBe(5); // May 31, 2024 is in the 5th week of May

        const date4 = new Date('2024-06-30'); // June 30, 2024
        expect(getWeek(date4)).toBe(6); // June 30, 2024 is in the 6th week of June

        const date5 = new Date('2023-02-15'); // February 15, 2023
        expect(getWeek(date5)).toBe(3); // February 15, 2023 is in the 3rd week of February

        const date6 = new Date('2023-12-19'); // December 19, 2023
        expect(getWeek(date6)).toBe(4); // December 19, 2023 is in the 4th week of December

        const date7 = new Date('2023-12-25'); // December 25, 2023
        expect(getWeek(date7)).toBe(5); // December 25, 2023 is in the 5th week of December
    });
});
