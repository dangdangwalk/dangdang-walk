import { httpClient } from '@/api/http';
import { DogRegInfo } from '@/pages/Join';
import { AvailableDog, DogStatistic } from '@/models/dog.model';
export type period = 'week' | 'month';
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

export const fetchDogMonthStatistic = async (dogId: number, date: string, period: period) => {
    const { data } = await httpClient.get(`/dogs/${dogId}/statistics?date=${date}&period=${period}`);
    return data;
};
export interface ResponseDogs extends DogRegInfo {
    id: number;
}
export const fetchDogs = async (): Promise<ResponseDogs[]> => {
    const { data } = await httpClient.get<ResponseDogs[]>('/dogs');
    return data;
};

export const deleteDog = async (dogId: number) => {
    await httpClient.delete(`/dogs/${dogId}`);
};
