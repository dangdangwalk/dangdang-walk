const getStorage = (key: string) => {
    const value = localStorage.getItem(key);
    return value;
};

const setStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

const removeStorage = (key: string) => {
    localStorage.removeItem(key);
};

export { getStorage, setStorage, removeStorage };
