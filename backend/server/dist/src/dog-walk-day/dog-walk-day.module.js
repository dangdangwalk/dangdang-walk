"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogWalkDayModule = void 0;
const common_1 = require("@nestjs/common");
const dog_walk_day_entity_1 = require("./dog-walk-day.entity");
const dog_walk_day_repository_1 = require("./dog-walk-day.repository");
const dog_walk_day_service_1 = require("./dog-walk-day.service");
const database_module_1 = require("../common/database/database.module");
let DogWalkDayModule = class DogWalkDayModule {
};
exports.DogWalkDayModule = DogWalkDayModule;
exports.DogWalkDayModule = DogWalkDayModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([dog_walk_day_entity_1.DogWalkDay])],
        providers: [dog_walk_day_service_1.DogWalkDayService, dog_walk_day_repository_1.DogWalkDayRepository],
        exports: [dog_walk_day_service_1.DogWalkDayService],
    })
], DogWalkDayModule);
//# sourceMappingURL=dog-walk-day.module.js.map