import { fetchCurrentWeather } from '@/api/weather';
import useGeolocation from '@/hooks/useGeolocation';
import { WeatherData } from '@/models/weather.model';
import { getCurrentDate, getHours } from '@/utils/date';
import { gpsToGrid } from '@/utils/geo';
import { useQuery } from '@tanstack/react-query';

export const useWeather = () => {
    const { position } = useGeolocation();

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
            const weatherData = await fetchCurrentWeather(date, nx, ny);
            const newWeatherList = weatherData?.filter((w) => w.baseDate === date) ?? [];
            const hour = getHours(new Date());
            return getWeatherData(newWeatherList, hour);
        },

        enabled: !!position,
    });

    const getWeatherData = (newWeatherList: WeatherData[], hour: string) => {
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
        return {
            maxTemperature: maxTemperature ?? 28,
            minTemperature: minTemperature ?? 0,
            temperature: temperature ?? 15,
            precipitation: precipitation ?? 0,
            sky: sky ?? 1,
        };
    };

    return { weather: weatherData, weatherError, isWeatherLoading };
};
