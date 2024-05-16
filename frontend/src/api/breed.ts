import { httpClient } from '@/api/http';

export const fetchDogBreeds = async () => {
    const { data } = await httpClient.get('/breeds');
    return data;
};
