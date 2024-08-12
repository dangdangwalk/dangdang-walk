import * as process from 'node:process';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { PORT } from './common/config/settings';
import { WinstonLoggerService } from './common/logger/winstonLogger.service';

async function bootstrap() {
    initializeTransactionalContext();

    const app = await NestFactory.create(AppModule);

    app.useLogger(new WinstonLoggerService());

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

    const logger = app.get(Logger);

    await (async () => {
        await app.listen(PORT, () => {
            logger.log(`Server running at http://${process.env.MYSQL_HOST}:${PORT}`);
        });
    })();
}

bootstrap();
