import { httpClient } from '@/api/http';

export const walkStartRequest = async (dogId: Number[]) => {
    const { data } = await httpClient.post('/walk/start', { dogId });

    return data;
};

export const walkStopRequest = async (dogId: Number[]) => {
    const { data } = await httpClient.post('/walk/stop', { dogId });

    return data;
};
