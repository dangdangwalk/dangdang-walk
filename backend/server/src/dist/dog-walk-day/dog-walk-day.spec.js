"use strict";
const _dogwalkdayentity = require("./dog-walk-day.entity");
describe('DogWalkDay', ()=>{
    context('정보가 주어지면 ', ()=>{
        it('dogWalkDay 정보를 반환해야 한다.', ()=>{
            const dogWalkDay = new _dogwalkdayentity.DogWalkDay();
            dogWalkDay.mon = 2;
            dogWalkDay.tue = 3;
            dogWalkDay.wed = 2;
            dogWalkDay.thr = 5;
            dogWalkDay.fri = 2;
            dogWalkDay.sat = 3;
            dogWalkDay.sun = 2;
            expect(dogWalkDay.mon).toBe(2);
            expect(dogWalkDay.tue).toBe(3);
            expect(dogWalkDay.wed).toBe(2);
            expect(dogWalkDay.thr).toBe(5);
            expect(dogWalkDay.fri).toBe(2);
            expect(dogWalkDay.sat).toBe(3);
            expect(dogWalkDay.sun).toBe(2);
        });
    });
    context('정보가 없으면 ', ()=>{
        it('빈 객체를 반환해야 한다.', ()=>{
            const dogWalkDay = new _dogwalkdayentity.DogWalkDay();
            expect(dogWalkDay.tue).toBe(undefined);
            expect(dogWalkDay.wed).toBe(undefined);
            expect(dogWalkDay.thr).toBe(undefined);
            expect(dogWalkDay.fri).toBe(undefined);
            expect(dogWalkDay.sat).toBe(undefined);
            expect(dogWalkDay.sun).toBe(undefined);
        });
    });
});

//# sourceMappingURL=dog-walk-day.spec.js.map