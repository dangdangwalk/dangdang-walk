import { WeatherData } from '@/models/weather.model';
import { createClient } from './http';

const REACT_APP_WEATHER_URL = process.env.REACT_APP_WEATHER_URL;
const REACT_APP_WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;

console.log(REACT_APP_WEATHER_URL);
const weatherClient = createClient({
    headers: { 'Content-Type': `application/json;charset=UTF-8`, Accept: 'application/json' },
    baseURL: REACT_APP_WEATHER_URL,
    withCredentials: false,
});

interface FetchWeatherParams {
    date: string;
    time: string;
    nx: number;
    ny: number;
}

export const fetchCurrentWeather = async ({ date, time, nx, ny }: FetchWeatherParams) => {
    try {
        const response = (
            await weatherClient.get(
                `/getVilageFcst?serviceKey=${REACT_APP_WEATHER_KEY}&dataType=JSON&numOfRows=10&pageNo=1&base_date=${date}&base_time=${time}&nx=${nx}&ny=${ny}`
            )
        ).data.response;

        if (response.header.resultCode !== '00') {
            throw new Error(response.header.resultMsg);
        }
        return response.body.items.item;
    } catch (e) {
        console.log(e);
    }
};
