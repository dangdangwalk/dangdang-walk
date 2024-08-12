"use strict";
const _dogsentity = require("./dogs.entity");
const _dogstype = require("./types/dogs.type");
const _dogwalkdayentity = require("../dog-walk-day/dog-walk-day.entity");
const _dogsfixture = require("../fixtures/dogs.fixture");
const _todaywalktimeentity = require("../today-walk-time/today-walk-time.entity");
describe('Dogs', ()=>{
    it('dogs 정보가 주어지면 dogs 정보를 반환해야 한다.', ()=>{
        expect(_dogsfixture.mockDog).toEqual({
            id: 1,
            walkDay: new _dogwalkdayentity.DogWalkDay({}),
            todayWalkTime: new _todaywalktimeentity.TodayWalkTime({}),
            name: '덕지',
            breedId: 1,
            gender: _dogstype.GENDER.Male,
            birth: null,
            isNeutered: true,
            weight: 2,
            profilePhotoUrl: 'default/profile.png',
            isWalking: false,
            updatedAt: expect.any(Date)
        });
    });
    it('dogs 정보가 없으면 빈 객체를 반환해야 한다.', ()=>{
        const breed = new _dogsentity.Dogs({});
        expect(breed).toEqual({});
    });
});

//# sourceMappingURL=dogs.spec.js.map