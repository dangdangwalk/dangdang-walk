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
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const ansi_util_1 = require("../../utils/ansi.util");
const hash_util_1 = require("../../utils/hash.util");
const winstonLogger_service_1 = require("../logger/winstonLogger.service");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(logger) {
        this.logger = logger;
        logger = new winstonLogger_service_1.WinstonLoggerService();
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const userInfo = request.user || '';
        let user;
        if (userInfo.userId) {
            user = `UserID-${userInfo.userId}`;
        }
        else if (userInfo.oauthId) {
            user = `OAuthID-${userInfo.oauthId}`;
        }
        else {
            user = 'GUEST';
        }
        const requestId = (0, hash_util_1.generateUuid)();
        const { ip, method, path: url } = request;
        if (url === '/metrics') {
            return next.handle().pipe();
        }
        this.logger.log(`${(0, ansi_util_1.color)('REQUEST', 'Cyan')}  [ ${(0, ansi_util_1.bold)(method)} | ${(0, ansi_util_1.bold)(url)} | ${ip} | ${(0, ansi_util_1.italic)(user)} ] ${(0, ansi_util_1.color)(requestId, 'Black')}`);
        const startTime = Date.now();
        return next.handle().pipe((0, rxjs_1.tap)((res) => {
            const response = context.switchToHttp().getResponse();
            const { statusCode } = response;
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            let responseTimeColor = 'Yellow';
            if (responseTime > 1000) {
                responseTimeColor = 'Red';
            }
            this.logger.log(`${(0, ansi_util_1.color)('RESPONSE', 'Magenta')} [ ${(0, ansi_util_1.bold)(method)} | ${(0, ansi_util_1.bold)(url)} | ${ip} | ${statusCode} | ${(0, ansi_util_1.color)(`+${responseTime}ms`, responseTimeColor)} ] ${(0, ansi_util_1.color)(requestId, 'Black')}`);
            this.logger.debug('Response body', typeof res === 'object' ? { ...res } : { res });
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [winstonLogger_service_1.WinstonLoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map