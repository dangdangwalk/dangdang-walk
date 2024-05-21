import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import stripAnsi from 'src/utils/ansi.util';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private readonly logger: winston.Logger;

    constructor() {
        const isDevelopment = process.env.NODE_ENV != 'prod';
        const logDir = path.join(process.cwd(), 'log');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const consoleLogFormat = winston.format.printf(({ timestamp, level, message }) => {
            const seoulTimestamp = new Date(timestamp).toLocaleString('ko-KR');
            return `${seoulTimestamp} | ${level}| ${message}`;
        });

        const fileLogFormat = winston.format.printf(({ timestamp, level, message }) => {
            const seoulTimestamp = new Date(timestamp).toLocaleString('ko-KR');
            return `${seoulTimestamp} | ${level}| ${stripAnsi(message)}`;
        });

        const consoleFormat = winston.format.combine(
            winston.format((info) => ({ ...info, level: info.level.toUpperCase().padEnd(7) }))(),
            winston.format.colorize(),
            winston.format.prettyPrint(),
            winston.format.timestamp(),
            consoleLogFormat
        );
        const consoleTransport = new winston.transports.Console({ format: consoleFormat });

        const fileTransport = new winstonDaily({
            filename: path.join(logDir, '%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format((info) => ({ ...info, level: info.level.toUpperCase().padEnd(7) }))(),
                winston.format.timestamp(),
                fileLogFormat
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
                winston.format((info) => ({ ...info, level: info.level.toUpperCase().padEnd(7) }))(),
                winston.format.timestamp(),
                fileLogFormat
            ),
        });

        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.json(),
            transports: isDevelopment
                ? [consoleTransport, fileTransport, errorFileTransport]
                : [fileTransport, errorFileTransport],
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, { trace });
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string, ...meta: any[]) {
        this.logger.debug(message, meta);
    }
}
