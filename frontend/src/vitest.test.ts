import { describe, expect, it } from 'vitest';

describe('Vitest 확인', () => {
    it('2와 같아야 한다', () => {
        expect(1 + 1).toEqual(2);
    });
    it('3의 결과값을 리턴해야 한다.', () => {
        expect(2 + 1).toEqual(3);
    });
    it('4의 결과값을 리턴해야 한다.', () => {
        expect(2 + 2).toEqual(4);
    });
    it('5의 결과값을 리턴해야 한다.', () => {
        expect(2 + 3).toEqual(5);
    });
});
