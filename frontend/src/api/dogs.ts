import { httpClient } from '@/api/http';
import { DogStatistic } from '@/components/home/DogCard';
import { AvailableDog } from '@/pages/Home';

export const fetchDogStatistic = async (): Promise<DogStatistic[]> => {
    const { data } = await httpClient.get('/dogs/statistics');
    return data;
};

export const fetchWalkAvailableDogs = async (): Promise<AvailableDog[]> => {
    const { data } = await httpClient.get('/dogs/walk-available');
    return data;
};
