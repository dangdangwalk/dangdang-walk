"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLoggerService = void 0;
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const ansi_util_1 = require("../../utils/ansi.util");
let WinstonLoggerService = class WinstonLoggerService {
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
        const consoleFormat = winston.format.combine(winston.format((info) => ({ ...info, level: info.level.toUpperCase().padEnd(7) }))(), winston.format.colorize(), winston.format.prettyPrint(), winston.format.timestamp(), consoleLogFormat);
        const consoleTransport = new winston.transports.Console({ format: consoleFormat });
        let transports;
        if (isTest) {
            transports = [
                new winston.transports.Console({
                    silent: true,
                }),
            ];
        }
        else {
            const fileTransport = new winstonDaily({
                filename: path.join(logDir, '%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: winston.format.combine(winston.format((info) => ({ ...info, message: (0, ansi_util_1.default)(info.message) }))(), winston.format.timestamp(), winston.format.json()),
            });
            const errorFileTransport = new winstonDaily({
                filename: path.join(logDir, '%DATE%.error.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'error',
                format: winston.format.combine(winston.format((info) => ({ ...info, message: (0, ansi_util_1.default)(info.message) }))(), winston.format.timestamp(), winston.format.json()),
            });
            if (isProduction) {
                transports = [fileTransport, errorFileTransport];
            }
            else {
                transports = [consoleTransport, fileTransport, errorFileTransport];
            }
        }
        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.json(),
            transports,
        });
    }
    log(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, meta) {
        this.logger.error(message, meta);
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
};
exports.WinstonLoggerService = WinstonLoggerService;
exports.WinstonLoggerService = WinstonLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WinstonLoggerService);
//# sourceMappingURL=winstonLogger.service.js.map