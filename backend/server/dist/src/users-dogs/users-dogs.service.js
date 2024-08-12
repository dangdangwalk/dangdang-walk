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
exports.UsersDogsService = void 0;
const common_1 = require("@nestjs/common");
const users_dogs_entity_1 = require("./users-dogs.entity");
const users_dogs_repository_1 = require("./users-dogs.repository");
let UsersDogsService = class UsersDogsService {
    constructor(usersDogsRepository) {
        this.usersDogsRepository = usersDogsRepository;
    }
    async create(entityData) {
        const userDog = new users_dogs_entity_1.UsersDogs(entityData);
        return await this.usersDogsRepository.create(userDog);
    }
    async find(where) {
        return await this.usersDogsRepository.find(where);
    }
};
exports.UsersDogsService = UsersDogsService;
exports.UsersDogsService = UsersDogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_dogs_repository_1.UsersDogsRepository])
], UsersDogsService);
//# sourceMappingURL=users-dogs.service.js.map