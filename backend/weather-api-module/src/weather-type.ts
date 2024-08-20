export interface WeatherData {
    maxTemperature: number;
    minTemperature: number;
    temperature: number;
    sky: number;
    precipitation: number;
}

export type WeatherApiType = 'realtimeOneHour' | 'predicateDay' | 'predicateSixHour';

export type WeatherDataMap = {[key: string]: WeatherData};

export interface todayWeatherPredicate {
    baseDate: string;
    baseTime: string;
    category: string;
    fcstDate: string;
    fcstTime: string;
    fcstValue: string;
    nx: number;
    ny: number;
}
