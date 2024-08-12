"use strict";
Object.defineProperty(exports, "WalkModule", {
    enumerable: true,
    get: function() {
        return WalkModule;
    }
});
const _common = require("@nestjs/common");
const _walkcontroller = require("./walk.controller");
const _walkservice = require("./walk.service");
const _journalsmodule = require("../journals/journals.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WalkModule = class WalkModule {
};
WalkModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _journalsmodule.JournalsModule
        ],
        controllers: [
            _walkcontroller.WalkController
        ],
        providers: [
            _walkservice.WalkService
        ]
    })
], WalkModule);

//# sourceMappingURL=walk.module.js.map