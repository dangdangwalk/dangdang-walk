import { fetchCurrentWeather } from '@/api/weather';
import { ONE_HOUR, queryKeys } from '@/constants';
import { Position } from '@/models/location';
import { Weather } from '@/models/weather';
import { gpsToGrid } from '@/utils/geo';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useWeather = (position: Position | null) => {
    const [weather, setWeather] = useState<Weather | null>(null);

    const {
        data: weatherData,
        error: weatherError,
        isPending: isWeatherPending,
    } = useQuery({
        queryKey: [queryKeys.WEATHER],
        queryFn: async () => {
            if (!position) return;
            const { nx, ny } = gpsToGrid(position.lat, position.lng);
            return await fetchCurrentWeather(nx, ny);
        },
        enabled: !!position,
        staleTime: ONE_HOUR,
    });

    useEffect(() => {
        if (!weatherData) return;
        setWeather(weatherData);
    }, [weatherData]);

    return { weather, weatherError, isWeatherPending };
};
