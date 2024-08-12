"use strict";
Object.defineProperty(exports, "LoggingInterceptor", {
    enumerable: true,
    get: function() {
        return LoggingInterceptor;
    }
});
const _common = require("@nestjs/common");
const _rxjs = require("rxjs");
const _ansiutil = require("../../utils/ansi.util");
const _hashutil = require("../../utils/hash.util");
const _winstonLoggerservice = require("../logger/winstonLogger.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const userInfo = request.user || '';
        let user;
        if (userInfo.userId) {
            user = `UserID-${userInfo.userId}`;
        } else if (userInfo.oauthId) {
            user = `OAuthID-${userInfo.oauthId}`;
        } else {
            user = 'GUEST';
        }
        const requestId = (0, _hashutil.generateUuid)();
        const { ip, method, path: url } = request;
        if (url === '/metrics') {
            return next.handle().pipe();
        }
        this.logger.log(`${(0, _ansiutil.color)('REQUEST', 'Cyan')}  [ ${(0, _ansiutil.bold)(method)} | ${(0, _ansiutil.bold)(url)} | ${ip} | ${(0, _ansiutil.italic)(user)} ] ${(0, _ansiutil.color)(requestId, 'Black')}`);
        const startTime = Date.now();
        return next.handle().pipe((0, _rxjs.tap)((res)=>{
            const response = context.switchToHttp().getResponse();
            const { statusCode } = response;
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            let responseTimeColor = 'Yellow';
            if (responseTime > 1000) {
                responseTimeColor = 'Red';
            }
            this.logger.log(`${(0, _ansiutil.color)('RESPONSE', 'Magenta')} [ ${(0, _ansiutil.bold)(method)} | ${(0, _ansiutil.bold)(url)} | ${ip} | ${statusCode} | ${(0, _ansiutil.color)(`+${responseTime}ms`, responseTimeColor)} ] ${(0, _ansiutil.color)(requestId, 'Black')}`);
            this.logger.debug('Response body', typeof res === 'object' ? {
                ...res
            } : {
                res
            });
        }));
    }
    constructor(logger){
        this.logger = logger;
        logger = new _winstonLoggerservice.WinstonLoggerService();
    }
};
LoggingInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], LoggingInterceptor);

//# sourceMappingURL=logging.interceptor.js.map