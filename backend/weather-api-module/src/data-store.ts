import { Redis } from 'ioredis';

import { WeatherData, WeatherDataMap } from './weather-type';

export class DataStore {
    private readonly redis;

    constructor() {
        this.redis = new Redis({
            host: 'localhost',
            port: parseInt(process.env.PORT as string),
            db: 0,
        });
    }

    private getTimeKey(time: string): string {
        const hour = time.substring(0, 2);
        const minute = Math.floor(parseInt(time.substring(2)) / 10) * 10;
        return `${hour}${minute.toString().padStart(2, '0')}`;
    }

    private getCurrentTimeKey(): string {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = Math.floor(now.getMinutes() / 10) * 10;
        return `${hour}${minute.toString().padStart(2, '0')}`;
    }

    async saveWeatherDataOneHour(x: number, y: number, data: WeatherData, time: string): Promise<void> {
        const baseTimeKey = this.getTimeKey(time);
        const key = `weather:${x}:${y}`;

        for (let i = 0; i < 6; i++) {
            const minute = i * 10;
            const timeKey = `${baseTimeKey.substring(0, 2)}${minute.toString().padStart(2, '0')}`;
            await this.redis.hset(key, timeKey, JSON.stringify(data));
        }
    }

    async saveFullDayPredicate(nx: number, ny: number, fullDayPredicateDataList: WeatherDataMap) {
        Object.entries(fullDayPredicateDataList).forEach(([time, weatherData]) => {
            this.saveWeatherDataOneHour(nx, ny, weatherData as WeatherData, time);
        });
    }

    async getWeatherData(x: number, y: number): Promise<WeatherData | null> {
        const key = `weather:${x}:${y}`;

        const timeKey = this.getCurrentTimeKey();
        const data = await this.redis.hget(key, timeKey);

        if (!data) return null;

        return JSON.parse(data);
    }

}

export function getDataInstance(): DataStore {
    return new DataStore();
}