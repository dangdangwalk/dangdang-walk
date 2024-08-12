"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("node:process");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
require("reflect-metadata");
const typeorm_transactional_1 = require("typeorm-transactional");
const app_module_1 = require("./app.module");
const settings_1 = require("./common/config/settings");
const winstonLogger_service_1 = require("./common/logger/winstonLogger.service");
async function bootstrap() {
    (0, typeorm_transactional_1.initializeTransactionalContext)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(new winstonLogger_service_1.WinstonLoggerService());
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://localhost:3000',
            'http://localhost:8080',
            'https://dangdangwalk.github.io',
            'https://dangdang-walk.xyz',
            'https://dangdang.surge.sh/',
        ],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    });
    app.use(cookieParser());
    const logger = app.get(common_1.Logger);
    await (async () => {
        await app.listen(settings_1.PORT, () => {
            logger.log(`Server running at http://${process.env.MYSQL_HOST}:${settings_1.PORT}`);
        });
    })();
}
bootstrap();
//# sourceMappingURL=main.js.map