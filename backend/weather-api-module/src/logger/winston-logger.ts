import * as fs from 'fs';
import { IncomingMessage } from 'http';
import * as path from 'path';

import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

import stripAnsi, { bold, color } from './logger-util';

import { WeatherApiType } from '../weather/weather-type';

export class WinstonLoggerService {
    private readonly logger: winston.Logger;
    private static instance: WinstonLoggerService;

    constructor() {
        const isProduction = process.env.NODE_ENV === 'prod';
        const isTest = process.env.NODE_ENV === 'test';

        const logDir = path.join(process.cwd(), 'log');
        if (!isTest && !fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const consoleLogFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const seoulTimestamp = new Date(timestamp).toLocaleString('ko-KR');
            const metaString = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
            return `${seoulTimestamp} | ${level}| ${message}${metaString}`;
        });

        const consoleFormat = winston.format.combine(
            winston.format((info) => ({ ...info, level: info.level.toUpperCase().padEnd(7) }))(),
            winston.format.colorize(),
            winston.format.prettyPrint(),
            winston.format.timestamp(),
            consoleLogFormat,
        );
        const consoleTransport = new winston.transports.Console({ format: consoleFormat });

        let transports;
        if (isTest) {
            // 최소한의 transport 사용
            transports = [
                new winston.transports.Console({
                    silent: true,
                }),
            ];
        } else {
            const fileTransport = new winstonDaily({
                filename: path.join(logDir, '%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: winston.format.combine(
                    winston.format((info) => ({ ...info, message: stripAnsi(info.message) }))(),
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
            });

            const errorFileTransport = new winstonDaily({
                filename: path.join(logDir, '%DATE%.error.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'error',
                format: winston.format.combine(
                    winston.format((info) => ({ ...info, message: stripAnsi(info.message) }))(),
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
            });

            if (isProduction) {
                transports = [fileTransport, errorFileTransport];
            } else {
                transports = [consoleTransport, fileTransport, errorFileTransport];
            }
        }

        this.logger = winston.createLogger({
            //level: isProduction ? 'info' : 'debug',
            level: 'debug',
            transports,
        });
    }

    public static getInstance(): WinstonLoggerService {
        if (!WinstonLoggerService.instance) {
            WinstonLoggerService.instance = new WinstonLoggerService();
        }
        return WinstonLoggerService.instance;
    }
    info(message: string, meta?: any) {
        this.logger.info(message, meta);
    }

    error(message: string, meta: any) {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: any) {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any) {
        this.logger.debug(message, meta);
    }

    //custom function
    cronJobAdded = function (type: WeatherApiType, locationNum: number): void {
        const dataType = type === 'predicateDay' ? '하루 예보 데이터' : '한시간 실황 데이터';
        this.info(
            `${color('CRON JOB ADDED', 'Green')} [ ${`${dataType}에 대한 CRON JOB이 등록되었습니다`} | 지역 갯수: ${locationNum}]`,
        );
    };

    cronJobFinished = function (type: WeatherApiType, locationNum: number, duration: number): void {
        const dataType = type === 'predicateDay' ? '하루 예보 데이터' : '한시간 실황 데이터';
        this.info(
            `${color('CRON JOB FINISHED', 'Green')} [ ${bold(dataType)} | 지역 갯수 : ${locationNum} | ${color(`+${duration}ms`, 'Yellow')}]`,
        );
    };

    receiveRequest = function (req: IncomingMessage): void {
        this.info(
            `${color('RECEIVED REQUEST', 'Cyan')}  [ ${bold(req.method as string)} | ${bold(req.url as string)} | ${req.socket.remoteAddress}]`,
        );
        return;
    };

    sendResponse = function (req: IncomingMessage, responseTime: number): void {
        this.logger.info(
            `${color('   SEND RESPONSE ', 'Magenta')} [ ${bold(req.method as string)} | ${bold(req.url as string)} | ${req.socket.remoteAddress} | ${req.statusCode} | ${color(`+${responseTime}ms`, 'Yellow')}]`,
        );
    };

    sendRequest = function (nx: number, ny: number, type: WeatherApiType): void {
        const apiType = type == 'predicateDay' ? '하루 예보' : '한시간 실황';

        this.info(`${color('   SEND REQUEST', 'Cyan')}  [ ${bold(apiType)} | ${bold(`지역: ${nx}:${ny}`)} ]`);
        return;
    };

    receiveResponse = function (nx: number, ny: number, type: WeatherApiType, duration: number): void {
        const apiType = type == 'predicateDay' ? '하루 예보' : '한시간 실황';

        this.info(
            `${color('RECEIVED RESPONSE', 'Cyan')}  [ ${bold(apiType)} | ${bold(`지역: ${nx}:${ny}`)} |  ${color(`+${duration}ms`, 'Yellow')}]`,
        );
        return;
    };

    reportRedisErr = function (method: string, error: any): void {
        this.error(`Redis error : Failed to excute a ${method} | ${error.message}`, error.stack);
    };
}
