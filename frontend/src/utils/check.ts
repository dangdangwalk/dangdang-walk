export const toggleCheckById = <T extends { id: number }>(array: T[], id: number, key: keyof T): T[] => {
    return array.map((item) => (item.id === id ? { ...item, [key]: !item[key] } : item));
};

export const toggleCheckAll = <T extends { id: number }>(array: T[], key: keyof T, flag: boolean): T[] => {
    return array.map((item) => ({ ...item, key: flag }));
};
