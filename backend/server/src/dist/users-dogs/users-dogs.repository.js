"use strict";
Object.defineProperty(exports, "UsersDogsRepository", {
    enumerable: true,
    get: function() {
        return UsersDogsRepository;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _usersdogsentity = require("./users-dogs.entity");
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
let UsersDogsRepository = class UsersDogsRepository extends _abstractrepository.AbstractRepository {
    constructor(usersDogsRepository, entityManager){
        super(usersDogsRepository, entityManager);
    }
};
UsersDogsRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_usersdogsentity.UsersDogs)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.EntityManager === "undefined" ? Object : _typeorm1.EntityManager
    ])
], UsersDogsRepository);

//# sourceMappingURL=users-dogs.repository.js.map