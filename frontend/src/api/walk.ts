import { httpClient } from '@/api/http';

export const requestWalkStart = async (dogId: Number[]) => {
    const { data } = await httpClient.post('/dogs/walks/start', dogId);

    return data;
};

export const requestWalkStop = async (dogId: Number[]) => {
    const { data } = await httpClient.post('/dogs/walks/stop', dogId);

    return data;
};
