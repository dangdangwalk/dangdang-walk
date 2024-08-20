import { todayWeatherPredicate, WeatherData, WeatherDataMap } from './weather-type';

export class ParseData {
    parseTodayWeatherPredicate(weatherDataList: todayWeatherPredicate[]): WeatherDataMap {
        const consolidatedData: { [key: string]: WeatherData } = {};

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

export function getParserInstance(): ParseData {
    return new ParseData();
}
