import { httpClient } from '@/api/http';
import { DogStatistic } from '@/models/dog.model';
import { AvailableDog } from '@/pages/Home';
import { DogRegInfo } from '@/pages/Join';

export const fetchDogStatistic = async (): Promise<DogStatistic[]> => {
    const { data } = await httpClient.get('/dogs/statistics');
    return data;
};

export const fetchWalkAvailableDogs = async (): Promise<AvailableDog[]> => {
    const { data } = await httpClient.get('/dogs/walk-available');
    return data;
};

export const registerDogInfo = async (params: DogRegInfo) => {
    const { data } = await httpClient.post('/dogs', params);
    return data;
};
