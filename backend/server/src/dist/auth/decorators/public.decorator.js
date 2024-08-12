"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    SKIP: function() {
        return SKIP;
    },
    SkipAuthGuard: function() {
        return SkipAuthGuard;
    }
});
const _common = require("@nestjs/common");
const SKIP = 'skipAuthGuard';
const SkipAuthGuard = ()=>(0, _common.SetMetadata)(SKIP, true);

//# sourceMappingURL=public.decorator.js.map