import { describe, expect, it } from 'vitest';
import { toggleCheckById } from './check';

describe('check util test', () => {
    it('check ', () => {
        const array = [
            {
                id: 0,
                name: 'test1',
                checked: false,
            },
            {
                id: 1,
                name: 'test2',
                checked: false,
            },
            {
                id: 2,
                name: 'test3',
                checked: false,
            },
        ];
        const result1 = toggleCheckById(array, 1, 'checked');

        expect(result1[0]?.checked).toBe(false);
        expect(result1[1]?.checked).toBe(true);

        const result2 = toggleCheckById(result1, 1, 'checked');

        expect(result2[0]?.checked).toBe(false);
        expect(result2[1]?.checked).toBe(false);
    });
});
