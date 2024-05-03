import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/settings';
import * as process from 'node:process';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.CORS_ORIGIN,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    });

    app.use(cookieParser());

    await (async () => {
        await app.listen(PORT, () => {
            console.log(`Server running at http://${process.env.MYSQL_HOST}:${PORT}`);
        });
    })();
}

bootstrap();
