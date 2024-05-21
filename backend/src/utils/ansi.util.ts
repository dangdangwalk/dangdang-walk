// https://github.com/chalk/ansi-regex/blob/main/index.js
function ansiRegex({ onlyFirst = false } = {}): RegExp {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
    ].join('|');

    return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

// https://github.com/chalk/strip-ansi/blob/main/index.js
const regex = ansiRegex();

export default function stripAnsi(text: string): string {
    if (typeof text !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof text}\``);
    }

    return text.replace(regex, '');
}

export function bold(text: string) {
    return `\x1b[1m${text}\x1b[22m`;
}

export function italic(text: string) {
    return `\x1b[3m${text}\x1b[23m`;
}

export type Color = 'Black' | 'Red' | 'Green' | 'Yellow' | 'Blue' | 'Magenta' | 'Cyan' | 'White';
type ColorCodes = Record<Color, string>;

const colorCodes: ColorCodes = {
    Black: '\x1b[30m',
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Yellow: '\x1b[33m',
    Blue: '\x1b[34m',
    Magenta: '\x1b[35m',
    Cyan: '\x1b[36m',
    White: '\x1b[37m',
};

const colorResetCode = '\x1b[0m';

export function color(text: string, color: Color): string {
    const colorCode = colorCodes[color];
    return `${colorCode}${text}${colorResetCode}`;
}
