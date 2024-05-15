import { httpClient } from '@/api/http';

export const walkStartRequest = async (params: Number[]) => {
    const { data } = await httpClient.post('/walk/start', params);

    return data;
};

export const walkStopRequest = async (params: Number[]) => {
    const { data } = await httpClient.delete('/walk/stop', { data: params });

    return data;
};
