"use strict";
Object.defineProperty(exports, "isTypedArray", {
    enumerable: true,
    get: function() {
        return isTypedArray;
    }
});
function isTypedArray(target, type) {
    return Boolean(Array.isArray(target) && target.every((t)=>typeof t === type));
}

//# sourceMappingURL=validator.util.js.map