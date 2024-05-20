import { httpClient } from '@/api/http';
import { Journal } from '@/models/journals';
import { formDate } from '@/utils/date';

export const fetchJournals = async (dogId: number, date: string | null = formDate(new Date())): Promise<Journal[]> => {
    const { data } = await httpClient.get(`/journals?dogId=${dogId}&date=${date}`);

    return data;
};

export const create = async (form: JournalCreateForm) => {
    await httpClient.post('/journals', form);
};

interface JournalCreateForm {
    dogs: Array<number>;
    journalInfo: {
        distance: number;
        calories: number;
        startedAt: string;
        duration: number;
        routeImageUrl: string;
        photoUrls?: string[];
        memo?: string;
    };
    excrements?: Array<Excrement>;
}

interface Excrement {
    dogId: number;
    fecesLocations: Array<Location>;
    urineLocations: Array<Location>;
}

interface Location {
    lat: string;
    lng: string;
}
