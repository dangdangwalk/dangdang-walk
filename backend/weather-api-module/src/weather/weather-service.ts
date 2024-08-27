import { DataMap, DataValue, WeatherApiType } from './weather-type';

import { DataStore } from '../data/data-store';

import { HttpClient } from '../http/http-client';
import { NoDataError } from '../http/public-weather-error';
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
    private static instance: WeatherService;

    constructor(dataStore: DataStore, parsers: ParserMap, logger: WinstonLoggerService) {
        this.dataStore = dataStore;
        this.parsers = parsers;
        this.logger = logger;
    }

    public static async getInstance(): Promise<WeatherService> {
        if (!WeatherService.instance) {
            const parsers: ParserMap = {
                predicateDay: getTodayParserInstance(),
                realtimeOneHour: getRealWeatherOneHour(),
            };
            WeatherService.instance = new WeatherService(
                await DataStore.getInstance(),
                parsers,
                WinstonLoggerService.getInstance(),
            );
        }
        return WeatherService.instance;
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

    async fetchData(nx: number, ny: number, date: string, time: string, type: WeatherApiType) {
        const url = this.buildUrl(nx, ny, date, time, type);
        const data = await new HttpClient(url).fetchData();

        if (data?.response?.header?.resultCode !== '00') {
            if (data?.response?.header?.resultMsg === 'NO_DATA') {
                const errorMsg = '예보 / 실황 데이터가 존재하지 않습니다';
                throw new NoDataError(errorMsg);
            } else {
                const errorMsg = `유효하지 않은 응답입니다. location : ${nx}:${ny}, time:${time}, response: ${JSON.stringify(data)}`;
                this.logger.error(errorMsg, null);
                throw new Error(errorMsg);
            }
        }
        return data.response.body.items.item;
    }

    private isValidField(obj: DataValue, field: string): field is keyof DataValue {
        return field in obj;
    }

    async validateLocation(nx: number, ny: number, parsedData: DataMap) {
        const entries = Object.entries(parsedData);
        if (!entries) return;
        const [, value] = entries[0];
        const fields = Object.keys(value);

        for (const entry of entries) {
            const [, value] = entry;
            for (const field of fields) {
                if (this.isValidField(value, field))
                    if (value[field] < -900 || value[field] > 900) {
                        this.logger.info(`관측정보가 없는 지역입니다. 지역 리스트에서 제거합니다. ${nx}:${ny}`);
                        this.dataStore.deleteLocation(nx, ny);
                        return;
                    }
            }
        }
    }

    async saveTodayWeatherPredicate(nx: number, ny: number) {
        try {
            const start = Date.now();
            this.logger.sendRequest(nx, ny, 'predicateDay');

            const data = await this.fetchData(nx, ny, getYesterday(), '2300', 'predicateDay');

            const end = Date.now();
            this.logger.receiveResponse(nx, ny, 'predicateDay', end - start);

            const parsedData = this.parsers['predicateDay'].parse(data);
            this.dataStore.saveFullDayPredicate(nx, ny, parsedData);
            return parsedData;
        } catch (error) {
            if (error instanceof NoDataError) {
                this.logger.info(error.message);
                return;
            }
            this.logger.error(
                `하루 예보 저장에 실패했습니다. 지역 : ${nx}:${ny}, 에러 메세지 : ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    async saveOneHourWeatherReal(nx: number, ny: number, time: string) {
        try {
            const start = Date.now();
            this.logger.sendRequest(nx, ny, 'realtimeOneHour');

            const data = await this.fetchData(nx, ny, getToday(), time, 'realtimeOneHour');

            const end = Date.now();
            this.logger.receiveResponse(nx, ny, 'realtimeOneHour', end - start);

            const parsedData = this.parsers['realtimeOneHour'].parse(data);
            this.dataStore.updateOneHourReal(nx, ny, parsedData);
            await this.validateLocation(nx, ny, parsedData);
            return parsedData;
        } catch (error) {
            if (error instanceof NoDataError) {
                this.logger.info(error.message);
                return;
            }
            this.logger.error(
                `한시간 실황 저장에 실패했습니다. 지역 : ${nx}:${ny}, 에러 메세지 : ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}

export async function getWeatherServiceInstance() {}
