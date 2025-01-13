const csiStart = '[\\u001B\\u009B]'; // CSI 시퀀스의 시작
const csiParams = '[[\\]()#;?]*'; // 파라미터 바이트 (0x30–0x3F)
const csiIntermediate = '(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*'; // 중간 바이트들을 포함한 파라미터 (0x20–0x2F)
const csiIntermediate2 = '(?:[-a-zA-Z\\d\\/#&.:=?%@~_]*)';
const csiFinal = '[a-zA-Z\\d]+'; // 파이널 바이트 (0x40–0x7E)
const bellChar = '\\u0007'; // 벨 문자
const csiCombinedPattern = `${csiStart}${csiParams}(?:(?:(?:${csiIntermediate})*|${csiFinal}${csiIntermediate2})?${bellChar})`;

const sgrParam = '\\d{1,4}'; // 1~4자리 숫자
const sgrDelimiter = ';'; // 세미콜론 구분자
const sgrOptionalParams = `(?:${sgrDelimiter}\\d{0,4})*`; // 세미콜론과 0~4자리 숫자로 이루어진 선택적 파라미터
const sgrFinal = '[\\dA-PR-TZcf-nq-uy=><~]'; // 파이널 바이트 (0x40–0x7E 범위 내 특정 문자들)
const sgrCombinedPattern = `(?:(?:${sgrParam}${sgrOptionalParams})?${sgrFinal})`;

// https://github.com/chalk/ansi-regex/blob/main/index.js
function ansiRegex({ onlyFirst = false } = {}): RegExp {
    const pattern = [csiCombinedPattern, sgrCombinedPattern].join('|');

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
