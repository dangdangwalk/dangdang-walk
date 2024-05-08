import { distanceFormat } from './format';
import { describe, expect, it } from 'vitest';

describe('format 관련 test', () => {
    it('distance format test', () => {
        const data1 = distanceFormat(0);
        const data2 = distanceFormat(0.009);
        const data3 = distanceFormat(1);
        const data4 = distanceFormat(1.1);
        const data5 = distanceFormat(1.009);
        const data6 = distanceFormat(10.001);

        expect(data1).toMatch('0.00');
        expect(data2).toBe('0.01');
        expect(data3).toBe('1.00');
        expect(data4).toBe('1.10');
        expect(data5).toBe('1.01');
        expect(data6).toBe('10.00');
    });
});
