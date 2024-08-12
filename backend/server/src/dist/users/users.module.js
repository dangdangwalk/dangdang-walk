"use strict";
Object.defineProperty(exports, "UsersModule", {
    enumerable: true,
    get: function() {
        return UsersModule;
    }
});
const _common = require("@nestjs/common");
const _userscontroller = require("./users.controller");
const _usersentity = require("./users.entity");
const _usersrepository = require("./users.repository");
const _usersservice = require("./users.service");
const _databasemodule = require("../common/database/database.module");
const _s3module = require("../s3/s3.module");
const _usersdogsentity = require("../users-dogs/users-dogs.entity");
const _usersdogsmodule = require("../users-dogs/users-dogs.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UsersModule = class UsersModule {
};
UsersModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule.forFeature([
                _usersentity.Users,
                _usersdogsentity.UsersDogs
            ]),
            _usersdogsmodule.UsersDogsModule,
            _s3module.S3Module
        ],
        controllers: [
            _userscontroller.UsersController
        ],
        providers: [
            _usersservice.UsersService,
            _usersrepository.UsersRepository
        ],
        exports: [
            _usersservice.UsersService,
            _usersdogsmodule.UsersDogsModule,
            _s3module.S3Module
        ]
    })
], UsersModule);

//# sourceMappingURL=users.module.js.map