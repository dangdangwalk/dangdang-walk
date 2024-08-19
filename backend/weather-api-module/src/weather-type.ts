export interface WeatherData {
    maxTemperature: number;
    minTemperature: number;
    temperature: number;
    sky: number;
    precipitation: number;
}

export type WeatherApiType ='realtimeOneHour' | 'predicateDay' | 'predicateSixHour'