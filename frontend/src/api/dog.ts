import { httpClient } from '@/api/http';

export const fetchDogStatistic = async () => {
    const { data } = await httpClient.get('/dog/statistic');
    return data;
};
