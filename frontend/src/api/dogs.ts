import { httpClient } from '@/api/http';
import { DogRegInfo } from '@/pages/Join';
import { AvailableDog, Dog, DogStatistic } from '@/models/dog.model';
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
export interface ResponseDogs {
    id: number;
    birth: string | null;
    name: string;
    breed: string;
    gender: string;
    weight: number;
    isNeutered: boolean;
    profilePhotoUrl: string;
}
export const fetchDogs = async (): Promise<ResponseDogs[]> => {
    const { data } = await httpClient.get<ResponseDogs[]>('/dogs');
    return data;
};

export const deleteDog = async (dogId: number) => {
    await httpClient.delete(`/dogs/${dogId}`);
};

export interface ResponseRecentMonthStatistics {
    totalWalkCnt: number;
    totalDistance: number;
    totalTime: number;
}
export const fetchDogRecentMonthStatistics = async (dogId: number): Promise<ResponseRecentMonthStatistics> => {
    const { data } = await httpClient.get(`/dogs/${dogId}/statistics/recent?period=month`);
    return data;
};

export const updateDog = async ({ dogId, params }: { dogId: number; params: DogRegInfo }) => {
    await httpClient.patch(`/dogs/${dogId}`, params);
};
export const fetchDogList = async (): Promise<Dog[]> => {
    const { data } = await httpClient.get<Dog[]>('/dogs');
    return data;
};
