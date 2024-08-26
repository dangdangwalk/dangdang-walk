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
        cron.schedule('0 0 2 * * *', async () => {
            for (const key of keys) {
                const [x, y] = key.split(':');
                this.weatherService.saveTodayWeatherPredicate(parseInt(x), parseInt(y));
            }
        });
    }

    async scheduleOneHourRealWeatherPredicate() {
        const keys = await this.getKeys();
        const time = getCurrentTimeKey();
        try {
            cron.schedule('30 * * * * *', async () => {
                for (const key of keys) {
                    const [x, y] = key.split(':');
                    this.weatherService.saveOneHourWeatherReal(parseInt(x), parseInt(y), time);
                }
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    async initializeScheduler() {
        this.scheduleOneHourRealWeatherPredicate();
        this.scheduleTodayWeatherPredicate();
    }
}
