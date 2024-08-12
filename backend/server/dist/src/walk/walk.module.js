"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkModule = void 0;
const common_1 = require("@nestjs/common");
const walk_controller_1 = require("./walk.controller");
const walk_service_1 = require("./walk.service");
const journals_module_1 = require("../journals/journals.module");
let WalkModule = class WalkModule {
};
exports.WalkModule = WalkModule;
exports.WalkModule = WalkModule = __decorate([
    (0, common_1.Module)({
        imports: [journals_module_1.JournalsModule],
        controllers: [walk_controller_1.WalkController],
        providers: [walk_service_1.WalkService],
    })
], WalkModule);
//# sourceMappingURL=walk.module.js.map