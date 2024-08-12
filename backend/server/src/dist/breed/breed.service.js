"use strict";
Object.defineProperty(exports, "BreedService", {
    enumerable: true,
    get: function() {
        return BreedService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _breedrepository = require("./breed.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BreedService = class BreedService {
    async findOne(where) {
        return this.breedRepository.findOne(where);
    }
    async getKoreanNames() {
        const breeds = await this.breedRepository.find({
            select: [
                'koreanName'
            ]
        });
        if (!breeds.length) {
            throw new _common.NotFoundException(`견종 목록을 찾을 수 없습니다.`);
        }
        return breeds.map((breed)=>breed.koreanName);
    }
    async getRecommendedWalkAmountList(breedIds) {
        const breeds = await this.breedRepository.find({
            where: {
                id: (0, _typeorm.In)(breedIds)
            },
            select: [
                'id',
                'recommendedWalkAmount'
            ]
        });
        if (!breeds.length) {
            throw new _common.NotFoundException(`${breedIds} 해당 견종을 찾을 수 없습니다.`);
        }
        const breedMap = new Map(breeds.map((breed)=>[
                breed.id,
                breed.recommendedWalkAmount
            ]));
        return breedIds.map((breedId)=>{
            const recommendedWalkAmount = breedMap.get(breedId);
            if (!recommendedWalkAmount) {
                throw new _common.NotFoundException(`${breedId}에 대한 권장 산책량을 찾을 수 없습니다.`);
            }
            return recommendedWalkAmount;
        });
    }
    constructor(breedRepository){
        this.breedRepository = breedRepository;
    }
};
BreedService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _breedrepository.BreedRepository === "undefined" ? Object : _breedrepository.BreedRepository
    ])
], BreedService);

//# sourceMappingURL=breed.service.js.map