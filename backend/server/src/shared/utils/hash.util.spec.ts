import { generateUuid } from './hash.util';

describe('generateUuid', () => {
    it('유효한 UUID 생성한다.', () => {
        const uuid = generateUuid();

        expect(uuid).toEqual(expect.any(String));
    });

    it('서로 다른 UUID 동일하지 않다.', () => {
        const uuidV1 = generateUuid();
        const uuidV2 = generateUuid();

        expect(uuidV1).not.toBe(uuidV2);
    });
});
