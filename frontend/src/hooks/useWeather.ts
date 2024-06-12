import { fetchCurrentWeather } from '@/api/weather';
import { ONE_HOUR, queryKeys } from '@/constants';
import { Position } from '@/models/location';
import { Weather, WeatherData } from '@/models/weather';
import { getCurrentDate, getHours } from '@/utils/time';
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
        queryKey: [queryKeys.WEATHER, position?.lat, position?.lng],
        queryFn: async () => {
            if (!position) return;
            const { nx, ny } = gpsToGrid(position.lat, position.lng);
            const date = getCurrentDate(new Date());
            return await fetchCurrentWeather(date, nx, ny);
        },
        enabled: !!position,
        staleTime: ONE_HOUR,
    });

    const getWeather = (weatherDataList: WeatherData[], hour: string) => {
        let maxTemperature, minTemperature, temperature, sky, precipitation;
        weatherDataList.forEach((weatherData) => {
            if (hour === weatherData.fcstTime.slice(0, 2)) {
                if (weatherData.category === 'TMP') {
                    temperature = Number(weatherData.fcstValue);
                }
                if (weatherData.category === 'SKY') {
                    sky = Number(weatherData.fcstValue);
                }
                if (weatherData.category === 'PTY') {
                    precipitation = Number(weatherData.fcstValue);
                }
            }
            if (weatherData.category === 'TMN') {
                minTemperature = Number(weatherData.fcstValue);
            }
            if (weatherData.category === 'TMX') {
                maxTemperature = Number(weatherData.fcstValue);
            }
        });
        return {
            maxTemperature: maxTemperature ?? 28,
            minTemperature: minTemperature ?? 0,
            temperature: temperature ?? 15,
            precipitation: precipitation ?? 0,
            sky: sky ?? 1,
        };
    };

    useEffect(() => {
        if (!weatherData) return;
        const date = getCurrentDate(new Date());
        const hour = getHours(new Date());
        const currentWeatherData = weatherData.filter((w) => w.baseDate === date);
        const data = getWeather(currentWeatherData, hour);

        setWeather(data);
    }, [weatherData]);

    return { weather, weatherError, isWeatherPending };
};
