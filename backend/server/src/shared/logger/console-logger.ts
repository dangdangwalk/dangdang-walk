import * as fs from 'fs';
import * as path from 'path';

import * as winston from 'winston';

import * as winstonDaily from 'winston-daily-rotate-file';

import stripAnsi from '../utils/ansi.util';
import { isProduction, isTest, directory } from '../utils/etc';

export function createLogger(): winston.Logger {
    if (!(isTest || fs.existsSync(directory))) {
        fs.mkdirSync(directory, { recursive: true });
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

    const transports: any[] = [];

    if (isTest) {
        transports.push(
            new winston.transports.Console({
                silent: true,
            }),
        );
    }

    const commonTransportOptions = {
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
            winston.format((info) => ({ ...info, message: stripAnsi(info.message) }))(),
            winston.format.timestamp(),
            winston.format.json(),
        ),
    };

    const fileTransport = new winstonDaily({
        filename: path.join(directory, '%DATE%.log'),
        ...commonTransportOptions,
    });

    const errorFileTransport = new winstonDaily({
        filename: path.join(directory, '%DATE%.error.log'),
        level: 'error',
        ...commonTransportOptions,
    });

    if (isProduction) {
        transports.push(fileTransport, errorFileTransport);
    } else {
        transports.push(consoleTransport, fileTransport, errorFileTransport);
    }

    const logger = winston.createLogger({
        level: 'debug',
        format: winston.format.json(),
        transports,
    });

    return logger;
}
