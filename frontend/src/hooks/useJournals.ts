import { fetchJournals } from '@/api/journal';
import { queryKeys } from '@/constants';
import { useStore } from '@/store';
import { useQuery } from '@tanstack/react-query';

const useJournals = (dogId: number | undefined, date: string) => {
    const isSignedIn = useStore((state) => state.isSignedIn);
    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.JOURNALS, dogId, date],
        queryFn: async () => {
            if (!dogId) return;
            return await fetchJournals(dogId, date);
        },
        enabled: !!dogId && isSignedIn,
        staleTime: 1000 * 60,
    });

    return { journals: data, isJournalsLoading: isLoading };
};

export default useJournals;
