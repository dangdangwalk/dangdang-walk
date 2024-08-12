"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogSummaryResponse = exports.DogProfileResponse = exports.GENDER = void 0;
exports.GENDER = {
    Male: 'MALE',
    Female: 'FEMALE',
};
class DogProfileResponse {
    static getFieldsForDogTableAndRaw() {
        return ['id', 'name', 'gender', 'isNeutered', 'birth', 'weight', 'profilePhotoUrl'];
    }
}
exports.DogProfileResponse = DogProfileResponse;
class DogSummaryResponse {
    static getFieldsForDogTableAndRaw() {
        return ['id', 'name', 'profilePhotoUrl'];
    }
}
exports.DogSummaryResponse = DogSummaryResponse;
//# sourceMappingURL=dogs.type.js.map