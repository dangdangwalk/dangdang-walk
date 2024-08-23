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
    private redis: Redis;
    private readonly logger: WinstonLoggerService;
    private readonly maxRetry = 5;
    private readonly retryDelay = 3000;

    constructor(logger: WinstonLoggerService) {
        this.logger = logger;
    }

    async initialize() {
        const retries = 0;
        let redis: Redis | null = null;
        while (retries < this.maxRetry && !this.redis) {
            redis = new Redis({
                host: 'localhost',
                port: parseInt(process.env.REDIS_PORT as string),
                db: 0,
                maxRetriesPerRequest: 5,
                retryStrategy: (times: number) => {
                    if (times >= this.maxRetry) {
                        return null;
                    }
                    return this.retryDelay;
                },
            });

            redis.on('error', async (error) => {
                this.logger.error(`Redis와 연결에 실패했습니다. ${error.message}`, error.stack);
            });

            await redis.ping();
            this.logger.info(`Redis와 연결에 성공했습니다. PORT: ${process.env.REDIS_PORT}`);
            this.redis = redis;
        }
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

export function getDataStore(): DataStore {
    return new DataStore(getLogger());
}
