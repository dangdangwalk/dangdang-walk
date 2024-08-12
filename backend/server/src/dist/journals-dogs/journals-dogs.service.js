"use strict";
Object.defineProperty(exports, "JournalsDogsService", {
    enumerable: true,
    get: function() {
        return JournalsDogsService;
    }
});
const _common = require("@nestjs/common");
const _journalsdogsentity = require("./journals-dogs.entity");
const _journalsdogsrepository = require("./journals-dogs.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JournalsDogsService = class JournalsDogsService {
    async createIfNotExists(journalId, dogId) {
        const newEntity = new _journalsdogsentity.JournalsDogs({
            journalId,
            dogId
        });
        return await this.journalsDogsRepository.createIfNotExists(newEntity, [
            'journalId',
            'dogId'
        ]);
    }
    async find(where) {
        return await this.journalsDogsRepository.find(where);
    }
    makeDogData(journalId, dogIds) {
        return dogIds.map((curId)=>({
                journalId: journalId,
                dogId: curId
            }));
    }
    async insert(entity) {
        return await this.journalsDogsRepository.insert(entity);
    }
    async createJournalDogs(journalId, dogIds) {
        const journalDogsData = this.makeDogData(journalId, dogIds);
        return await this.insert(journalDogsData);
    }
    //TODO: map 안쓰게 select 사용
    async getDogIdsByJournalId(journalId) {
        const findResult = await this.journalsDogsRepository.find({
            where: {
                journalId
            }
        });
        return findResult.map((cur)=>cur.dogId);
    }
    constructor(journalsDogsRepository){
        this.journalsDogsRepository = journalsDogsRepository;
    }
};
JournalsDogsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _journalsdogsrepository.JournalsDogsRepository === "undefined" ? Object : _journalsdogsrepository.JournalsDogsRepository
    ])
], JournalsDogsService);

//# sourceMappingURL=journals-dogs.service.js.map