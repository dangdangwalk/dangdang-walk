import { fetchWalkAvailableDogs } from '@/api/dog';
import { queryKeys } from '@/constants';
import { AvailableDog } from '@/models/dog';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

const useWalkAvailabeDog = () => {
    const [availableDogs, setAvailableDogs] = useState<AvailableDog[] | undefined>([]);

    const {
        data: aavailablDogData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [queryKeys.WALK_AVAILABLE_DOGS],
        queryFn: async () => {
            const data = await fetchWalkAvailableDogs();

            return data.map((d: AvailableDog) => {
                return {
                    ...d,
                    profilePhotoUrl: d.profilePhotoUrl ? `${REACT_APP_BASE_IMAGE_URL}/${d.profilePhotoUrl}` : undefined,
                };
            });
        },
        enabled: false,
    });
    const toggleCheck = (id: number) => {
        setAvailableDogs(
            availableDogs?.map((d: AvailableDog) => (d.id === id ? { ...d, isChecked: !d.isChecked } : d))
        );
    };
    const changeCheckAll = (flag: boolean) => {
        setAvailableDogs(
            availableDogs?.map((d: AvailableDog) => {
                return { ...d, isChecked: flag };
            })
        );
    };

    useEffect(() => {
        if (!aavailablDogData) return;
        setAvailableDogs(
            aavailablDogData.map((d: AvailableDog) => {
                return {
                    ...d,
                    isChecked: false,
                };
            })
        );
    }, [aavailablDogData]);

    return {
        availableDogs,
        setAvailableDogs,
        isAvailableDogsLoading: isLoading,
        fetchWalkAvailableDogs: refetch,
        toggleCheck,
        changeCheckAll,
    };
};

export default useWalkAvailabeDog;
