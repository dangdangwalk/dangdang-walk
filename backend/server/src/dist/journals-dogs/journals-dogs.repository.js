"use strict";
Object.defineProperty(exports, "JournalsDogsRepository", {
    enumerable: true,
    get: function() {
        return JournalsDogsRepository;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _journalsdogsentity = require("./journals-dogs.entity");
const _abstractrepository = require("../common/database/abstract.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let JournalsDogsRepository = class JournalsDogsRepository extends _abstractrepository.AbstractRepository {
    constructor(journalsDogsRepository, entityManager){
        super(journalsDogsRepository, entityManager);
    }
};
JournalsDogsRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_journalsdogsentity.JournalsDogs)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.EntityManager === "undefined" ? Object : _typeorm1.EntityManager
    ])
], JournalsDogsRepository);

//# sourceMappingURL=journals-dogs.repository.js.map