"use strict";
Object.defineProperty(exports, "CreateDogDto", {
    enumerable: true,
    get: function() {
        return CreateDogDto;
    }
});
const _classvalidator = require("class-validator");
const _dogstype = require("../types/dogs.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateDogDto = class CreateDogDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateDogDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateDogDto.prototype, "breed", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_dogstype.GENDER),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _dogstype.Gender === "undefined" ? Object : _dogstype.Gender)
], CreateDogDto.prototype, "gender", void 0);
_ts_decorate([
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Boolean)
], CreateDogDto.prototype, "isNeutered", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], CreateDogDto.prototype, "birth", void 0);
_ts_decorate([
    (0, _classvalidator.IsPositive)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], CreateDogDto.prototype, "weight", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], CreateDogDto.prototype, "profilePhotoUrl", void 0);

//# sourceMappingURL=create-dog.dto.js.map