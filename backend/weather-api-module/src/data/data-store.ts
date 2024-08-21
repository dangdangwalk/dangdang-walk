import { Redis } from 'ioredis';

import { getLogger } from '../logger/logger-factory';
import { WinstonLoggerService } from '../logger/winston-logger';
import { getCurrentTimeKey } from '../util';
import {
    OneHourRealWeatherDataMap,
    OneHourWeatherRealData,
    TodayWeatherPredicateData,
    TodayWeatherPredicateDataMap,
} from '../weather/weather-type';

export class DataStore {
    private readonly redis;
    private readonly logger: WinstonLoggerService;

    constructor(logger: WinstonLoggerService) {
        this.redis = new Redis({
            host: 'localhost',
            port: parseInt(process.env.PORT as string),
            db: 0,
        });
        this.logger = logger;
    }

    async updateRealData(nx: number, ny: number, data: OneHourWeatherRealData, timeKey: string): Promise<void> {
        const key = `weather:${nx}:${ny}`;

        const existingData = await this.redis.hget(key, timeKey);
        let updatedData: TodayWeatherPredicateData;

        if (existingData) {
            updatedData = { ...JSON.parse(existingData), ...data };
        } else {
            updatedData = {
                ...data,
                sky: 0,
                minTemperature: 0,
                maxTemperature: 0,
            };
        }
        await this.redis.hset(key, timeKey, JSON.stringify(updatedData));
    }

    async saveFullDayPredicate(nx: number, ny: number, fullDayPredicateDataList: TodayWeatherPredicateDataMap) {
        Object.entries(fullDayPredicateDataList).forEach(([time, weatherData]) => {
            const key = `weather:${nx}:${ny}`;
            this.redis.hset(key, time, JSON.stringify(weatherData));
        });
    }

    async updateOneHourReal(nx: number, ny: number, oneHourRealDataList: OneHourRealWeatherDataMap) {
        Object.entries(oneHourRealDataList).forEach(([time, data]) => {
            this.updateRealData(nx, ny, data, time);
        });
    }

    async getWeatherData(x: number, y: number): Promise<TodayWeatherPredicateData | null> {
        const key = `weather:${x}:${y}`;

        const timeKey = getCurrentTimeKey();
        const data = await this.redis.hget(key, timeKey);

        if (!data) return null;

        return JSON.parse(data);
    }

    async getKeys(pattern: string) {
        try {
            return await this.redis.keys(pattern);
        } catch (error) {
            this.logger.reportRedisErr('getKeys', error.message);
        }
    }
}

export function getDataInstance(): DataStore {
    return new DataStore(getLogger());
}
