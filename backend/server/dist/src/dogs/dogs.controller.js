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
exports.DogsController = void 0;
const common_1 = require("@nestjs/common");
const dogs_service_1 = require("./dogs.service");
const create_dog_dto_1 = require("./dtos/create-dog.dto");
const update_dog_dto_1 = require("./dtos/update-dog.dto");
const auth_dog_guard_1 = require("./guards/auth-dog.guard");
const user_decorator_1 = require("../users/decorators/user.decorator");
let DogsController = class DogsController {
    constructor(dogsService) {
        this.dogsService = dogsService;
    }
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
};
exports.DogsController = DogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DogsController.prototype, "getProfileList", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_dog_dto_1.CreateDogDto]),
    __metadata("design:returntype", Promise)
], DogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/:id(\\d+)'),
    (0, common_1.UseGuards)(auth_dog_guard_1.AuthDogGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DogsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('/:id(\\d+)'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(auth_dog_guard_1.AuthDogGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_dog_dto_1.UpdateDogDto]),
    __metadata("design:returntype", Promise)
], DogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:id(\\d+)'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(auth_dog_guard_1.AuthDogGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DogsController.prototype, "delete", null);
exports.DogsController = DogsController = __decorate([
    (0, common_1.Controller)('/dogs'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ validateCustomDecorators: true, whitelist: true })),
    __metadata("design:paramtypes", [dogs_service_1.DogsService])
], DogsController);
//# sourceMappingURL=dogs.controller.js.map