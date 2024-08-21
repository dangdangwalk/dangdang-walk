import {
    OneHourWeatherRealRaw,
    TodayWeatherPredicateRaw,
    TodayWeatherPredicateData,
    TodayWeatherPredicateDataMap,
    OneHourRealWeatherDataMap,
} from '../weather/weather-type';
export interface ParseData<T, U> {
    parse(data: T): U;
}

export class parseTodayWeatherPredicate implements ParseData<TodayWeatherPredicateRaw[], TodayWeatherPredicateDataMap> {
    parse(weatherDataList: TodayWeatherPredicateRaw[]): TodayWeatherPredicateDataMap {
        const consolidatedData: { [key: string]: TodayWeatherPredicateData } = {};

        weatherDataList.forEach((weatherData) => {
            const key = weatherData.fcstTime;
            if (!consolidatedData[key]) {
                consolidatedData[key] = {
                    temperature: 0,
                    sky: 0,
                    precipitation: 0,
                    minTemperature: 0,
                    maxTemperature: 0,
                };
            }

            switch (weatherData.category) {
                case 'TMP':
                    consolidatedData[key].temperature = Number(weatherData.fcstValue);
                    break;
                case 'SKY':
                    consolidatedData[key].sky = Number(weatherData.fcstValue);
                    break;
                case 'PTY':
                    consolidatedData[key].precipitation = Number(weatherData.fcstValue);
                    break;
                case 'TMN':
                    consolidatedData[key].minTemperature = Number(weatherData.fcstValue);
                    break;
                case 'TMX':
                    consolidatedData[key].maxTemperature = Number(weatherData.fcstValue);
                    break;
            }
        });

        return consolidatedData;
    }
}

export class parseRealWeatherOneHour implements ParseData<OneHourWeatherRealRaw[], OneHourRealWeatherDataMap> {
    parse(weatherDataList: OneHourWeatherRealRaw[]): OneHourRealWeatherDataMap {
        const consolidatedData: OneHourRealWeatherDataMap = {};

        weatherDataList.forEach((weatherData) => {
            const key = weatherData.baseTime;
            if (!consolidatedData[key]) {
                consolidatedData[key] = {
                    temperature: 0,
                    precipitation: 0,
                };
            }

            switch (weatherData.category) {
                case 'T1H':
                    consolidatedData[key].temperature = Number(weatherData.obsrValue);
                    break;
                case 'PTY':
                    consolidatedData[key].precipitation = Number(weatherData.obsrValue);
                    break;
            }
        });

        return consolidatedData;
    }
}

export function getTodayParserInstance(): ParseData<TodayWeatherPredicateRaw[], TodayWeatherPredicateDataMap> {
    return new parseTodayWeatherPredicate();
}

export function getRealWeatherOneHour(): ParseData<OneHourWeatherRealRaw[], OneHourRealWeatherDataMap> {
    return new parseRealWeatherOneHour();
}
