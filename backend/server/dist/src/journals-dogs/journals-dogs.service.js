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
exports.JournalsDogsService = void 0;
const common_1 = require("@nestjs/common");
const journals_dogs_entity_1 = require("./journals-dogs.entity");
const journals_dogs_repository_1 = require("./journals-dogs.repository");
let JournalsDogsService = class JournalsDogsService {
    constructor(journalsDogsRepository) {
        this.journalsDogsRepository = journalsDogsRepository;
    }
    async createIfNotExists(journalId, dogId) {
        const newEntity = new journals_dogs_entity_1.JournalsDogs({ journalId, dogId });
        return await this.journalsDogsRepository.createIfNotExists(newEntity, ['journalId', 'dogId']);
    }
    async find(where) {
        return await this.journalsDogsRepository.find(where);
    }
    makeDogData(journalId, dogIds) {
        return dogIds.map((curId) => ({
            journalId: journalId,
            dogId: curId,
        }));
    }
    async insert(entity) {
        return await this.journalsDogsRepository.insert(entity);
    }
    async createJournalDogs(journalId, dogIds) {
        const journalDogsData = this.makeDogData(journalId, dogIds);
        return await this.insert(journalDogsData);
    }
    async getDogIdsByJournalId(journalId) {
        const findResult = await this.journalsDogsRepository.find({ where: { journalId } });
        return findResult.map((cur) => cur.dogId);
    }
};
exports.JournalsDogsService = JournalsDogsService;
exports.JournalsDogsService = JournalsDogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [journals_dogs_repository_1.JournalsDogsRepository])
], JournalsDogsService);
//# sourceMappingURL=journals-dogs.service.js.map