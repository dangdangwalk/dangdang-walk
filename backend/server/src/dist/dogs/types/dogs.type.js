"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DogProfileResponse: function() {
        return DogProfileResponse;
    },
    DogSummaryResponse: function() {
        return DogSummaryResponse;
    },
    GENDER: function() {
        return GENDER;
    }
});
const GENDER = {
    Male: 'MALE',
    Female: 'FEMALE'
};
let DogProfileResponse = class DogProfileResponse {
    static getFieldsForDogTableAndRaw() {
        return [
            'id',
            'name',
            'gender',
            'isNeutered',
            'birth',
            'weight',
            'profilePhotoUrl'
        ];
    }
};
let DogSummaryResponse = class DogSummaryResponse {
    static getFieldsForDogTableAndRaw() {
        return [
            'id',
            'name',
            'profilePhotoUrl'
        ];
    }
};

//# sourceMappingURL=dogs.type.js.map