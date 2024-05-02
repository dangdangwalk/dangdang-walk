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

interface WeatherParams {
    date: string;
    nx: number;
    ny: number;
}
interface WeatherResponse {
    response: {
        header: {
            resultCode: string;
            resultMsg: string;
        };
        body: {
            items: {
                item: WeatherData[];
            };
        };
    };
}

export const fetchCurrentWeather = async ({ date, nx, ny }: WeatherParams) => {
    try {
        const response = (
            await weatherClient.get<WeatherResponse>(
                `/getVilageFcst?serviceKey=${REACT_APP_WEATHER_KEY}&dataType=JSON&numOfRows=260&pageNo=1&base_date=${date}&base_time=0200&nx=${nx}&ny=${ny}`
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
