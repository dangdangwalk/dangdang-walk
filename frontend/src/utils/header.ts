import { httpClient } from '@/api/http';

const setHeader = (key: string, value: string) => {
    httpClient.defaults.headers.common[key] = value;
};

const removeHeader = (key: string) => {
    if (!httpClient.defaults.headers.common[key]) return;
    delete httpClient.defaults.headers.common[key];
};

export { setHeader, removeHeader };
