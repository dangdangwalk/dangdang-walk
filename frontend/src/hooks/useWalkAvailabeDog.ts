import { fetchWalkAvailableDogs } from '@/api/dogs';
import { useQuery } from '@tanstack/react-query';

const useWalkAvailabeDog = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['walk-available-dog'],
        queryFn: fetchWalkAvailableDogs,
        enabled: false,
    });
    return { availableDogsData: data, isAvailableDogsLoading: isLoading, fetchWalkAvailableDogs: refetch };
};

export default useWalkAvailabeDog;
