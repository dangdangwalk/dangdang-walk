import Distance from './Distance';
import { describe, expect, it } from 'vitest';

describe('Distance 관련 test', () => {
    it('distance format test', () => {
        const data1 = new Distance(0);
        const data2 = new Distance(0.009);
        const data3 = new Distance(1);
        const data4 = new Distance(1.1);
        const data5 = new Distance(1000);
        const data6 = new Distance(10001);

        expect(data1.formatedDistance).toBe('0');
        expect(data2.formatedDistance).toBe('0');
        expect(data3.formatedDistance).toBe('1');
        expect(data4.formatedDistance).toBe('1');
        expect(data5.formatedDistance).toBe('1.00');
        expect(data6.formatedDistance).toBe('10.00');
    });
    it('distance unit test', () => {
        const km = new Distance(1000);
        const km2 = new Distance(999.9);
        const m = new Distance(999);

        expect(km.unit).toBe('km');
        expect(km2.unit).toBe('km');
        expect(m.unit).toBe('m');
    });
});
