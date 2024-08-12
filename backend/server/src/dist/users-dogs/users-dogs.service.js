"use strict";
Object.defineProperty(exports, "UsersDogsService", {
    enumerable: true,
    get: function() {
        return UsersDogsService;
    }
});
const _common = require("@nestjs/common");
const _usersdogsentity = require("./users-dogs.entity");
const _usersdogsrepository = require("./users-dogs.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UsersDogsService = class UsersDogsService {
    async create(entityData) {
        const userDog = new _usersdogsentity.UsersDogs(entityData);
        return await this.usersDogsRepository.create(userDog);
    }
    async find(where) {
        return await this.usersDogsRepository.find(where);
    }
    constructor(usersDogsRepository){
        this.usersDogsRepository = usersDogsRepository;
    }
};
UsersDogsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersdogsrepository.UsersDogsRepository === "undefined" ? Object : _usersdogsrepository.UsersDogsRepository
    ])
], UsersDogsService);

//# sourceMappingURL=users-dogs.service.js.map