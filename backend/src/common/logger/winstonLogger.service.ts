import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isDevelopment = process.env.NODE_ENV != 'production';
    const logDir = path.join(process.cwd(), 'log');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    console.log('logDir : ', logDir);
    console.log('isDevelopment: ', isDevelopment);

    const logFormat = winston.format.printf(({ timestamp, level, message }) => {
      const seoulTimestamp = new Date(timestamp).toLocaleString('ko-KR');
      return `[${level}] [${seoulTimestamp}] : ${message}`;
    });

    const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp(), logFormat);
    const consoleTransport = new winston.transports.Console({ format: consoleFormat });

    const fileTransport = new winstonDaily({
      filename: path.join(logDir, '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(winston.format.timestamp(), logFormat),
    });

    const errorFileTransport = new winstonDaily({
      filename: path.join(logDir, '%DATE%.error.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), logFormat),
    });

    this.logger = winston.createLogger({
      level: 'info',
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

  debug(message: string) {
    this.logger.debug(message);
  }
}
