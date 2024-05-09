import { fetchCurrentWeather } from '@/api/weather';
import useGeolocation from '@/hooks/useGeolocation2';
import { Weather, WeatherData } from '@/models/weather.model';
import { getCurrentDate, getHours } from '@/utils/date';
import { gpsToGrid } from '@/utils/geo';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useWeather = () => {
    const date = getCurrentDate(new Date());
    const { position } = useGeolocation();
    const [weather, setWeather] = useState<Weather>({
        maxTemperature: 28,
        minTemperature: 0,
        sky: 1,
        temperature: 15,
        precipitation: 0,
    });

    const queryKey = ['weather', position?.lat, position?.lng];
    const {
        data: weatherData,
        error: weatherError,
        isLoading: isWeatherLoading,
    } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!position) return;
            const { nx, ny } = gpsToGrid(position.lat, position.lng);
            const date = getCurrentDate(new Date());
            return await fetchCurrentWeather(date, nx, ny);
        },

        enabled: !!position,
    });
    const updateWeatherData = (newWeatherList: WeatherData[], hour: string) => {
        let maxTemperature, minTemperature, temperature, sky, precipitation;
        newWeatherList.forEach((w) => {
            if (hour === w.fcstTime.slice(0, 2)) {
                if (w.category === 'TMP') {
                    temperature = Number(w.fcstValue);
                }
                if (w.category === 'SKY') {
                    sky = Number(w.fcstValue);
                }
                if (w.category === 'PTY') {
                    precipitation = Number(w.fcstValue);
                }
            }
            if (w.category === 'TMN') {
                minTemperature = Number(w.fcstValue);
            }
            if (w.category === 'TMX') {
                maxTemperature = Number(w.fcstValue);
            }
        });

        setWeather({
            maxTemperature: maxTemperature ?? 28,
            minTemperature: minTemperature ?? 0,
            temperature: temperature ?? 15,
            precipitation: precipitation ?? 0,
            sky: sky ?? 1,
        });
    };

    useEffect(() => {
        if (weatherError || isWeatherLoading) return;

        if (weatherData) {
            const newWeatherList = weatherData.filter((w) => w.baseDate === date);
            const hour = getHours(new Date());
            updateWeatherData(newWeatherList, hour);
        }
    }, [weatherData, weatherError, isWeatherLoading]);

    return { weather, weatherError, isWeatherLoading };
};
