export type WeatherApiType = 'realtimeOneHour' | 'predicateDay';

export interface TodayWeatherPredicateRaw {
    baseDate: string;
    baseTime: string;
    category: string;
    fcstDate: string;
    fcstTime: string;
    fcstValue: string;
    nx: number;
    ny: number;
}

export interface OneHourWeatherRealRaw {
    baseDate: string;
    baseTime: string;
    category: string;
    obsrValue: string;
    nx: number;
    ny: number;
}

export interface TodayWeatherPredicateData {
    maxTemperature: number;
    minTemperature: number;
    temperature: number;
    sky: number;
    precipitation: number;
}

export interface OneHourWeatherRealData {
    temperature: number;
    precipitation: number;
}

export type TodayWeatherPredicateDataMap = { [key: string]: TodayWeatherPredicateData };
export type OneHourRealWeatherDataMap = { [key: string]: OneHourWeatherRealData };
