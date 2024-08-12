"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipAuthGuard = exports.SKIP = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP = 'skipAuthGuard';
const SkipAuthGuard = () => (0, common_1.SetMetadata)(exports.SKIP, true);
exports.SkipAuthGuard = SkipAuthGuard;
//# sourceMappingURL=public.decorator.js.map