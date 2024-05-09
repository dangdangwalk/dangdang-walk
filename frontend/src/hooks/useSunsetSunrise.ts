import { fetchSunsetSunrise } from '@/api/weather';
import useGeolocation from '@/hooks/useGeolocation2';
import { getCurrentDate } from '@/utils/date';
import { useEffect, useState } from 'react';

const useSunsetSunrise = () => {
    const { position } = useGeolocation();
    const [sunset, setSunset] = useState<string | undefined>();
    const [sunrise, setSunrise] = useState<string | undefined>();

    const onSuccess = async (lat: number, lng: number) => {
        const date = getCurrentDate(new Date());
        const data = await fetchSunsetSunrise(date, Math.floor(lat * 100), Math.floor(lng * 100));

        setSunset(data?.sunset);
        setSunrise(data?.sunrise);
    };

    useEffect(() => {
        if (!position) return;
        onSuccess(position.lat, position.lng);
    }, [position]);

    return { sunset, sunrise };
};

export default useSunsetSunrise;
