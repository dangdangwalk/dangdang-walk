"use strict";
Object.defineProperty(exports, "UsersDogsModule", {
    enumerable: true,
    get: function() {
        return UsersDogsModule;
    }
});
const _common = require("@nestjs/common");
const _usersdogsentity = require("./users-dogs.entity");
const _usersdogsrepository = require("./users-dogs.repository");
const _usersdogsservice = require("./users-dogs.service");
const _databasemodule = require("../common/database/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UsersDogsModule = class UsersDogsModule {
};
UsersDogsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _usersdogsentity.UsersDogs
            ])
        ],
        providers: [
            _usersdogsservice.UsersDogsService,
            _usersdogsrepository.UsersDogsRepository
        ],
        exports: [
            _usersdogsservice.UsersDogsService
        ]
    })
], UsersDogsModule);

//# sourceMappingURL=users-dogs.module.js.map