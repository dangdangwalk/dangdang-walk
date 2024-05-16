import { fetchWalkAvailableDogs } from '@/api/dogs';
import { queryKeys } from '@/constants';
import { useQuery } from '@tanstack/react-query';

const useWalkAvailabeDog = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: [queryKeys.WALK_AVAILABLE_DOGS],
        queryFn: fetchWalkAvailableDogs,
        enabled: false,
    });
    return { availableDogsData: data, isAvailableDogsLoading: isLoading, fetchWalkAvailableDogs: refetch };
};

export default useWalkAvailabeDog;
