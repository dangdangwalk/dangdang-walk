import { fetchSunsetSunrise } from '@/api/weather';
import useGeolocation from '@/hooks/useGeolocation2';
import { getCurrentDate } from '@/utils/date';
import { useQuery } from '@tanstack/react-query';

const useSunsetSunrise = () => {
    const { position } = useGeolocation();
    const queryKey = ['sunsetSunrise', position?.lat, position?.lng];
    const {
        data: sunsetSunriseData,
        error: sunsetSunriseError,
        isLoading: isSunsetSunriseLoading,
    } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!position) return;
            return await fetchSunsetSunrise(
                getCurrentDate(new Date()),
                Math.floor(position.lat * 100),
                Math.floor(position.lng * 100)
            );
        },
        enabled: !!position,
        staleTime: 7200,
    });

    return {
        isSunsetSunriseLoading,
        sunset: sunsetSunriseData?.sunset,
        sunsetSunriseError,
        sunrise: sunsetSunriseData?.sunrise,
    };
};

export default useSunsetSunrise;
