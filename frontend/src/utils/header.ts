import { httpClient } from '@/api/http';

const getHeader = (key: string) => {
    return httpClient.defaults.headers.common[key];
};

const setHeader = (key: string, value: string) => {
    httpClient.defaults.headers.common[key] = value;
};

const removeHeader = (key: string) => {
    if (!httpClient.defaults.headers.common[key]) return;
    delete httpClient.defaults.headers.common[key];
};

export { getHeader, setHeader, removeHeader };
