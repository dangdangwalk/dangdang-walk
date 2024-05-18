import { httpClient } from '@/api/http';
import { formDate } from '@/utils/date';

export const fetchJournals = async (dogId: number, date: string = formDate(new Date())) => {
    const { data } = await httpClient.get(`/journals?dogId=${dogId}&date=${date}`);

    return data;
};
