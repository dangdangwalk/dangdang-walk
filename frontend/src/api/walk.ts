import { httpClient } from '@/api/http';

export const walkStartRequest = async (dogId: Number[]) => {
    const { data } = await httpClient.post('/dogs/walks/start', { dogId });

    return data;
};

export const walkStopRequest = async (dogId: Number[]) => {
    const { data } = await httpClient.post('/dogs/walks/stop', { dogId });

    return data;
};
