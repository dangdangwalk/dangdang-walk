"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreedController = void 0;
const common_1 = require("@nestjs/common");
const breed_service_1 = require("./breed.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let BreedController = class BreedController {
    constructor(breedService) {
        this.breedService = breedService;
    }
    async getBreedData() {
        return this.breedService.getKoreanNames();
    }
};
exports.BreedController = BreedController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.SkipAuthGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BreedController.prototype, "getBreedData", null);
exports.BreedController = BreedController = __decorate([
    (0, common_1.Controller)('/breeds'),
    __metadata("design:paramtypes", [breed_service_1.BreedService])
], BreedController);
//# sourceMappingURL=breed.controller.js.map