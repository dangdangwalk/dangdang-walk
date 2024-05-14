import { httpClient } from '@/api/http';
import { DogStatistic } from '@/components/home/DogCard';

export const fetchDogStatistic = async (): Promise<DogStatistic[]> => {
    const { data } = await httpClient.get('/dogs/statistic');
    return data;
};
