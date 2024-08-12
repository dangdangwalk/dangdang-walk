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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkController = void 0;
const common_1 = require("@nestjs/common");
const auth_dogs_guard_1 = require("./guards/auth-dogs.guard");
const walk_service_1 = require("./walk.service");
const dogs_service_1 = require("../dogs/dogs.service");
const user_decorator_1 = require("../users/decorators/user.decorator");
let WalkController = class WalkController {
    constructor(walkService, dogsService) {
        this.walkService = walkService;
        this.dogsService = dogsService;
    }
    async startWalk(dogIds) {
        return this.dogsService.updateIsWalking(dogIds, true);
    }
    async stopWalk(dogIds) {
        return this.dogsService.updateIsWalking(dogIds, false);
    }
    async getAvailableDogs({ userId }) {
        return this.walkService.getAvailableDogs(userId);
    }
};
exports.WalkController = WalkController;
__decorate([
    (0, common_1.Post)('/start'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(auth_dogs_guard_1.AuthDogsGuard),
    __param(0, (0, common_1.Body)(new common_1.ParseArrayPipe({ items: Number, separator: ',' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], WalkController.prototype, "startWalk", null);
__decorate([
    (0, common_1.Post)('/stop'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(auth_dogs_guard_1.AuthDogsGuard),
    __param(0, (0, common_1.Body)(new common_1.ParseArrayPipe({ items: Number, separator: ',' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], WalkController.prototype, "stopWalk", null);
__decorate([
    (0, common_1.Get)('/available'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalkController.prototype, "getAvailableDogs", null);
exports.WalkController = WalkController = __decorate([
    (0, common_1.Controller)('/dogs/walks'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __metadata("design:paramtypes", [walk_service_1.WalkService,
        dogs_service_1.DogsService])
], WalkController);
//# sourceMappingURL=walk.controller.js.map