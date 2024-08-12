"use strict";
Object.defineProperty(exports, "TodayWalkTimeModule", {
    enumerable: true,
    get: function() {
        return TodayWalkTimeModule;
    }
});
const _common = require("@nestjs/common");
const _todaywalktimeentity = require("./today-walk-time.entity");
const _todaywalktimerepository = require("./today-walk-time.repository");
const _todaywalktimeservice = require("./today-walk-time.service");
const _databasemodule = require("../common/database/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TodayWalkTimeModule = class TodayWalkTimeModule {
};
TodayWalkTimeModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _todaywalktimeentity.TodayWalkTime
            ])
        ],
        providers: [
            _todaywalktimeservice.TodayWalkTimeService,
            _todaywalktimerepository.TodayWalkTimeRepository
        ],
        exports: [
            _todaywalktimeservice.TodayWalkTimeService
        ]
    })
], TodayWalkTimeModule);

//# sourceMappingURL=today-walk-time.module.js.map