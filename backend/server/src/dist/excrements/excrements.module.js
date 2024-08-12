"use strict";
Object.defineProperty(exports, "ExcrementsModule", {
    enumerable: true,
    get: function() {
        return ExcrementsModule;
    }
});
const _common = require("@nestjs/common");
const _excrementsentity = require("./excrements.entity");
const _excrementsrepository = require("./excrements.repository");
const _excrementsservice = require("./excrements.service");
const _databasemodule = require("../common/database/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExcrementsModule = class ExcrementsModule {
};
ExcrementsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _excrementsentity.Excrements
            ])
        ],
        providers: [
            _excrementsservice.ExcrementsService,
            _excrementsrepository.ExcrementsRepository
        ],
        exports: [
            _excrementsservice.ExcrementsService
        ]
    })
], ExcrementsModule);

//# sourceMappingURL=excrements.module.js.map