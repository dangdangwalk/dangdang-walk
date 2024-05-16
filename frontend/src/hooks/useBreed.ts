import { fetchDogBreeds } from '@/api/breed';
import { useQuery } from '@tanstack/react-query';

export const useBreed = () => {
    const { data } = useQuery({
        queryKey: ['breeds'],
        queryFn: fetchDogBreeds,
    });
    return { data };
};
