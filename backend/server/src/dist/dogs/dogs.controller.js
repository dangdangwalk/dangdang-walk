"use strict";
Object.defineProperty(exports, "DogsController", {
    enumerable: true,
    get: function() {
        return DogsController;
    }
});
const _common = require("@nestjs/common");
const _dogsservice = require("./dogs.service");
const _createdogdto = require("./dtos/create-dog.dto");
const _updatedogdto = require("./dtos/update-dog.dto");
const _authdogguard = require("./guards/auth-dog.guard");
const _tokenservice = require("../auth/token/token.service");
const _userdecorator = require("../users/decorators/user.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let DogsController = class DogsController {
    async getProfileList({ userId }) {
        return this.dogsService.getProfileList(userId);
    }
    async create({ userId }, createDogDto) {
        await this.dogsService.createDogToUser(userId, createDogDto);
    }
    async getProfile(dogId) {
        return this.dogsService.getProfile(dogId);
    }
    async update({ userId }, dogId, updateDogDto) {
        await this.dogsService.updateDog(userId, dogId, updateDogDto);
    }
    async delete({ userId }, dogId) {
        await this.dogsService.deleteDogFromUser(userId, dogId);
    }
    constructor(dogsService){
        this.dogsService = dogsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsController.prototype, "getProfileList", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        typeof _createdogdto.CreateDogDto === "undefined" ? Object : _createdogdto.CreateDogDto
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)('/:id(\\d+)'),
    (0, _common.UseGuards)(_authdogguard.AuthDogGuard),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsController.prototype, "getProfile", null);
_ts_decorate([
    (0, _common.Patch)('/:id(\\d+)'),
    (0, _common.HttpCode)(204),
    (0, _common.UseGuards)(_authdogguard.AuthDogGuard),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        Number,
        typeof _updatedogdto.UpdateDogDto === "undefined" ? Object : _updatedogdto.UpdateDogDto
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)('/:id(\\d+)'),
    (0, _common.HttpCode)(204),
    (0, _common.UseGuards)(_authdogguard.AuthDogGuard),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsController.prototype, "delete", null);
DogsController = _ts_decorate([
    (0, _common.Controller)('/dogs'),
    (0, _common.UsePipes)(new _common.ValidationPipe({
        validateCustomDecorators: true,
        whitelist: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dogsservice.DogsService === "undefined" ? Object : _dogsservice.DogsService
    ])
], DogsController);

//# sourceMappingURL=dogs.controller.js.map