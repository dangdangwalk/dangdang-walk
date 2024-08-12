"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodayWalkTimeModule = void 0;
const common_1 = require("@nestjs/common");
const today_walk_time_entity_1 = require("./today-walk-time.entity");
const today_walk_time_repository_1 = require("./today-walk-time.repository");
const today_walk_time_service_1 = require("./today-walk-time.service");
const database_module_1 = require("../common/database/database.module");
let TodayWalkTimeModule = class TodayWalkTimeModule {
};
exports.TodayWalkTimeModule = TodayWalkTimeModule;
exports.TodayWalkTimeModule = TodayWalkTimeModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([today_walk_time_entity_1.TodayWalkTime])],
        providers: [today_walk_time_service_1.TodayWalkTimeService, today_walk_time_repository_1.TodayWalkTimeRepository],
        exports: [today_walk_time_service_1.TodayWalkTimeService],
    })
], TodayWalkTimeModule);
//# sourceMappingURL=today-walk-time.module.js.map