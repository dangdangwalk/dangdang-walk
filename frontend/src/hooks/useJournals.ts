import { fetchJournals } from '@/api/journals';
import { queryStringKeys } from '@/constants';
import { Journal } from '@/models/journals';
import { formDate } from '@/utils/date';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useJournals = () => {
    const location = useLocation();
    const [journals, setJournals] = useState<Journal[]>([]);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get(queryStringKeys.DATE);
        const dogId = params.get(queryStringKeys.DOGID);
        if (dogId) {
            fetchJournals(Number(dogId), date ?? formDate(new Date())).then((data) => {
                if (data) {
                    setJournals(data);
                }
            });
        }
    }, [location.search]);

    return { journals };
};

export default useJournals;
