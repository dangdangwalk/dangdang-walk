"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypedArray = void 0;
function isTypedArray(target, type) {
    return Boolean(Array.isArray(target) && target.every((t) => typeof t === type));
}
exports.isTypedArray = isTypedArray;
//# sourceMappingURL=validator.util.js.map