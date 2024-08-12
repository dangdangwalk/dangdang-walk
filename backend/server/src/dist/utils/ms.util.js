// Modified from https://github.com/vercel/ms/blob/main/src/index.ts
// Helpers.
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    parse: function() {
        return parse;
    }
});
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
/**
 * Parse or format the given value.
 *
 * @param value - The string or number to convert
 * @throws Error if `value` is not a non-empty string or a number
 */ function msFn(value) {
    try {
        if (typeof value === 'string') {
            return parse(value);
        }
        throw new Error('인자의 타입이 string 또는 number가 아닙니다');
    } catch (error) {
        const message = isError(error) ? `${error.message}. value=${JSON.stringify(value)}` : '알 수 없는 에러가 발생했습니다';
        throw new Error(message);
    }
}
function parse(str) {
    if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
        throw new Error('Value provided to ms.parse() must be a string with length between 1 and 99.');
    }
    const match = RegExp("^(?<value>-?(?:\\d+)?\\.?\\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$", "i").exec(str);
    // Named capture groups need to be manually typed today.
    // https://github.com/microsoft/TypeScript/issues/32098
    const groups = match === null || match === void 0 ? void 0 : match.groups;
    if (!groups) {
        return NaN;
    }
    const n = parseFloat(groups.value);
    const type = (groups.type || 'ms').toLowerCase();
    switch(type){
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            // This should never occur.
            throw new Error(`The unit ${type} was matched, but no matching case exists.`);
    }
}
const _default = msFn;
/**
 * A type guard for errors.
 *
 * @param value - The value to test
 * @returns A boolean `true` if the provided value is an Error-like object
 */ function isError(value) {
    return typeof value === 'object' && value !== null && 'message' in value;
}

//# sourceMappingURL=ms.util.js.map