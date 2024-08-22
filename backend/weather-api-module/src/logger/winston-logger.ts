import * as fs from 'fs';
import { IncomingMessage } from 'http';
import * as path from 'path';

import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

import stripAnsi, { bold, color } from './logger-util';

export class WinstonLoggerService {
    private readonly logger: winston.Logger;

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
            format: winston.format.json(),
            transports,
        });
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
    receiveRequest = function (req: IncomingMessage): void {
        this.info(
            `${color('RECEIVED REQUEST', 'Cyan')}  [ ${bold(req.method as string)} | ${bold(req.url as string)} | ${req.socket.remoteAddress}]}`,
        );
        return;
    };

    sendResponse = function (req: IncomingMessage, responseTime: number): void {
        this.logger.info(
            `${color('   SEND RESPONSE', 'Magenta')} [ ${bold(req.method as string)} | ${bold(req.url as string)} | ${req.socket.remoteAddress} | ${req.statusCode} | ${color(`+${responseTime}ms`, 'Yellow')}]`,
        );
    };

    reportRedisErr = function (method: string, err: string): void {
        this.error(`Redis error : Failed to excute a ${method} | ${err}`);
    };
}
