import { httpClient } from '@/api/http';
import { Journal } from '@/models/journals';
import { Position as NumberPosition } from '@/models/location.model';
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
        routes: Array<NumberPosition>;
        photoUrls?: string[];
        memo?: string;
    };
    excrements?: Array<Excrement>;
}

interface Excrement {
    dogId: number;
    fecesLocations: Array<StringPosition>;
    urineLocations: Array<StringPosition>;
}

interface StringPosition {
    lat: string;
    lng: string;
}
