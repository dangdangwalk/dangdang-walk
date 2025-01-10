import * as fs from 'fs';
import * as path from 'path';

import stripAnsi from 'utils/ansi.util';
import { isProduction, isTest, directory } from 'utils/etc';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

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

    let transports;
    if (isTest) {
        transports = [
            new winston.transports.Console({
                silent: true,
            }),
        ];
    } else {
        const fileTransport = new winstonDaily({
            filename: path.join(directory, '%DATE%.log'),
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
            filename: path.join(directory, '%DATE%.error.log'),
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
