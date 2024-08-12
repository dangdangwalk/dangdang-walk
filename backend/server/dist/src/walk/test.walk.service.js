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
exports.TestWalkService = void 0;
const common_1 = require("@nestjs/common");
const walk_service_1 = require("./walk.service");
const dogs_service_1 = require("../dogs/dogs.service");
const users_service_1 = require("../users/users.service");
let TestWalkService = class TestWalkService extends walk_service_1.WalkService {
    constructor(usersService, dogsService) {
        super(usersService, dogsService);
    }
    async updateExpiredWalkStatus(_dogIds) {
        return Promise.resolve();
    }
};
exports.TestWalkService = TestWalkService;
exports.TestWalkService = TestWalkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, dogs_service_1.DogsService])
], TestWalkService);
//# sourceMappingURL=test.walk.service.js.map