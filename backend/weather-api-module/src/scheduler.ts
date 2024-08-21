import * as cron from 'node-cron';

import { DataStore, getDataInstance } from './data-store';
import { getCurrentTimeKey } from './util';
import { getWeatherServiceInstance, WeatherService } from './weather-service';

export class Scheduler {
    private readonly dataStore: DataStore;
    private readonly weatherService: WeatherService;

    constructor(dataStore: DataStore, weatherService: WeatherService) {
        this.dataStore = dataStore;
        this.weatherService = weatherService;
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
        console.log('하루 예보 데이터에 대한 cron job이 등록되었습니다. 지역 갯수 : ', keys.length);
    }

    async scheduleOneHourRealWeatherPredicate() {
        const keys = await this.getKeys();
        const time = getCurrentTimeKey();
        cron.schedule('0 1 * * * *', async () => {
            for (const key of keys) {
                const [x, y] = key.split(':');
                this.weatherService.saveOneHourWeatherReal(parseInt(x), parseInt(y), time);
            }
        });
        console.log('한시간 실황 데이터에 대한 cron job이 등록되었습니다. 지역 갯수 : ', keys.length);
    }
}

export function getSchedulerInstance() {
    return new Scheduler(getDataInstance(), getWeatherServiceInstance());
}
