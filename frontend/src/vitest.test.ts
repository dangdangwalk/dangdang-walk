import { describe, expect, it } from 'vitest';

describe('Vitest 확인', () => {
    it('2와 같아야 한다', () => {
        expect(1 + 1).toEqual(2);
    });
    it('3와 같아야 한다', () => {
        expect(1 + 2).toEqual(3);
    });
});
