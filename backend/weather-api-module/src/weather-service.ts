import { DataStore, getDataInstance } from './data-store';

import { HttpClient } from './http-client';
import { getParserInstance, ParseData } from './parse-data';
import { UrlBuilder } from './urlBuilder';
import { WeatherApiType, WeatherDataMap } from './weather-type';

export class WeatherService {
    private readonly dataStore;
    private readonly parser;

    constructor(dataStore: DataStore, parser: ParseData) {
        this.dataStore = dataStore;
        this.parser = parser;
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

    private parseWeatherData(data: any) {
        if (!this.isValidResponse(data)) throw new Error('Invalid API response structure');

        return this.parser.parseTodayWeatherPredicate(data.response.body.items.item);
    }

    private isValidResponse(data: any): boolean {
        return data && data.response && data.response.body && data.response.body.items && data.response.body.items.item;
    }

    async saveTodayWeatherPredicate(nx: number, ny: number) {
        try {
            const data = await this.fetchWeatherData(nx, ny, '0200', 'predicateDay');
            const parsedData: WeatherDataMap = this.parseWeatherData(data);
            this.dataStore.saveFullDayPredicate(nx, ny, parsedData);
        } catch (error) {
            console.error('Error in getTodayWeatherPredicate:', error);
            throw error;
        }
    }
}

export function getWeatherServiceInstance() {
    return new WeatherService(getDataInstance(), getParserInstance());
}
