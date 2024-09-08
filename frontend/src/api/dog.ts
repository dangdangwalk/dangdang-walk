import { httpClient } from '@/api/http';
import { Dog, DogCreateForm, DogStatistic, DogAvatar } from '@/models/dog';
export type Period = 'week' | 'month';
export const fetchDogStatistic = async (): Promise<DogStatistic[]> => {
    const { data } = await httpClient.get('/dogs/statistics');
    return data;
};

export const fetchWalkAvailableDogs = async (): Promise<DogAvatar[]> => {
    const { data } = await httpClient.get('/dogs/walks/available');
    return data;
};

export const createDog = async (params: DogCreateForm) => {
    const { data } = await httpClient.post('/dogs', params);
    return data;
};

export const fetchDogMonthStatistic = async (dogId: number, date: string, period: Period) => {
    const { data } = await httpClient.get(`/dogs/${dogId}/statistics?date=${date}&period=${period}`);
    return data;
};

export const fetchDogs = async (): Promise<Dog[]> => {
    const { data } = await httpClient.get<Dog[]>('/dogs');
    return data;
};

export const deleteDog = async (dogId: number) => {
    await httpClient.delete(`/dogs/${dogId}`);
};

export interface RecentMonthStatisticsResponse {
    totalWalkCnt: number;
    totalDistance: number;
    totalTime: number;
}
export const fetchDogRecentMonthStatistics = async (dogId: number): Promise<RecentMonthStatisticsResponse> => {
    const { data } = await httpClient.get<RecentMonthStatisticsResponse>(
        `/dogs/${dogId}/statistics/recent?period=month`
    );
    return data;
};
type DogUpdateForm = Partial<Omit<Dog, 'id'>>;
export const updateDog = async ({ dogId, params }: { dogId: number; params: DogUpdateForm }) => {
    await httpClient.patch(`/dogs/${dogId}`, params);
};
