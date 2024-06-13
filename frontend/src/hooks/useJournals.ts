import { fetchJournals } from '@/api/journal';
import { queryStringKeys } from '@/constants';
import { Journal } from '@/models/journal';
import { formatDate } from '@/utils/time';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useJournals = () => {
    const location = useLocation();
    const [journals, setJournals] = useState<Journal[]>([]);
    const [isJournalsLoading, setIsJournalsLoading] = useState<boolean>(false);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get(queryStringKeys.DATE);
        const dogId = params.get(queryStringKeys.DOG_ID);
        setIsJournalsLoading(true);
        if (dogId) {
            fetchJournals(Number(dogId), date ?? formatDate(new Date())).then((data) => {
                if (data) {
                    setJournals(data);
                    setIsJournalsLoading(false);
                }
            });
        }
    }, [location.search]);

    return { journals, isJournalsLoading };
};

export default useJournals;
