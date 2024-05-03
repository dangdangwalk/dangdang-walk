import { fetchAddress } from '@/api/map.api';
import { fetchAirGrade, fetchCurrentWeather, fetchSunsetSunrise } from '@/api/weather.api';
import { DEFAULT_ADDRESS } from '@/constants/location';
import useGeolocation from '@/hooks/useGeolocation';
import { Weather } from '@/models/weather.model';
import { getCurrentDate, getHours } from '@/utils/date';
import { getSidoCode, gpsToGrid } from '@/utils/geo';
// import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useWeather = () => {
    const { lat, lng } = useGeolocation();
    const date = getCurrentDate(new Date());
    const [weather, setWeather] = useState<Weather>({
        maxTemperature: 28,
        minTemperature: 0,
        sky: 1,
        sunrise: '0600',
        sunset: '1700',
        temperature: 15,
        airGrade: 1,
        precipitation: 0,
    });
    const [address, setAdress] = useState<string>(DEFAULT_ADDRESS);

    useEffect(() => {
        const { nx, ny } = gpsToGrid(lat, lng);
        fetchCurrentWeather(date, nx, ny).then((weatherList) => {
            const newWeatherList = weatherList?.filter((weather) => weather.baseDate === date);
            let maxTemperature, minTemperature, temperature, sky, precipitation;
            const hour = getHours(new Date());

            newWeatherList?.forEach((w) => {
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
                ...weather,
                maxTemperature: maxTemperature ?? 28,
                minTemperature: minTemperature ?? 0,
                temperature: temperature ?? 15,
                precipitation: precipitation ?? 0,
                sky: sky ?? 1,
            });
        });
        fetchSunsetSunrise(date, Math.floor(lat * 100), Math.floor(lng * 100)).then((sun) => {
            //Promise<Sunset>
            setWeather({
                ...weather,
                sunrise: sun?.sunrise,
                sunset: sun?.sunset,
            });
        });
        // fetchAddress(lat, lng).then((add) => {
        //     const sido = getSidoCode(add?.region_1depth_name ?? '');
        //     fetchAirGrade(sido).then((grade) => {
        //         const airGrade = Number(grade?.khaiGrade ?? 2);

        //         setWeather({
        //             ...weather,
        //             airGrade,
        //         });
        //         setAdress(add?.region_3depth_name ?? DEFAULT_ADDRESS);
        //     });
        // });
    }, []);

    return { weather, address };
};
