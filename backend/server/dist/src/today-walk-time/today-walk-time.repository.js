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
exports.TodayWalkTimeRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const today_walk_time_entity_1 = require("./today-walk-time.entity");
const abstract_repository_1 = require("../common/database/abstract.repository");
let TodayWalkTimeRepository = class TodayWalkTimeRepository extends abstract_repository_1.AbstractRepository {
    constructor(todayWalkTimeRepository, entityManager) {
        super(todayWalkTimeRepository, entityManager);
    }
};
exports.TodayWalkTimeRepository = TodayWalkTimeRepository;
exports.TodayWalkTimeRepository = TodayWalkTimeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(today_walk_time_entity_1.TodayWalkTime)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.EntityManager])
], TodayWalkTimeRepository);
//# sourceMappingURL=today-walk-time.repository.js.map