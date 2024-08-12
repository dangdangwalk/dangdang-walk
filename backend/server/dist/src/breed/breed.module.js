"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreedModule = void 0;
const common_1 = require("@nestjs/common");
const breed_controller_1 = require("./breed.controller");
const breed_entity_1 = require("./breed.entity");
const breed_repository_1 = require("./breed.repository");
const breed_service_1 = require("./breed.service");
const database_module_1 = require("../common/database/database.module");
let BreedModule = class BreedModule {
};
exports.BreedModule = BreedModule;
exports.BreedModule = BreedModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([breed_entity_1.Breed])],
        controllers: [breed_controller_1.BreedController],
        providers: [breed_service_1.BreedService, breed_repository_1.BreedRepository],
        exports: [breed_service_1.BreedService],
    })
], BreedModule);
//# sourceMappingURL=breed.module.js.map