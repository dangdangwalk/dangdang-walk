// Modified from https://github.com/faker-js/faker

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

    return Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
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
