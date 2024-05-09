import { fetchAddress } from '@/api/map';
import { fetchAirGrade } from '@/api/weather';
import { DEFAULT_ADDRESS } from '@/constants/location';
import useGeolocation from '@/hooks/useGeolocation2';
import { getSidoCode } from '@/utils/geo';
import { AirGrade } from '@/utils/weather';
import { useEffect, useState } from 'react';

const useAddressAndAirgrade = () => {
    const [airGrade, setAirGrade] = useState<AirGrade | undefined>();
    const [address, setAddress] = useState<string | undefined>(DEFAULT_ADDRESS);
    const { position } = useGeolocation();

    useEffect(() => {
        if (!position) return;
        const onSuccess = async () => {
            const add = await fetchAddress(position.lat, position.lng);
            const sido = getSidoCode(add?.region_1depth_name);
            const grade = await fetchAirGrade(sido);

            setAirGrade(grade?.khaiGrade);
            setAddress(add?.region_3depth_name);
        };
        onSuccess();
    }, [position]);

    return { airGrade, address };
};

export default useAddressAndAirgrade;
