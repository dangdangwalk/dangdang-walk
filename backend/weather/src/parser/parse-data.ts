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
    private getMaxMinTemperature(weatherDataArr: TodayWeatherPredicateRaw[]) {
        const [minTemperature, maxTemperature] = weatherDataArr.filter((cur) => {
            return cur.category === 'TMN' || cur.category === 'TMX';
        });

        return {
            minTemperature: Number(minTemperature.fcstValue),
            maxTemperature: Number(maxTemperature.fcstValue),
        };
    }

    parse(weatherDataArr: TodayWeatherPredicateRaw[]): TodayWeatherPredicateDataMap {
        const consolidatedData: { [key: string]: TodayWeatherPredicateData } = {};
        const { minTemperature, maxTemperature } = this.getMaxMinTemperature(weatherDataArr);

        weatherDataArr.forEach((weatherData) => {
            const key = weatherData.fcstTime;
            if (!consolidatedData[key]) {
                consolidatedData[key] = {
                    temperature: 0,
                    sky: 0,
                    precipitation: 0,
                    minTemperature,
                    maxTemperature,
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
                    sky: 0,
                };
            }

            switch (weatherData.category) {
                case 'T1H':
                    consolidatedData[key].temperature = Number(weatherData.obsrValue);
                    break;
                case 'PTY':
                    consolidatedData[key].precipitation = Number(weatherData.obsrValue);
                    break;
                case 'SKY':
                    consolidatedData[key].sky = Number(weatherData.obsrValue);
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
