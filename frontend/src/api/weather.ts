import { AirGrade } from '@/utils/weather';
import { createClient } from './http';
import { WeatherData } from '@/models/weather';

const { REACT_APP_WEATHER_URL: WEATHER_URL = '' } = window._ENV ?? process.env;
const { REACT_APP_WEATHER_KEY: WEATHER_KEY = '' } = window._ENV ?? process.env;
const weatherClient = createClient({
    headers: { 'Content-Type': `application/json;charset=UTF-8`, Accept: 'application/json' },
    baseURL: WEATHER_URL,
    withCredentials: false,
});

export const fetchCurrentWeather = async (date: string, nx: number, ny: number): Promise<WeatherData[] | undefined> => {
    try {
        const response = (
            await weatherClient.get(
                `/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${WEATHER_KEY}&dataType=JSON&numOfRows=260&pageNo=1&base_date=${date}&base_time=0200&nx=${nx}&ny=${ny}`
            )
        ).data.response;

        if (response.header.resultCode !== '00') {
            throw new Error(response.header.resultMsg);
        }
        return response.body.items.item;
    } catch (e) {
        console.error(e);
    }
};

export const fetchSunsetSunrise = async (
    date: string,
    lat: number,
    lng: number
): Promise<SunsetSunrise | undefined> => {
    try {
        const res = (
            await weatherClient.get(
                `/B090041/openapi/service/RiseSetInfoService/getLCRiseSetInfo?locdate=${date}&longitude=${lng}&latitude=${lat}&dnYn=N&ServiceKey=${WEATHER_KEY}`
            )
        ).request.response;
        const { header, body } = JSON.parse(res).response;

        if (header.resultCode !== '00') {
            throw new Error(header.resultMsg);
        }

        return body.items.item;
    } catch (e) {
        console.error(e);
    }
};

export const fetchAirGrade = async (sidoName: string): Promise<AirPollution | undefined> => {
    try {
        const response = (
            await weatherClient.get(
                `/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${WEATHER_KEY}&returnType=json&numOfRows=1&pageNum=1&sidoName=${sidoName}&ver=1.0`
            )
        ).data.response;
        if (response?.header?.resultCode !== '00') {
            throw new Error(response.header.resultMsg);
        }
        return response?.body?.items[0];
    } catch (e) {
        console.error(e);
    }
};

interface SunsetSunrise {
    aste: string;
    astm: string;
    civile: string;
    civilm: string;
    latitude: string;
    latitudeNum: number;
    location: string;
    locdate: string;
    longitude: string;
    longitudeNum: number;
    moonrise: string;
    moonset: string;
    moontransit: string;
    naute: string;
    nautm: string;
    sunrise: string;
    sunset: string;
    suntransit: string;
}

interface AirPollution {
    so2Grade: number;
    coFlag: string;
    khaiValue: string;
    so2Value: string;
    coValue: string;
    pm25Flag: string;
    pm10Flag: string;
    o3Grade: number;
    pm10Value: string;
    khaiGrade: AirGrade;
    pm25Value: string;
    sidoName: string;
    no2Flag: string;
    no2Grade: number;
    o3Flag: string;
    pm25Grade: number;
    so2Flag: string;
    dataTime: string;
    coGrade: number;
    no2Value: string;
    stationName: string;
    pm10Grade: number;
    o3Value: string;
}
