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
exports.BreedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const breed_repository_1 = require("./breed.repository");
let BreedService = class BreedService {
    constructor(breedRepository) {
        this.breedRepository = breedRepository;
    }
    async findOne(where) {
        return this.breedRepository.findOne(where);
    }
    async getKoreanNames() {
        const breeds = await this.breedRepository.find({ select: ['koreanName'] });
        if (!breeds.length) {
            throw new common_1.NotFoundException(`견종 목록을 찾을 수 없습니다.`);
        }
        return breeds.map((breed) => breed.koreanName);
    }
    async getRecommendedWalkAmountList(breedIds) {
        const breeds = await this.breedRepository.find({
            where: { id: (0, typeorm_1.In)(breedIds) },
            select: ['id', 'recommendedWalkAmount'],
        });
        if (!breeds.length) {
            throw new common_1.NotFoundException(`${breedIds} 해당 견종을 찾을 수 없습니다.`);
        }
        const breedMap = new Map(breeds.map((breed) => [breed.id, breed.recommendedWalkAmount]));
        return breedIds.map((breedId) => {
            const recommendedWalkAmount = breedMap.get(breedId);
            if (!recommendedWalkAmount) {
                throw new common_1.NotFoundException(`${breedId}에 대한 권장 산책량을 찾을 수 없습니다.`);
            }
            return recommendedWalkAmount;
        });
    }
};
exports.BreedService = BreedService;
exports.BreedService = BreedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [breed_repository_1.BreedRepository])
], BreedService);
//# sourceMappingURL=breed.service.js.map