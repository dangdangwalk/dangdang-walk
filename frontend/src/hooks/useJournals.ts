import { fetchJournals } from '@/api/journal';
import { queryStringKeys } from '@/constants';
import { Journal } from '@/models/journal';
import { formDate } from '@/utils/date';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useJournals = () => {
    const location = useLocation();
    const [journals, setJournals] = useState<Journal[]>([]);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get(queryStringKeys.DATE);
        const dogId = params.get(queryStringKeys.DOG_ID);
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
