import { fetchWalkAvailableDogs } from '@/api/dog';
import { queryKeys } from '@/constants';
import { AvailableDog } from '@/models/dog';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

const useWalkAvailabeDog = () => {
    const [availableDogs, setAvailableDogs] = useState<AvailableDog[] | undefined>([]);

    const {
        data: availablDogData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [queryKeys.WALK_AVAILABLE_DOGS],
        queryFn: async () => {
            const data = await fetchWalkAvailableDogs();

            return data.map((d: AvailableDog) => {
                return {
                    ...d,
                    profilePhotoUrl: d.profilePhotoUrl ? `${REACT_APP_BASE_IMAGE_URL}/${d.profilePhotoUrl}` : null,
                };
            });
        },
        enabled: false,
    });

    useEffect(() => {
        if (!availablDogData) return;
        setAvailableDogs(
            availablDogData.map((d: AvailableDog) => {
                return {
                    ...d,
                    isChecked: false,
                };
            })
        );
    }, [availablDogData]);

    return {
        availableDogs,
        setAvailableDogs,
        isAvailableDogsLoading: isLoading,
        fetchWalkAvailableDogs: refetch,
    };
};

export default useWalkAvailabeDog;
