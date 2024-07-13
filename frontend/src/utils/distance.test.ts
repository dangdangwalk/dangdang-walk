import { formatDistance, valueWithUnit } from '@/utils/distance';
import { describe, expect, it } from 'vitest';

describe('Distance 관련 test', () => {
    it('distance format test', () => {
        const data1 = formatDistance(0);
        const data2 = formatDistance(10);
        const data3 = formatDistance(100);
        const data4 = formatDistance(9);
        const data5 = formatDistance(1000);
        const data6 = formatDistance(10001);

        expect(data1).toBe('0.00');
        expect(data2).toBe('0.01');
        expect(data3).toBe('0.10');
        expect(data4).toBe('0.01');
        expect(data5).toBe('1.00');
        expect(data6).toBe('10.00');
    });
    it('distance value with unit test', () => {
        const km = valueWithUnit(1000);
        const km2 = valueWithUnit(999.9);

        expect(km).toMatch(/1.00 km/i);
        expect(km2).toMatch(/1.00 km/i);
    });
});
