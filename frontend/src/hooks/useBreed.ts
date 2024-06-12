import { fetchDogBreeds } from '@/api/breed';
import { ONE_DAY_IN_MS, ONE_WEEK_IN_MS, queryKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
export const useBreed = () => {
    const { isSignedIn } = useAuthStore();
    const { data } = useQuery({
        queryKey: [queryKeys.BREEDS],
        queryFn: fetchDogBreeds,
        gcTime: ONE_WEEK_IN_MS,
        staleTime: ONE_DAY_IN_MS,
        enabled: isSignedIn,
    });
    return { data };
};
