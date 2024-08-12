"use strict";
const _breedentity = require("./breed.entity");
describe('Breed', ()=>{
    context('정보가 주어지면', ()=>{
        it('breed 정보를 반환해야 한다.', ()=>{
            const breed = new _breedentity.Breed();
            breed.id = 1;
            breed.koreanName = '골드리트리버';
            breed.recommendedWalkAmount = 1;
            expect(breed.id).toBe(1);
            expect(breed.koreanName).toBe('골드리트리버');
            expect(breed.recommendedWalkAmount).toBe(1);
        });
    });
    context('정보가 없으면', ()=>{
        it('빈 객체를 반환해야 한다.', ()=>{
            const breed = new _breedentity.Breed();
            expect(breed).toEqual({});
        });
    });
});

//# sourceMappingURL=breed.spec.js.map