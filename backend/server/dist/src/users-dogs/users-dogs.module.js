"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersDogsModule = void 0;
const common_1 = require("@nestjs/common");
const users_dogs_entity_1 = require("./users-dogs.entity");
const users_dogs_repository_1 = require("./users-dogs.repository");
const users_dogs_service_1 = require("./users-dogs.service");
const database_module_1 = require("../common/database/database.module");
let UsersDogsModule = class UsersDogsModule {
};
exports.UsersDogsModule = UsersDogsModule;
exports.UsersDogsModule = UsersDogsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([users_dogs_entity_1.UsersDogs])],
        providers: [users_dogs_service_1.UsersDogsService, users_dogs_repository_1.UsersDogsRepository],
        exports: [users_dogs_service_1.UsersDogsService],
    })
], UsersDogsModule);
//# sourceMappingURL=users-dogs.module.js.map