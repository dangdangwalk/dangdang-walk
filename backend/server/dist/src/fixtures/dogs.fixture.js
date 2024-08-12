"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDog2Profile = exports.mockDog2 = exports.mockDogProfile = exports.mockDog = void 0;
const dog_walk_day_entity_1 = require("../dog-walk-day/dog-walk-day.entity");
const dogs_entity_1 = require("../dogs/dogs.entity");
const dogs_type_1 = require("../dogs/types/dogs.type");
const today_walk_time_entity_1 = require("../today-walk-time/today-walk-time.entity");
exports.mockDog = new dogs_entity_1.Dogs({
    id: 1,
    walkDay: new dog_walk_day_entity_1.DogWalkDay({}),
    todayWalkTime: new today_walk_time_entity_1.TodayWalkTime({}),
    name: '덕지',
    breedId: 1,
    gender: dogs_type_1.GENDER.Male,
    birth: null,
    isNeutered: true,
    weight: 2,
    profilePhotoUrl: 'default/profile.png',
    isWalking: false,
    updatedAt: new Date('2019-01-01'),
});
exports.mockDogProfile = {
    id: 1,
    name: '덕지',
    breed: '아펜핀셔',
    gender: 'MALE',
    isNeutered: true,
    birth: null,
    weight: 2,
    profilePhotoUrl: 'default/profile.png',
};
exports.mockDog2 = new dogs_entity_1.Dogs({
    id: 2,
    walkDay: new dog_walk_day_entity_1.DogWalkDay({}),
    todayWalkTime: new today_walk_time_entity_1.TodayWalkTime({}),
    name: '루이',
    breedId: 2,
    gender: dogs_type_1.GENDER.Female,
    birth: null,
    isNeutered: false,
    weight: 1,
    profilePhotoUrl: 'default/profile.png',
    isWalking: false,
    updatedAt: new Date('2019-01-01'),
});
exports.mockDog2Profile = {
    id: 2,
    name: '루이',
    breed: '아프간 하운드',
    gender: 'FEMALE',
    isNeutered: false,
    birth: null,
    weight: 1,
    profilePhotoUrl: 'default/profile.png',
};
//# sourceMappingURL=dogs.fixture.js.map