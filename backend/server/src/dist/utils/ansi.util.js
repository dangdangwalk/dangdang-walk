// https://github.com/chalk/ansi-regex/blob/main/index.js
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    bold: function() {
        return bold;
    },
    color: function() {
        return color;
    },
    default: function() {
        return stripAnsi;
    },
    italic: function() {
        return italic;
    }
});
function ansiRegex({ onlyFirst = false } = {}) {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
    ].join('|');
    return new RegExp(pattern, onlyFirst ? undefined : 'g');
}
// https://github.com/chalk/strip-ansi/blob/main/index.js
const regex = ansiRegex();
function stripAnsi(text) {
    if (typeof text !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof text}\``);
    }
    return text.replace(regex, '');
}
function bold(text) {
    return `\x1b[1m${text}\x1b[22m`;
}
function italic(text) {
    return `\x1b[3m${text}\x1b[23m`;
}
const colorCodes = {
    Black: '\x1b[30m',
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Yellow: '\x1b[33m',
    Blue: '\x1b[34m',
    Magenta: '\x1b[35m',
    Cyan: '\x1b[36m',
    White: '\x1b[37m'
};
const colorResetCode = '\x1b[0m';
function color(text, color) {
    const colorCode = colorCodes[color];
    return `${colorCode}${text}${colorResetCode}`;
}

//# sourceMappingURL=ansi.util.js.map