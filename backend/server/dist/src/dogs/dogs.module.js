"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogsModule = void 0;
const common_1 = require("@nestjs/common");
const dogs_controller_1 = require("./dogs.controller");
const dogs_entity_1 = require("./dogs.entity");
const dogs_repository_1 = require("./dogs.repository");
const dogs_service_1 = require("./dogs.service");
const breed_entity_1 = require("../breed/breed.entity");
const breed_module_1 = require("../breed/breed.module");
const database_module_1 = require("../common/database/database.module");
const dog_walk_day_entity_1 = require("../dog-walk-day/dog-walk-day.entity");
const dog_walk_day_module_1 = require("../dog-walk-day/dog-walk-day.module");
const journals_dogs_module_1 = require("../journals-dogs/journals-dogs.module");
const today_walk_time_entity_1 = require("../today-walk-time/today-walk-time.entity");
const today_walk_time_module_1 = require("../today-walk-time/today-walk-time.module");
const users_module_1 = require("../users/users.module");
let DogsModule = class DogsModule {
};
exports.DogsModule = DogsModule;
exports.DogsModule = DogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule.forFeature([dogs_entity_1.Dogs, breed_entity_1.Breed, dog_walk_day_entity_1.DogWalkDay, today_walk_time_entity_1.TodayWalkTime]),
            users_module_1.UsersModule,
            breed_module_1.BreedModule,
            today_walk_time_module_1.TodayWalkTimeModule,
            dog_walk_day_module_1.DogWalkDayModule,
            journals_dogs_module_1.JournalsDogsModule,
        ],
        controllers: [dogs_controller_1.DogsController],
        providers: [dogs_service_1.DogsService, dogs_repository_1.DogsRepository],
        exports: [dogs_service_1.DogsService, users_module_1.UsersModule, journals_dogs_module_1.JournalsDogsModule, breed_module_1.BreedModule, today_walk_time_module_1.TodayWalkTimeModule, dog_walk_day_module_1.DogWalkDayModule],
    })
], DogsModule);
//# sourceMappingURL=dogs.module.js.map