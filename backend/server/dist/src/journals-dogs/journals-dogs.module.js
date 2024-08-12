"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalsDogsModule = void 0;
const common_1 = require("@nestjs/common");
const journals_dogs_entity_1 = require("./journals-dogs.entity");
const journals_dogs_repository_1 = require("./journals-dogs.repository");
const journals_dogs_service_1 = require("./journals-dogs.service");
const database_module_1 = require("../common/database/database.module");
let JournalsDogsModule = class JournalsDogsModule {
};
exports.JournalsDogsModule = JournalsDogsModule;
exports.JournalsDogsModule = JournalsDogsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([journals_dogs_entity_1.JournalsDogs])],
        providers: [journals_dogs_service_1.JournalsDogsService, journals_dogs_repository_1.JournalsDogsRepository],
        exports: [journals_dogs_service_1.JournalsDogsService],
    })
], JournalsDogsModule);
//# sourceMappingURL=journals-dogs.module.js.map