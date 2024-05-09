import { fetchAddress } from '@/api/map';
import { fetchAirGrade } from '@/api/weather';
import useGeolocation from '@/hooks/useGeolocation2';
import { getSidoCode } from '@/utils/geo';
import { useQuery } from '@tanstack/react-query';

const useAddressAndAirgrade = () => {
    const { position } = useGeolocation();

    const {
        data: addressData,
        error: addressError,
        isLoading: isAdressLoading,
    } = useQuery({
        queryKey: ['address'],
        queryFn: async () => {
            if (!position) return;
            return await fetchAddress(position.lat, position.lng);
        },
        enabled: !!position,
    });

    const sidoName = addressData?.region_1depth_name;
    const {
        data: airGradeData,
        isLoading: isAirGradeLoading,
        error: airGradeError,
    } = useQuery({
        queryKey: ['address'],
        queryFn: async () => {
            if (!sidoName) return;
            const sido = getSidoCode(sidoName);
            return await fetchAirGrade(sido);
        },
        enabled: !!sidoName,
    });

    return {
        airGrade: airGradeData?.khaiGrade,
        address: addressData?.region_3depth_name,
        isAdressLoading,
        isAirGradeLoading,
        addressError,
        airGradeError,
    };
};

export default useAddressAndAirgrade;
