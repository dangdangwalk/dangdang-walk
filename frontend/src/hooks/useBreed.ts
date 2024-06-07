import { fetchDogBreeds } from '@/api/breed';
import { A_DAY, TEN_TO_A_DAY, queryKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

export const useBreed = () => {
    const { isSignedIn } = useAuthStore();
    const { data } = useQuery({
        queryKey: [queryKeys.BREEDS],
        queryFn: fetchDogBreeds,
        gcTime: A_DAY,
        staleTime: TEN_TO_A_DAY,
        enabled: isSignedIn,
    });
    return { data };
};
