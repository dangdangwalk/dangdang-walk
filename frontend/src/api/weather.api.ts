import { SunsetSunrise, WeatherData } from '@/models/weather.model';
import { createClient } from './http';

const REACT_APP_WEATHER_URL = process.env.REACT_APP_WEATHER_URL;
const REACT_APP_WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;
const REACT_APP_SUNRISE_URL = process.env.REACT_APP_SUNRISE_URL;

const weatherClient = createClient({
    headers: { 'Content-Type': `application/json;charset=UTF-8`, Accept: 'application/json' },
    baseURL: REACT_APP_WEATHER_URL,
    withCredentials: false,
});
const sunsetClient = createClient({
    headers: { 'Content-Type': `application/xml`, Accept: 'application/json' },
    baseURL: REACT_APP_SUNRISE_URL,
    withCredentials: false,
});

export const fetchCurrentWeather = async (date: string, nx: number, ny: number): Promise<WeatherData | undefined> => {
    try {
        const response = (
            await weatherClient.get(
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

export const fetchSunsetSunrise = async (
    date: string,
    lat: number,
    lng: number
): Promise<SunsetSunrise | undefined> => {
    try {
        const res = (
            await sunsetClient.get(
                `/getLCRiseSetInfo?locdate=${date}&longitude=${lng}&latitude=${lat}&dnYn=N&ServiceKey=${REACT_APP_WEATHER_KEY}`
            )
        ).request.response;
        const { header, body } = JSON.parse(res).response;

        if (header.resultCode !== '00') {
            throw new Error(header.resultMsg);
        }

        return body.items.item;
    } catch (e) {
        console.log(e);
    }
};
