"use strict";
Object.defineProperty(exports, "TestWalkService", {
    enumerable: true,
    get: function() {
        return TestWalkService;
    }
});
const _common = require("@nestjs/common");
const _walkservice = require("./walk.service");
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
let TestWalkService = class TestWalkService extends _walkservice.WalkService {
    async updateExpiredWalkStatus(_dogIds) {
        return Promise.resolve();
    }
    constructor(usersService, dogsService){
        super(usersService, dogsService);
    }
};
TestWalkService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _dogsservice.DogsService === "undefined" ? Object : _dogsservice.DogsService
    ])
], TestWalkService);

//# sourceMappingURL=test.walk.service.js.map