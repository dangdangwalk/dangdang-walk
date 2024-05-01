import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/settings';
import * as process from 'node:process';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.CORS_ORIGIN,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept',
        credentials: true,
    });

    await (async () => {
        await app.listen(PORT, () => {
            console.log(`Server running at http://${process.env.MYSQL_HOST}:${PORT}`);
        });
    })();
}

bootstrap();
