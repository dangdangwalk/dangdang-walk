import { WeatherApiType } from './weather-type';

import { getDataInstance } from '../data/data-factory';
import { DataStore } from '../data/data-store';

import { HttpClient } from '../http/http-client';
import { getLogger } from '../logger/logger-factory';
import { WinstonLoggerService } from '../logger/winston-logger';
import { getRealWeatherOneHour, getTodayParserInstance, ParseData } from '../parser/parse-data';
import { PublicWeatherApiUrlBuilder } from '../public-weather-api-url/public-weather-api-url-builder';

type ParserMap = {
    [K in WeatherApiType]: ParseData<any, any>;
};

export class WeatherService {
    private readonly dataStore: DataStore;
    private readonly parsers: ParserMap;
    private readonly logger: WinstonLoggerService;

    constructor(dataStore: DataStore, parsers: ParserMap, logger: WinstonLoggerService) {
        this.dataStore = dataStore;
        this.parsers = parsers;
        this.logger = logger;
    }

    private buildUrl(nx: number, ny: number, baseTime: string, type: WeatherApiType): string {
        return new PublicWeatherApiUrlBuilder()
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

    private isValidResponse(data: any): boolean {
        return data && data.response && data.response.body && data.response.body.items && data.response.body.items.item;
    }

    async fetchAndParseData(nx: number, ny: number, time: string, type: WeatherApiType) {
        const data = await this.fetchWeatherData(nx, ny, time, type);

        if (!this.isValidResponse(data)) {
            if (data?.response?.header?.resultMsg === 'NO_DATA') {
                this.logger.info('예보 / 실황 데이터가 존재하지 않습니다');
                return;
            } else {
                this.logger.error(
                    `유효하지 않은 응답입니다. location : ${nx}:${ny}, time:${time}, response: ${JSON.stringify(data)}`,
                    null,
                );
                return;
            }
        }
        return this.parsers[type].parse(data.response.body.items.item);
    }

    async saveTodayWeatherPredicate(nx: number, ny: number) {
        try {
            const parsedData = await this.fetchAndParseData(nx, ny, '0200', 'predicateDay');
            this.dataStore.saveFullDayPredicate(nx, ny, parsedData);
            return parsedData;
        } catch (error) {
            this.logger.error(
                `하루 예보 저장에 실패했습니다. 지역 : ${nx}:${ny}, 에러 메세지 : ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    async saveOneHourWeatherReal(nx: number, ny: number, time: string) {
        try {
            const parsedData = await this.fetchAndParseData(nx, ny, time, 'realtimeOneHour');
            this.dataStore.updateOneHourReal(nx, ny, parsedData);
            return parsedData;
        } catch (error) {
            this.logger.error(
                `한시간 실황 저장에 실패했습니다. 지역 : ${nx}:${ny}, 에러 메세지 : ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}

export async function getWeatherServiceInstance() {
    const parsers: ParserMap = {
        predicateDay: getTodayParserInstance(),
        realtimeOneHour: getRealWeatherOneHour(),
    };
    return new WeatherService(await getDataInstance(), parsers, getLogger());
}
