import { fetchDogBreeds } from '@/api/breed';
import { queryKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

export const useBreed = () => {
    const { isSignedIn } = useAuthStore();
    const { data } = useQuery({
        queryKey: [queryKeys.BREEDS],
        queryFn: fetchDogBreeds,
        gcTime: 1000 * 60 * 60 * 24,
        staleTime: 1000 * 60 * 60 * 24 - 1000 * 60,
        enabled: isSignedIn,
    });
    return { data };
};
