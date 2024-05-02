import { fetchAddress } from '@/api/map.api';
import { fetchAirGrade, fetchCurrentWeather, fetchSunsetSunrise } from '@/api/weather.api';
import { getCurrentDate } from '@/utils/date';
import { getSidoCode, gpsToGrid } from '@/utils/geo';
import { useEffect } from 'react';

export default function WeatherInfo() {
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const { nx, ny } = gpsToGrid(latitude, longitude);

                const date = getCurrentDate(new Date());
                fetchCurrentWeather(date, nx, ny).then((weather) => {
                    console.log(weather);
                });
                fetchSunsetSunrise(date, Math.floor(latitude * 1000), Math.floor(longitude * 1000)).then((data) => {
                    console.log(data?.sunrise, data?.sunset);
                });
                fetchAddress(latitude, longitude).then((data) => {
                    console.log(data?.region_3depth_name);
                    const sido = getSidoCode('asf');
                    fetchAirGrade(sido).then((air) => {
                        console.log(air?.khaiGrade);
                    });
                });
            });
        } else {
            /* 위치정보 사용 불가능 */
        }
    }, []);

    return (
        <>
            {' '}
            <div>WeatherInfo</div>
            <div></div>
        </>
    );
}
