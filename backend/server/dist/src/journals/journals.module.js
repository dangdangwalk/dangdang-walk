"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalsModule = void 0;
const common_1 = require("@nestjs/common");
const journals_controller_1 = require("./journals.controller");
const journals_entity_1 = require("./journals.entity");
const journals_repository_1 = require("./journals.repository");
const journals_service_1 = require("./journals.service");
const database_module_1 = require("../common/database/database.module");
const dogs_module_1 = require("../dogs/dogs.module");
const excrements_entity_1 = require("../excrements/excrements.entity");
const excrements_module_1 = require("../excrements/excrements.module");
let JournalsModule = class JournalsModule {
};
exports.JournalsModule = JournalsModule;
exports.JournalsModule = JournalsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([journals_entity_1.Journals, excrements_entity_1.Excrements]), dogs_module_1.DogsModule, excrements_module_1.ExcrementsModule],
        controllers: [journals_controller_1.JournalsController],
        providers: [journals_service_1.JournalsService, journals_repository_1.JournalsRepository],
        exports: [journals_service_1.JournalsService, dogs_module_1.DogsModule],
    })
], JournalsModule);
//# sourceMappingURL=journals.module.js.map