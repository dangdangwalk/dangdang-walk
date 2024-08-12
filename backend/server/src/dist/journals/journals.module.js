"use strict";
Object.defineProperty(exports, "JournalsModule", {
    enumerable: true,
    get: function() {
        return JournalsModule;
    }
});
const _common = require("@nestjs/common");
const _journalscontroller = require("./journals.controller");
const _journalsentity = require("./journals.entity");
const _journalsrepository = require("./journals.repository");
const _journalsservice = require("./journals.service");
const _databasemodule = require("../common/database/database.module");
const _dogsmodule = require("../dogs/dogs.module");
const _excrementsentity = require("../excrements/excrements.entity");
const _excrementsmodule = require("../excrements/excrements.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let JournalsModule = class JournalsModule {
};
JournalsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _journalsentity.Journals,
                _excrementsentity.Excrements
            ]),
            _dogsmodule.DogsModule,
            _excrementsmodule.ExcrementsModule
        ],
        controllers: [
            _journalscontroller.JournalsController
        ],
        providers: [
            _journalsservice.JournalsService,
            _journalsrepository.JournalsRepository
        ],
        exports: [
            _journalsservice.JournalsService,
            _dogsmodule.DogsModule
        ]
    })
], JournalsModule);

//# sourceMappingURL=journals.module.js.map