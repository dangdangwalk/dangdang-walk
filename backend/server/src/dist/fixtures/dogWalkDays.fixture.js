"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    mockDogWalkDay: function() {
        return mockDogWalkDay;
    },
    mockDogWalkDays: function() {
        return mockDogWalkDays;
    }
});
const mockDogWalkDays = [
    {
        id: 1,
        mon: 2,
        tue: 1,
        wed: 3,
        thr: 0,
        fri: 4,
        sat: 2,
        sun: 1,
        updatedAt: new Date('2023-06-01T10:00:00Z')
    },
    {
        id: 2,
        mon: 1,
        tue: 2,
        wed: 1,
        thr: 3,
        fri: 2,
        sat: 1,
        sun: 0,
        updatedAt: new Date('2023-06-02T12:00:00Z')
    }
];
const mockDogWalkDay = {
    id: 1,
    mon: 1,
    tue: 2,
    wed: 1,
    thr: 3,
    fri: 2,
    sat: 1,
    sun: 0,
    updatedAt: new Date('2023-06-02T12:00:00Z')
};

//# sourceMappingURL=dogWalkDays.fixture.js.map