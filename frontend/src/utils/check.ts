export const toggleCheckById = <T extends { id: number }>(array: T[], id: number, key: keyof T): T[] => {
    return array.map((item) => (item.id === id ? { ...item, [key]: !item[key] } : item));
};

export const setFlagValueByKey = <T extends { id: number }>(
    array: T[],
    flag: boolean,
    key1: keyof T,
    key2?: keyof T
): T[] => {
    if (key2) {
        return array.map((item) => ({ ...item, [key1]: flag, [key2]: flag }));
    }
    return array.map((item) => ({ ...item, [key1]: flag }));
};

export const updateSet = (set: Set<number>, id: number): Set<number> => {
    const newSet = new Set<number>(set);
    if (set.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }
    return newSet;
};
