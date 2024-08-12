"use strict";
Object.defineProperty(exports, "generateUuid", {
    enumerable: true,
    get: function() {
        return generateUuid;
    }
});
const _uuid = require("uuid");
function generateUuid() {
    return (0, _uuid.v4)();
}

//# sourceMappingURL=hash.util.js.map