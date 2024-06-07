import { fetchAddress } from '@/api/map';
import { fetchAirGrade } from '@/api/weather';
import { queryKeys } from '@/constants';
import { Position } from '@/models/location';
import { useQuery } from '@tanstack/react-query';

const useAddressAndAirGrade = (position: Position | null) => {
    const {
        data: addressData,
        error: addressError,
        isLoading: isAddressLoading,
    } = useQuery({
        queryKey: [queryKeys.ADDRESS],
        queryFn: async () => {
            if (!position) return;
            return await fetchAddress(position.lat, position.lng);
        },
        enabled: !!position,
        staleTime: 7200,
    });

    const {
        data: airGradeData,
        isPending: isAirGradePending,
        error: airGradeError,
    } = useQuery({
        queryKey: [queryKeys.AIR_GRADE, position?.lat, position?.lng],
        queryFn: async () => {
            if (!addressData?.sido) return;
            return await fetchAirGrade(addressData?.sido);
        },
        enabled: !!addressData?.sido,
        staleTime: 7200,
    });

    return {
        airGrade: airGradeData?.khaiGrade,
        address: addressData?.dong,
        isAddressLoading: isAddressLoading,
        isAirGradePending,
        addressError,
        airGradeError,
    };
};

export default useAddressAndAirGrade;
