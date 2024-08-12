"use strict";
Object.defineProperty(exports, "DogWalkDayModule", {
    enumerable: true,
    get: function() {
        return DogWalkDayModule;
    }
});
const _common = require("@nestjs/common");
const _dogwalkdayentity = require("./dog-walk-day.entity");
const _dogwalkdayrepository = require("./dog-walk-day.repository");
const _dogwalkdayservice = require("./dog-walk-day.service");
const _databasemodule = require("../common/database/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DogWalkDayModule = class DogWalkDayModule {
};
DogWalkDayModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _dogwalkdayentity.DogWalkDay
            ])
        ],
        providers: [
            _dogwalkdayservice.DogWalkDayService,
            _dogwalkdayrepository.DogWalkDayRepository
        ],
        exports: [
            _dogwalkdayservice.DogWalkDayService
        ]
    })
], DogWalkDayModule);

//# sourceMappingURL=dog-walk-day.module.js.map