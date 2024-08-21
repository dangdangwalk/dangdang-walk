import { DataStore, getDataInstance } from './data-store';

import { HttpClient } from './http-client';
import { getRealWeatherOneHour, getTodayParserInstance, ParseData } from './parse-data';
import { UrlBuilder } from './urlBuilder';
import { getCurrentTimeKey } from './util';
import { WeatherApiType } from './weather-type';

type ParserMap = {
    [K in WeatherApiType]: ParseData<any, any>;
};

export class WeatherService {
    private readonly dataStore: DataStore;
    private readonly parsers: ParserMap;

    constructor(dataStore: DataStore, parsers: ParserMap) {
        this.dataStore = dataStore;
        this.parsers = parsers;
    }

    private buildUrl(nx: number, ny: number, baseTime: string, type: WeatherApiType): string {
        return new UrlBuilder()
            .setApiType(type)
            .setNumOfRows(260)
            .setPageNo(1)
            .setBaseTime(baseTime)
            .setLocation(nx, ny)
            .build()
            .toString();
    }

    private async fetchWeatherData(nx: number, ny: number, baseTime: string, type: WeatherApiType) {
        const url = this.buildUrl(nx, ny, baseTime, type);
        return await new HttpClient(url).fetchData();
    }

    private parseWeatherData(data: any, type: WeatherApiType) {
        if (!this.isValidResponse(data)) throw new Error('Invalid API response structure');

        return this.parsers[type].parse(data.response.body.items.item);
    }

    private isValidResponse(data: any): boolean {
        return data && data.response && data.response.body && data.response.body.items && data.response.body.items.item;
    }

    async fetchAndParseData(nx: number, ny: number, time: string, type: WeatherApiType) {
        const data = await this.fetchWeatherData(nx, ny, time, type);
        return this.parseWeatherData(data, type);
    }

    async saveTodayWeatherPredicate(nx: number, ny: number) {
        try {
            const parsedData = await this.fetchAndParseData(nx, ny, '0200', 'predicateDay');

            this.dataStore.saveFullDayPredicate(nx, ny, parsedData);
        } catch (error) {
            console.error('Error in getTodayWeatherPredicate:', error);
            throw error;
        }
    }

    async saveOneHourWeatherReal(nx: number, ny: number) {
        try {
            const time = getCurrentTimeKey();
            const parsedData = await this.fetchAndParseData(nx, ny, time, 'realtimeOneHour');

            this.dataStore.updateOneHourReal(nx, ny, parsedData);
        } catch (error) {
            console.error('Error in saveOneHourWeatherReal:', error);
        }
    }
}

export function getWeatherServiceInstance() {
    const parsers: ParserMap = {
        predicateDay: getTodayParserInstance(),
        realtimeOneHour: getRealWeatherOneHour(),
    };
    return new WeatherService(getDataInstance(), parsers);
}
