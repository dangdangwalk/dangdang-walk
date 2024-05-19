import { httpClient } from '@/api/http';
import { DogRegInfo } from '@/pages/Join';
import { AvailableDog, DogStatistic } from '@/models/dog.model';

export const fetchDogStatistic = async (): Promise<DogStatistic[]> => {
    const { data } = await httpClient.get('/dogs/statistics');
    return data;
};

export const fetchWalkAvailableDogs = async (): Promise<AvailableDog[]> => {
    const { data } = await httpClient.get('/dogs/walks/available');
    return data;
};

export const registerDogInfo = async (params: DogRegInfo) => {
    const { data } = await httpClient.post('/dogs', params);
    return data;
};
