import { httpClient } from '@/api/http';
import { Journal } from '@/models/journals';
import { formDate } from '@/utils/date';

export const fetchJournals = async (dogId: number, date: string | null = formDate(new Date())): Promise<Journal[]> => {
    const { data } = await httpClient.get(`/journals?dogId=${dogId}&date=${date}`);

    return data;
};
