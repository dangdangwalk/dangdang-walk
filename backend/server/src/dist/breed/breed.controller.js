"use strict";
Object.defineProperty(exports, "BreedController", {
    enumerable: true,
    get: function() {
        return BreedController;
    }
});
const _common = require("@nestjs/common");
const _breedservice = require("./breed.service");
const _publicdecorator = require("../auth/decorators/public.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BreedController = class BreedController {
    async getBreedData() {
        return this.breedService.getKoreanNames();
    }
    constructor(breedService){
        this.breedService = breedService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _publicdecorator.SkipAuthGuard)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], BreedController.prototype, "getBreedData", null);
BreedController = _ts_decorate([
    (0, _common.Controller)('/breeds'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _breedservice.BreedService === "undefined" ? Object : _breedservice.BreedService
    ])
], BreedController);

//# sourceMappingURL=breed.controller.js.map