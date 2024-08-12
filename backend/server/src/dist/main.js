"use strict";
const _nodeprocess = require("node:process");
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _cookieparser = require("cookie-parser");
require("reflect-metadata");
const _typeormtransactional = require("typeorm-transactional");
const _appmodule = require("./app.module");
const _settings = require("./common/config/settings");
const _winstonLoggerservice = require("./common/logger/winstonLogger.service");
async function bootstrap() {
    (0, _typeormtransactional.initializeTransactionalContext)();
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    app.useLogger(new _winstonLoggerservice.WinstonLoggerService());
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://localhost:3000',
            'http://localhost:8080',
            'https://dangdangwalk.github.io',
            'https://dangdang-walk.xyz',
            'https://dangdang.surge.sh/'
        ],
        methods: [
            'GET',
            'HEAD',
            'PUT',
            'PATCH',
            'POST',
            'DELETE',
            'OPTIONS'
        ],
        allowedHeaders: [
            'Content-Type',
            'Accept',
            'Authorization'
        ],
        credentials: true
    });
    app.use(_cookieparser());
    const logger = app.get(_common.Logger);
    await (async ()=>{
        await app.listen(_settings.PORT, ()=>{
            logger.log(`Server running at http://${_nodeprocess.env.MYSQL_HOST}:${_settings.PORT}`);
        });
    })();
}
bootstrap();

//# sourceMappingURL=main.js.map