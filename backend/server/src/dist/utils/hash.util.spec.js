"use strict";
const _hashutil = require("./hash.util");
describe('generateUuid', ()=>{
    it('유효한 UUID 생성한다.', ()=>{
        const uuid = (0, _hashutil.generateUuid)();
        expect(uuid).toEqual(expect.any(String));
    });
    it('서로 다른 UUID 동일하지 않다.', ()=>{
        const uuidV1 = (0, _hashutil.generateUuid)();
        const uuidV2 = (0, _hashutil.generateUuid)();
        expect(uuidV1).not.toBe(uuidV2);
    });
});

//# sourceMappingURL=hash.util.spec.js.map