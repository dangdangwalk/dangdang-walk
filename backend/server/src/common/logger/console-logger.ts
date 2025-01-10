import * as fs from 'fs';
import * as path from 'path';

import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

import stripAnsi from '../../utils/ansi.util';

export function createLogger(): winston.Logger {
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

    return winston.createLogger({
        level: 'debug',
        format: winston.format.json(),
        transports,
    });
}
