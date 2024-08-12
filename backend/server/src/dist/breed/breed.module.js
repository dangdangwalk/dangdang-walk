"use strict";
Object.defineProperty(exports, "BreedModule", {
    enumerable: true,
    get: function() {
        return BreedModule;
    }
});
const _common = require("@nestjs/common");
const _breedcontroller = require("./breed.controller");
const _breedentity = require("./breed.entity");
const _breedrepository = require("./breed.repository");
const _breedservice = require("./breed.service");
const _databasemodule = require("../common/database/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BreedModule = class BreedModule {
};
BreedModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _breedentity.Breed
            ])
        ],
        controllers: [
            _breedcontroller.BreedController
        ],
        providers: [
            _breedservice.BreedService,
            _breedrepository.BreedRepository
        ],
        exports: [
            _breedservice.BreedService
        ]
    })
], BreedModule);

//# sourceMappingURL=breed.module.js.map