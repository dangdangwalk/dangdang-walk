import { fetchWalkAvailableDogs } from '@/api/dogs';
import { queryKeys } from '@/constants';
import { AvailableDog } from '@/models/dog.model';
import { useQuery } from '@tanstack/react-query';
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

const useWalkAvailabeDog = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: [queryKeys.WALK_AVAILABLE_DOGS],
        queryFn: async () => {
            const data = await fetchWalkAvailableDogs();

            return data.map((d: AvailableDog) => {
                return {
                    ...d,
                    profilePhotoUrl: `${REACT_APP_BASE_IMAGE_URL}/${d.profilePhotoUrl}`,
                    isChecked: false,
                };
            });
        },
        enabled: false,
    });
    return { availableDogsData: data, isAvailableDogsLoading: isLoading, fetchWalkAvailableDogs: refetch };
};

export default useWalkAvailabeDog;
