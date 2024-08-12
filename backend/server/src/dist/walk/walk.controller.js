"use strict";
Object.defineProperty(exports, "WalkController", {
    enumerable: true,
    get: function() {
        return WalkController;
    }
});
const _common = require("@nestjs/common");
const _authdogsguard = require("./guards/auth-dogs.guard");
const _walkservice = require("./walk.service");
const _tokenservice = require("../auth/token/token.service");
const _dogsservice = require("../dogs/dogs.service");
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
let WalkController = class WalkController {
    async startWalk(dogIds) {
        return this.dogsService.updateIsWalking(dogIds, true);
    }
    async stopWalk(dogIds) {
        return this.dogsService.updateIsWalking(dogIds, false);
    }
    async getAvailableDogs({ userId }) {
        return this.walkService.getAvailableDogs(userId);
    }
    constructor(walkService, dogsService){
        this.walkService = walkService;
        this.dogsService = dogsService;
    }
};
_ts_decorate([
    (0, _common.Post)('/start'),
    (0, _common.HttpCode)(200),
    (0, _common.UseGuards)(_authdogsguard.AuthDogsGuard),
    _ts_param(0, (0, _common.Body)(new _common.ParseArrayPipe({
        items: Number,
        separator: ','
    }))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], WalkController.prototype, "startWalk", null);
_ts_decorate([
    (0, _common.Post)('/stop'),
    (0, _common.HttpCode)(200),
    (0, _common.UseGuards)(_authdogsguard.AuthDogsGuard),
    _ts_param(0, (0, _common.Body)(new _common.ParseArrayPipe({
        items: Number,
        separator: ','
    }))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], WalkController.prototype, "stopWalk", null);
_ts_decorate([
    (0, _common.Get)('/available'),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload
    ]),
    _ts_metadata("design:returntype", Promise)
], WalkController.prototype, "getAvailableDogs", null);
WalkController = _ts_decorate([
    (0, _common.Controller)('/dogs/walks'),
    (0, _common.UsePipes)(new _common.ValidationPipe({
        whitelist: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _walkservice.WalkService === "undefined" ? Object : _walkservice.WalkService,
        typeof _dogsservice.DogsService === "undefined" ? Object : _dogsservice.DogsService
    ])
], WalkController);

//# sourceMappingURL=walk.controller.js.map