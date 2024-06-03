import { fetchDogBreeds } from '@/api/breed';
import { useQuery } from '@tanstack/react-query';

export const useBreed = () => {
    const { data } = useQuery({
        queryKey: ['breeds'],
        queryFn: fetchDogBreeds,
        gcTime: 1000 * 60 * 60 * 24,
        staleTime: 1000 * 60 * 60 * 24 - 1000 * 60,
    });
    return { data };
};
