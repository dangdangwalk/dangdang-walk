import { fetchDogBreeds } from '@/api/breed';
import { ONE_DAY_IN_MS, ONE_WEEK_IN_MS, queryKeys } from '@/constants';
import { useStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
export const useBreed = () => {
    const isSignedIn = useStore((state) => state.isSignedIn);
    const { data } = useQuery({
        queryKey: [queryKeys.BREEDS],
        queryFn: fetchDogBreeds,
        gcTime: ONE_WEEK_IN_MS,
        staleTime: ONE_DAY_IN_MS,
        enabled: isSignedIn,
    });
    return { data };
};
