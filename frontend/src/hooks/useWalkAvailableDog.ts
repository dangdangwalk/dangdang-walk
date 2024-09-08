import { fetchWalkAvailableDogs } from '@/api/dog';
import { queryKeys } from '@/constants';
import { DogAvatar } from '@/models/dog';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const useWalkAvailable = () => {
    const [checkedAvailableDogs, setCheckedAvailableDogs] = useState<Set<number>>(new Set<number>());
    const {
        data: walkAvailableDogs,
        isLoading,
        refetch,
    } = useQuery<DogAvatar[]>({
        queryKey: [queryKeys.WALK_AVAILABLE_DOGS],
        queryFn: fetchWalkAvailableDogs,
        enabled: false,
    });

    return {
        walkAvailableDogs,
        isAvailableDogsLoading: isLoading,
        fetchWalkAvailableDogs: refetch,
        checkedAvailableDogs,
        setCheckedAvailableDogs,
    };
};

export default useWalkAvailable;
