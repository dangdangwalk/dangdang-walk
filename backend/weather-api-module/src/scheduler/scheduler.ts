import * as cron from 'node-cron';

import { DataStore } from '../data/data-store';
import { WinstonLoggerService } from '../logger/winston-logger';
import { getCurrentTimeKey } from '../util';
import { WeatherService } from '../weather/weather-service';

export class Scheduler {
    private readonly dataStore: DataStore;
    private readonly weatherService: WeatherService;
    private readonly logger: WinstonLoggerService;
    private static instance: Scheduler;

    constructor(dataStore: DataStore, weatherService: WeatherService, logger: WinstonLoggerService) {
        this.dataStore = dataStore;
        this.weatherService = weatherService;
        this.logger = logger;
    }

    public static async getInstance(): Promise<Scheduler> {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler(
                await DataStore.getInstance(),
                await WeatherService.getInstance(),
                WinstonLoggerService.getInstance(),
            );
        }
        return Scheduler.instance;
    }

    async getKeys(): Promise<string[]> {
        const keyArr: string[] = (await this.dataStore.getKeys('weather*')) as string[];
        return keyArr.map((cur) => cur.slice(cur.indexOf(':') + 1));
    }

    async scheduleTodayWeatherPredicate() {
        const keys = await this.getKeys();
        try {
            cron.schedule('0 0 23 * * *', async () => {
                const start = Date.now();
                await Promise.all(
                    keys.map(async (key) => {
                        const [nx, ny] = key.split(':');
                        this.weatherService.saveTodayWeatherPredicate(parseInt(nx), parseInt(ny));
                    }),
                );
                const end = Date.now();
                this.logger.cronJobFinished('predicateDay', keys.length, end - start);
            });
            this.logger.cronJobAdded('predicateDay', keys.length);
        } catch (error) {
            this.logger.error('CRON JOB FAILED | 하루 예보 저장에 실패했습니다.', error.stack);
        }
    }

    async scheduleOneHourRealWeatherPredicate() {
        const keys = await this.getKeys();
        const time = getCurrentTimeKey();
        try {
            cron.schedule('0 11 * * * *', async () => {
                const start = Date.now();
                Promise.all(
                    keys.map(async (key) => {
                        const [nx, ny] = key.split(':');
                        this.weatherService.saveOneHourWeatherReal(parseInt(nx), parseInt(ny), time);
                    }),
                );
                const end = Date.now();
                this.logger.cronJobFinished('realtimeOneHour', keys.length, end - start);
            });
            this.logger.cronJobAdded('realtimeOneHour', keys.length);
        } catch (error) {
            this.logger.error('CRON JOB FAILED | 한시간 실황 저장에 실패했습니다.', error.stack);
        }
    }

    async initializeScheduler() {
        this.scheduleOneHourRealWeatherPredicate();
        this.scheduleTodayWeatherPredicate();
    }
}
