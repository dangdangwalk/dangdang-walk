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
        data: weatherInfo,
        error: weatherError,
        isPending: isWeatherPending,
    } = useQuery({
        queryKey,
        queryFn: async () => {
            console.log(position);
            if (!position) return;
            const { nx, ny } = gpsToGrid(position.lat, position.lng);
            const date = getCurrentDate(new Date());
            const data = await fetchCurrentWeather(date, nx, ny);
            const newWeatherList = data?.filter((w) => w.baseDate === date) ?? [];
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
        console.log(maxTemperature, minTemperature, temperature, sky);
        return {
            maxTemperature: maxTemperature ?? 28,
            minTemperature: minTemperature ?? 0,
            temperature: temperature ?? 15,
            precipitation: precipitation ?? 0,
            sky: sky ?? 1,
        };
    };

    return { weather: weatherInfo, weatherError, isWeatherPending };
};
