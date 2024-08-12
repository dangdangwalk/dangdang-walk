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
exports.ExcrementsRepository = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const excrements_entity_1 = require("./excrements.entity");
const abstract_repository_1 = require("../common/database/abstract.repository");
let ExcrementsRepository = class ExcrementsRepository extends abstract_repository_1.AbstractRepository {
    constructor(excrementsRepository, entityManager) {
        super(excrementsRepository, entityManager);
    }
};
exports.ExcrementsRepository = ExcrementsRepository;
exports.ExcrementsRepository = ExcrementsRepository = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(excrements_entity_1.Excrements)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.EntityManager])
], ExcrementsRepository);
//# sourceMappingURL=excrements.repository.js.map