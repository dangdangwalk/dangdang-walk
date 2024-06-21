import { formatDistance, valueWithUnit } from '@/utils/distance';
import { describe, expect, it } from 'vitest';

describe('Distance 관련 test', () => {
    it('distance format test', () => {
        const data1 = formatDistance(0);
        const data2 = formatDistance(0.009);
        const data3 = formatDistance(1);
        const data4 = formatDistance(1.1);
        const data5 = formatDistance(1000);
        const data6 = formatDistance(10001);

        expect(data1).toBe('0');
        expect(data2).toBe('0');
        expect(data3).toBe('1');
        expect(data4).toBe('1');
        expect(data5).toBe('1.00');
        expect(data6).toBe('10.00');
    });
    it('distance value with unit test', () => {
        const km = valueWithUnit(1000);
        const km2 = valueWithUnit(999.9);
        const m = valueWithUnit(999);

        expect(km).toMatch(/1.00 km/i);
        expect(km2).toMatch(/1.00 km/i);
        expect(m).toMatch(/999 m/i);
    });
});
