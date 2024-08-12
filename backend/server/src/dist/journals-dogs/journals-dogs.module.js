"use strict";
Object.defineProperty(exports, "JournalsDogsModule", {
    enumerable: true,
    get: function() {
        return JournalsDogsModule;
    }
});
const _common = require("@nestjs/common");
const _journalsdogsentity = require("./journals-dogs.entity");
const _journalsdogsrepository = require("./journals-dogs.repository");
const _journalsdogsservice = require("./journals-dogs.service");
const _databasemodule = require("../common/database/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let JournalsDogsModule = class JournalsDogsModule {
};
JournalsDogsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _journalsdogsentity.JournalsDogs
            ])
        ],
        providers: [
            _journalsdogsservice.JournalsDogsService,
            _journalsdogsrepository.JournalsDogsRepository
        ],
        exports: [
            _journalsdogsservice.JournalsDogsService
        ]
    })
], JournalsDogsModule);

//# sourceMappingURL=journals-dogs.module.js.map