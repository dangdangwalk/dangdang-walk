"use strict";
Object.defineProperty(exports, "DogsModule", {
    enumerable: true,
    get: function() {
        return DogsModule;
    }
});
const _common = require("@nestjs/common");
const _dogscontroller = require("./dogs.controller");
const _dogsentity = require("./dogs.entity");
const _dogsrepository = require("./dogs.repository");
const _dogsservice = require("./dogs.service");
const _breedentity = require("../breed/breed.entity");
const _breedmodule = require("../breed/breed.module");
const _databasemodule = require("../common/database/database.module");
const _dogwalkdayentity = require("../dog-walk-day/dog-walk-day.entity");
const _dogwalkdaymodule = require("../dog-walk-day/dog-walk-day.module");
const _journalsdogsmodule = require("../journals-dogs/journals-dogs.module");
const _todaywalktimeentity = require("../today-walk-time/today-walk-time.entity");
const _todaywalktimemodule = require("../today-walk-time/today-walk-time.module");
const _usersmodule = require("../users/users.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DogsModule = class DogsModule {
};
DogsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _dogsentity.Dogs,
                _breedentity.Breed,
                _dogwalkdayentity.DogWalkDay,
                _todaywalktimeentity.TodayWalkTime
            ]),
            _usersmodule.UsersModule,
            _breedmodule.BreedModule,
            _todaywalktimemodule.TodayWalkTimeModule,
            _dogwalkdaymodule.DogWalkDayModule,
            _journalsdogsmodule.JournalsDogsModule
        ],
        controllers: [
            _dogscontroller.DogsController
        ],
        providers: [
            _dogsservice.DogsService,
            _dogsrepository.DogsRepository
        ],
        exports: [
            _dogsservice.DogsService,
            _usersmodule.UsersModule,
            _journalsdogsmodule.JournalsDogsModule,
            _breedmodule.BreedModule,
            _todaywalktimemodule.TodayWalkTimeModule,
            _dogwalkdaymodule.DogWalkDayModule
        ]
    })
], DogsModule);

//# sourceMappingURL=dogs.module.js.map