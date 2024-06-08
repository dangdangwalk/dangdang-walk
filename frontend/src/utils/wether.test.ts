import { describe, expect, it } from 'vitest';
import { getSkyGrade, weatherStatus } from './weather';

describe('weather util test', () => {
    it('산책하기 좋은지 확인하기', () => {
        const status = weatherStatus(-2, 0);
        const status1 = weatherStatus(35, 0);
        const status2 = weatherStatus(28, 0);
        const status3 = weatherStatus(17, 3);
        const status4 = weatherStatus(17, 6);

        expect(status).toBe(false);
        expect(status1).toBe(false);
        expect(status2).toBe(true);
        expect(status3).toBe(false);
        expect(status4).toBe(false);
    });

    it('하늘 상태 확인하기', () => {
        const status = getSkyGrade({
            sky: 1,
            precipitation: 0,
            sunrise: '0600',
            sunset: '1800',
            time: '1201',
        });
        const status1 = getSkyGrade({
            sky: 2,
            precipitation: 1,
            sunrise: '0600',
            sunset: '1800',
            time: '1201',
        });
        const status2 = getSkyGrade({
            sky: 3,
            precipitation: 0,
            sunrise: '0600',
            sunset: '1800',
            time: '1201',
        });
        const status3 = getSkyGrade({
            sky: 2,
            precipitation: 2,
            sunrise: '0600',
            sunset: '1800',
            time: '1800',
        });
        const status4 = getSkyGrade({
            sky: 2,
            precipitation: 0,
            sunrise: '0600',
            sunset: '1800',
            time: '0500',
        });
        const status5 = getSkyGrade({
            sky: 3,
            precipitation: 0,
            sunrise: '0600',
            sunset: '1800',
            time: '0500',
        });
        const status6 = getSkyGrade({
            sky: 4,
            precipitation: 0,
            sunrise: '0600',
            sunset: '1800',
            time: '0500',
        });

        expect(status).toBe('dayClear');
        expect(status1).toBe('rain');
        expect(status2).toBe('dayCloudy');
        expect(status3).toBe('snow');
        expect(status4).toBe('nightClear');
        expect(status5).toBe('nightCloudy');
        expect(status6).toBe('cloudy');
    });
});
