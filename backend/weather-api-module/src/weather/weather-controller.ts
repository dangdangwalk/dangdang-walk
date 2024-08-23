import { IncomingMessage, ServerResponse } from 'http';

import * as url from 'url';

import { getWeatherServiceInstance, WeatherService } from './weather-service';

import { getDataInstance } from '../data/data-factory';
import { DataStore } from '../data/data-store';
import { getLogger } from '../logger/logger-factory';
import { WinstonLoggerService } from '../logger/winston-logger';
import { getCurrentTimeKey } from '../util';

export class Controller {
    private dataStore: DataStore;
    private weatherService: WeatherService;
    private logger: WinstonLoggerService;

    constructor(dataStore: DataStore, weatherService: WeatherService, logger: WinstonLoggerService) {
        this.dataStore = dataStore;
        this.weatherService = weatherService;
        this.logger = logger;
    }

    public handleRequest(req: IncomingMessage, res: ServerResponse): void {
        const parsedUrl = url.parse(req.url || '', true);

        if (parsedUrl.pathname === '/weather/' && req.method === 'GET') {
            this.getWeather(req, res, parsedUrl.query);
        } else {
            this.notFound(req, res);
        }
    }

    private async getWeather(req: IncomingMessage, res: ServerResponse, query: any) {
        const start = Date.now();
        const { nx, ny } = query;

        if (!nx || !ny) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'nx 또는 ny가 없습니다' }));
            return;
        }
        this.logger.receiveRequest(req);

        try {
            let weatherData = await this.dataStore.getWeatherData(nx, ny);
            if (!weatherData) {
                const time = getCurrentTimeKey();
                await Promise.all([
                    this.weatherService.saveTodayWeatherPredicate(nx, ny),
                    this.weatherService.saveOneHourWeatherReal(nx, ny, time),
                ]);
                weatherData = await this.dataStore.getWeatherData(nx, ny);
            }
            const end = Date.now();
            const duration = end - start;
            this.logger.sendResponse(req, duration);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(weatherData));
        } catch (error) {
            const end = Date.now();
            const duration = end - start;
            this.logger.sendResponse(req, duration);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
            return;
        }
    }

    private notFound(req: IncomingMessage, res: ServerResponse): void {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ err: 'Not Found' }));
    }
}

export async function getControllerInstance() {
    return new Controller(await getDataInstance(), await getWeatherServiceInstance(), getLogger());
}
