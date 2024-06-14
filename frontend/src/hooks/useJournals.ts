import { fetchJournals } from '@/api/journal';
import { Journal } from '@/models/journal';
import { formatDate } from '@/utils/time';
import { useEffect, useState } from 'react';

const useJournals = (dogId: number | undefined, date: string) => {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [isJournalsLoading, setIsJournalsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!dogId) return;
        setIsJournalsLoading(true);
        if (dogId) {
            fetchJournals(Number(dogId), date ?? formatDate(new Date())).then((data) => {
                if (data) {
                    setJournals(data);
                    setIsJournalsLoading(false);
                }
            });
        }
    }, [dogId, date]);

    return { journals, isJournalsLoading };
};

export default useJournals;
