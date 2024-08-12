"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_entity_1 = require("./users.entity");
const users_repository_1 = require("./users.repository");
const users_service_1 = require("./users.service");
const database_module_1 = require("../common/database/database.module");
const s3_module_1 = require("../s3/s3.module");
const users_dogs_entity_1 = require("../users-dogs/users-dogs.entity");
const users_dogs_module_1 = require("../users-dogs/users-dogs.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([users_entity_1.Users, users_dogs_entity_1.UsersDogs]), users_dogs_module_1.UsersDogsModule, s3_module_1.S3Module],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, users_repository_1.UsersRepository],
        exports: [users_service_1.UsersService, users_dogs_module_1.UsersDogsModule, s3_module_1.S3Module],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map