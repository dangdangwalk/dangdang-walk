"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    mockDog: function() {
        return mockDog;
    },
    mockDog2: function() {
        return mockDog2;
    },
    mockDog2Profile: function() {
        return mockDog2Profile;
    },
    mockDogProfile: function() {
        return mockDogProfile;
    }
});
const _dogstype = require("../dogs/types/dogs.type");
const _dogwalkdayentity = require("../dog-walk-day/dog-walk-day.entity");
const _dogsentity = require("../dogs/dogs.entity");
const _todaywalktimeentity = require("../today-walk-time/today-walk-time.entity");
const mockDog = new _dogsentity.Dogs({
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
    updatedAt: new Date('2019-01-01')
});
const mockDogProfile = {
    id: 1,
    name: '덕지',
    breed: '아펜핀셔',
    gender: 'MALE',
    isNeutered: true,
    birth: null,
    weight: 2,
    profilePhotoUrl: 'default/profile.png'
};
const mockDog2 = new _dogsentity.Dogs({
    id: 2,
    walkDay: new _dogwalkdayentity.DogWalkDay({}),
    todayWalkTime: new _todaywalktimeentity.TodayWalkTime({}),
    name: '루이',
    breedId: 2,
    gender: _dogstype.GENDER.Female,
    birth: null,
    isNeutered: false,
    weight: 1,
    profilePhotoUrl: 'default/profile.png',
    isWalking: false,
    updatedAt: new Date('2019-01-01')
});
const mockDog2Profile = {
    id: 2,
    name: '루이',
    breed: '아프간 하운드',
    gender: 'FEMALE',
    isNeutered: false,
    birth: null,
    weight: 1,
    profilePhotoUrl: 'default/profile.png'
};

//# sourceMappingURL=dogs.fixture.js.map