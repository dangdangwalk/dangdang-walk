import { fetchAddress } from '@/api/map';
import { fetchAirGrade, fetchCurrentWeather, fetchSunsetSunrise } from '@/api/weather';
import { DEFAULT_ADDRESS, DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { Weather } from '@/models/weather.model';
import { getCurrentDate, getHours } from '@/utils/date';
import { getGeoLocation, getSidoCode, gpsToGrid } from '@/utils/geo';
// import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useWeather = () => {
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

    //TODO react-query 바꾸기, address 시리얼 처리 문제 해결, refacor 필요
    const onSuccess = async (lat: number, lng: number) => {
        const { nx, ny } = gpsToGrid(lat, lng);
        const req1 = fetchCurrentWeather(date, nx, ny);
        const req2 = fetchSunsetSunrise(date, Math.floor(lat * 100), Math.floor(lng * 100));

        fetchAddress(lat, lng).then((add) => {
            const sido = getSidoCode(add?.region_1depth_name ?? '');
            setAdress(add?.region_3depth_name ?? DEFAULT_ADDRESS);
            fetchAirGrade(sido).then((grade) => {
                const airGrade = Number(grade?.khaiGrade ?? 2);
                setWeather({
                    ...weather,
                    airGrade,
                });
                setAdress(add?.region_3depth_name ?? DEFAULT_ADDRESS);
            });
        });

        Promise.allSettled([req1, req2]).then((res) => {
            const newWeatherList =
                res[0].status === 'fulfilled' ? res[0].value?.filter((w) => w.baseDate === date) : [];

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

            const sun = res[1].status === 'fulfilled' ? res[1].value : undefined;

            setWeather({
                ...weather,
                maxTemperature: maxTemperature ?? 28,
                minTemperature: minTemperature ?? 0,
                temperature: temperature ?? 15,
                precipitation: precipitation ?? 0,
                sky: sky ?? 1,
                sunrise: sun?.sunrise ?? '0600',
                sunset: sun?.sunset ?? '1900',
            });
        });
    };

    useEffect(() => {
        getGeoLocation(DEFAULT_LAT, DEFAULT_LNG, onSuccess);
    }, []);

    return { weather, address };
};
