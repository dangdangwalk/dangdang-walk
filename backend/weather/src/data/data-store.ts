import { Redis } from 'ioredis';

import { WinstonLoggerService } from '../logger/winston-logger';
import { getCurrentTimeKey } from '../util';
import {
    OneHourRealWeatherDataMap,
    OneHourWeatherRealData,
    TodayWeatherPredicateData,
    TodayWeatherPredicateDataMap,
} from '../weather/weather-type';

export class DataStore {
    private static instance: DataStore;
    private redis: Redis;
    private readonly logger: WinstonLoggerService;
    private readonly maxRetry = 5;
    private readonly retryDelay = 3000;

    constructor(logger: WinstonLoggerService) {
        this.logger = logger;
    }

    public static async getInstance(): Promise<DataStore> {
        if (!DataStore.instance) {
            DataStore.instance = new DataStore(WinstonLoggerService.getInstance());
        }
        await DataStore.instance.initialize();
        return DataStore.instance;
    }

    async initialize() {
        const retries = 0;
        let redis: Redis | null = null;
        while (retries < this.maxRetry && !this.redis) {
            redis = new Redis({
                host: process.env.REDIS_HOST,
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
                this.logger.error(`Redis와 연결에 실패했습니다. ${error}`, error.stack);
            });

            await redis.ping();
            this.logger.info(`Redis와 연결에 성공했습니다. PORT: ${process.env.REDIS_PORT}`);
            this.redis = redis;
        }
    }

    async updateRealData(nx: number, ny: number, data: OneHourWeatherRealData, timeKey: string): Promise<void> {
        try {
            const key = this.generateKey(nx, ny);
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
        } catch (error) {
            this.logger.reportRedisErr('updateRealData', error);
        }
    }

    async saveFullDayPredicate(nx: number, ny: number, fullDayPredicateDataList: TodayWeatherPredicateDataMap) {
        try {
            Object.entries(fullDayPredicateDataList).forEach(([time, weatherData]) => {
                this.redis.hset(this.generateKey(nx, ny), time, JSON.stringify(weatherData));
            });
        } catch (error) {
            this.logger.reportRedisErr('saveFullDayPredicate', error);
        }
    }

    async updateOneHourReal(nx: number, ny: number, oneHourRealDataList: OneHourRealWeatherDataMap) {
        try {
            Object.entries(oneHourRealDataList).forEach(([time, data]) => {
                this.updateRealData(nx, ny, data, time);
            });
        } catch (error) {
            this.logger.reportRedisErr('updateOneHourReal', error);
        }
    }

    async getWeatherData(nx: number, ny: number): Promise<TodayWeatherPredicateData | null> {
        try {
            const timeKey = getCurrentTimeKey();
            const data = await this.redis.hget(this.generateKey(nx, ny), timeKey);

            if (!data) return null;

            return JSON.parse(data);
        } catch (error) {
            this.logger.reportRedisErr('getWeatherData', error);
            return null;
        }
    }

    async getKeys(pattern: string) {
        try {
            return await this.redis.keys(pattern);
        } catch (error) {
            this.logger.reportRedisErr('getKeys', error);
        }
    }

    async deleteLocation(nx: number, ny: number) {
        try {
            await this.redis.del(this.generateKey(nx, ny));
        } catch (error) {
            this.logger.reportRedisErr('deleteKeys', error);
        }
    }

    private generateKey(nx: number, ny: number): string {
        return `weather:${nx}:${ny}`;
    }
}
