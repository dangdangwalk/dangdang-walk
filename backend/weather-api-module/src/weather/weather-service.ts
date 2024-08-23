import { WeatherApiType } from './weather-type';

import { getDataInstance } from '../data/data-factory';
import { DataStore } from '../data/data-store';

import { HttpClient } from '../http/http-client';
import { getLogger } from '../logger/logger-factory';
import { WinstonLoggerService } from '../logger/winston-logger';
import { getRealWeatherOneHour, getTodayParserInstance, ParseData } from '../parser/parse-data';
import { PublicWeatherApiUrlBuilder } from '../public-weather-api-url/public-weather-api-url-builder';
import { getToday, getYesterday } from '../util';

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

    private buildUrl(nx: number, ny: number, baseDate: string, baseTime: string, type: WeatherApiType): string {
        return new PublicWeatherApiUrlBuilder()
            .setApiType(type)
            .setNumOfRows(290)
            .setPageNo(1)
            .setBaseDate(baseDate)
            .setBaseTime(baseTime)
            .setLocation(nx, ny)
            .build()
            .toString();
    }

    private isValidResponse(data: any): boolean {
        return data && data.response && data.response.body && data.response.body.items && data.response.body.items.item;
    }

    async fetchData(nx: number, ny: number, date: string, time: string, type: WeatherApiType) {
        const url = this.buildUrl(nx, ny, date, time, type);
        const data = await new HttpClient(url).fetchData();

        if (!this.isValidResponse(data)) {
            if (data?.response?.header?.resultMsg === 'NO_DATA') {
                const errorMsg = '예보 / 실황 데이터가 존재하지 않습니다';
                this.logger.info(errorMsg);
                throw new Error(errorMsg);
            } else {
                const errorMsg = `유효하지 않은 응답입니다. location : ${nx}:${ny}, time:${time}, response: ${JSON.stringify(data)}`;
                this.logger.error(errorMsg, null);
                throw new Error(errorMsg);
            }
        }
        return data.response.body.items.item;
    }

    async saveTodayWeatherPredicate(nx: number, ny: number) {
        try {
            const data = await this.fetchData(nx, ny, getYesterday(), '2300', 'predicateDay');
            const parsedData = this.parsers['predicateDay'].parse(data);
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
            const data = await this.fetchData(nx, ny, getToday(), time, 'realtimeOneHour');
            const parsedData = this.parsers['realtimeOneHour'].parse(data);
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
