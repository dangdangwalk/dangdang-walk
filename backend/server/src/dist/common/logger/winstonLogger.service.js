"use strict";
Object.defineProperty(exports, "WinstonLoggerService", {
    enumerable: true,
    get: function() {
        return WinstonLoggerService;
    }
});
const _fs = require("fs");
const _path = require("path");
const _common = require("@nestjs/common");
const _winston = require("winston");
const _winstondailyrotatefile = require("winston-daily-rotate-file");
const _ansiutil = require("../../utils/ansi.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WinstonLoggerService = class WinstonLoggerService {
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
    constructor(){
        const isProduction = process.env.NODE_ENV === 'prod';
        const isTest = process.env.NODE_ENV === 'test';
        const logDir = _path.join(process.cwd(), 'log');
        if (!isTest && !_fs.existsSync(logDir)) {
            _fs.mkdirSync(logDir, {
                recursive: true
            });
        }
        const consoleLogFormat = _winston.format.printf(({ timestamp, level, message, ...meta })=>{
            const seoulTimestamp = new Date(timestamp).toLocaleString('ko-KR');
            const metaString = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
            return `${seoulTimestamp} | ${level}| ${message}${metaString}`;
        });
        const consoleFormat = _winston.format.combine(_winston.format((info)=>({
                ...info,
                level: info.level.toUpperCase().padEnd(7)
            }))(), _winston.format.colorize(), _winston.format.prettyPrint(), _winston.format.timestamp(), consoleLogFormat);
        const consoleTransport = new _winston.transports.Console({
            format: consoleFormat
        });
        let transports;
        if (isTest) {
            // 최소한의 transport 사용
            transports = [
                new _winston.transports.Console({
                    silent: true
                })
            ];
        } else {
            const fileTransport = new _winstondailyrotatefile({
                filename: _path.join(logDir, '%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: _winston.format.combine(_winston.format((info)=>({
                        ...info,
                        message: (0, _ansiutil.default)(info.message)
                    }))(), _winston.format.timestamp(), _winston.format.json())
            });
            const errorFileTransport = new _winstondailyrotatefile({
                filename: _path.join(logDir, '%DATE%.error.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'error',
                format: _winston.format.combine(_winston.format((info)=>({
                        ...info,
                        message: (0, _ansiutil.default)(info.message)
                    }))(), _winston.format.timestamp(), _winston.format.json())
            });
            if (isProduction) {
                transports = [
                    fileTransport,
                    errorFileTransport
                ];
            } else {
                transports = [
                    consoleTransport,
                    fileTransport,
                    errorFileTransport
                ];
            }
        }
        this.logger = _winston.createLogger({
            level: isProduction ? 'info' : 'debug',
            format: _winston.format.json(),
            transports
        });
    }
};
WinstonLoggerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], WinstonLoggerService);

//# sourceMappingURL=winstonLogger.service.js.map