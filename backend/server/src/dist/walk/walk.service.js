"use strict";
Object.defineProperty(exports, "WalkService", {
    enumerable: true,
    get: function() {
        return WalkService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _dogsservice = require("../dogs/dogs.service");
const _usersservice = require("../users/users.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const MAX_WALK_TIME = 3;
let WalkService = class WalkService {
    async getAvailableDogs(userId) {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        await this.updateExpiredWalkStatus(ownDogIds);
        return await this.dogsService.getDogsSummaryList({
            id: (0, _typeorm.In)(ownDogIds),
            isWalking: false
        });
    }
    async updateExpiredWalkStatus(dogIds) {
        const dogs = await this.dogsService.find({
            where: {
                id: (0, _typeorm.In)(dogIds)
            },
            select: [
                'id',
                'isWalking',
                'updatedAt'
            ]
        });
        const expiredWalkDogIds = dogs.filter((dog)=>{
            if (!dog.isWalking) return false;
            const expirationTime = dog.updatedAt;
            expirationTime.setHours(expirationTime.getHours() + MAX_WALK_TIME);
            return new Date() >= expirationTime;
        }).map((dog)=>dog.id);
        if (expiredWalkDogIds.length > 0) {
            await this.dogsService.updateIsWalking(expiredWalkDogIds, false);
        }
    }
    constructor(usersService, dogsService){
        this.usersService = usersService;
        this.dogsService = dogsService;
    }
};
WalkService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _dogsservice.DogsService === "undefined" ? Object : _dogsservice.DogsService
    ])
], WalkService);

//# sourceMappingURL=walk.service.js.map