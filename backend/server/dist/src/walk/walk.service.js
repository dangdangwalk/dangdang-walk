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
exports.WalkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const dogs_service_1 = require("../dogs/dogs.service");
const users_service_1 = require("../users/users.service");
const MAX_WALK_TIME = 3;
let WalkService = class WalkService {
    constructor(usersService, dogsService) {
        this.usersService = usersService;
        this.dogsService = dogsService;
    }
    async getAvailableDogs(userId) {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        await this.updateExpiredWalkStatus(ownDogIds);
        return await this.dogsService.getDogsSummaryList({ id: (0, typeorm_1.In)(ownDogIds), isWalking: false });
    }
    async updateExpiredWalkStatus(dogIds) {
        const dogs = await this.dogsService.find({
            where: { id: (0, typeorm_1.In)(dogIds) },
            select: ['id', 'isWalking', 'updatedAt'],
        });
        const expiredWalkDogIds = dogs
            .filter((dog) => {
            if (!dog.isWalking)
                return false;
            const expirationTime = dog.updatedAt;
            expirationTime.setHours(expirationTime.getHours() + MAX_WALK_TIME);
            return new Date() >= expirationTime;
        })
            .map((dog) => dog.id);
        if (expiredWalkDogIds.length > 0) {
            await this.dogsService.updateIsWalking(expiredWalkDogIds, false);
        }
    }
};
exports.WalkService = WalkService;
exports.WalkService = WalkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        dogs_service_1.DogsService])
], WalkService);
//# sourceMappingURL=walk.service.js.map