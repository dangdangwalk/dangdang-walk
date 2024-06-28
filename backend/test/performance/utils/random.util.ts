// Modified from https://github.com/faker-js/faker

// eslint-disable-next-line @typescript-eslint/no-var-requires
const seedrandom = require('seedrandom');

const randomNumberGenerator = seedrandom(process.env.SEED ?? 'dangdangwalk');

export function getRandomInt(
    options:
        | number
        | {
              min?: number; // default 0
              max?: number; // default Number.MAX_SAFE_INTEGER
          } = {},
): number {
    if (typeof options === 'number') {
        options = { max: options };
    }

    const { min = 0, max = Number.MAX_SAFE_INTEGER } = options;
    const effectiveMin = Math.ceil(min);
    const effectiveMax = Math.floor(max);

    if (effectiveMin === effectiveMax) {
        return effectiveMin;
    }

    if (effectiveMax < effectiveMin) {
        if (max >= min) {
            throw new Error(`No integer value between ${min} and ${max} found.`);
        }

        throw new Error(`Max ${max} should be greater than min ${min}.`);
    }

    return Math.floor(randomNumberGenerator() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
}

export function getRandomPastDate(
    options:
        | number
        | {
              days?: number; // default 0
              refDate?: string | Date | number; // default new Date()
          } = {},
): Date {
    if (typeof options === 'number') {
        options = { days: options };
    }

    const { days = 1, refDate = new Date() } = options;

    if (days <= 0) {
        throw new Error('Days must be greater than 0.');
    }

    const date = new Date(refDate);
    const range = {
        min: 1000,
        max: days * 24 * 3600 * 1000,
    };

    let future = date.getTime();
    future -= getRandomInt(range); // some time from now to N days ago, in milliseconds
    date.setTime(future);

    return date;
}

function shuffle<T>(list: T[], options: { inplace?: boolean } = {}): T[] {
    const { inplace = false } = options;

    if (!inplace) {
        list = [...list];
    }

    for (let i = list.length - 1; i > 0; --i) {
        const j = getRandomInt(i);
        [list[i], list[j]] = [list[j], list[i]];
    }

    return list;
}

export function getRandomElements<T>(
    array: ReadonlyArray<T>,
    count?:
        | number
        | {
              min: number; // default 1
              max: number; // default array.length
          },
): T[] {
    if (array == null) {
        throw new Error('No array given.');
    }

    if (array.length === 0) {
        return [];
    }

    const numElements = getRandomInt(count ?? { min: 1, max: array.length });

    const arrayCopy = [...array];

    if (numElements >= array.length) {
        return shuffle(arrayCopy);
    } else if (numElements <= 0) {
        return [];
    }

    let i = array.length;
    const min = i - numElements;
    let temp: T;
    let index: number;

    // Shuffle the last `count` elements of the array
    while (i-- > min) {
        index = getRandomInt(i);
        temp = arrayCopy[index];
        arrayCopy[index] = arrayCopy[i];
        arrayCopy[i] = temp;
    }

    return arrayCopy.slice(min);
}

export function getRandomElement<T>(array: ReadonlyArray<T>): T {
    if (array == null) {
        throw new Error('No array given.');
    }

    if (array.length === 0) {
        throw new Error('Cannot get value from empty dataset.');
    }

    const index = array.length > 1 ? getRandomInt({ max: array.length - 1 }) : 0;

    return array[index];
}

export function getObjectValue<T extends Record<string, unknown>>(object: T): T[keyof T] {
    const array: Array<keyof T> = Object.keys(object);
    const key = getRandomElement(array);

    return object[key];
}
