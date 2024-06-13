export const isArrayNotEmpty = <T>(array: T[] | undefined | null): boolean => {
    if (!array) return false;
    return array.length > 0;
};
