export function isTypedArray(
    target: any,
    type: 'string' | 'number' | 'boolean' | 'undefined' | 'symbol' | 'object' | 'function',
): boolean {
    return Boolean(Array.isArray(target) && target.every((t) => typeof t === type));
}
