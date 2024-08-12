"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcrementsModule = void 0;
const common_1 = require("@nestjs/common");
const excrements_entity_1 = require("./excrements.entity");
const excrements_repository_1 = require("./excrements.repository");
const excrements_service_1 = require("./excrements.service");
const database_module_1 = require("../common/database/database.module");
let ExcrementsModule = class ExcrementsModule {
};
exports.ExcrementsModule = ExcrementsModule;
exports.ExcrementsModule = ExcrementsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([excrements_entity_1.Excrements])],
        providers: [excrements_service_1.ExcrementsService, excrements_repository_1.ExcrementsRepository],
        exports: [excrements_service_1.ExcrementsService],
    })
], ExcrementsModule);
//# sourceMappingURL=excrements.module.js.map