import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './setting';
import * as process from 'node:process';
import * as session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept',
    });

    app.use(
        session({
            secret: process.env.JWT_SECRET!,
            resave: false,
            saveUninitialized: false,
        })
    );

    await (async () => {
        await app.listen(PORT, () => {
            console.log(`Server running at http://${process.env.MYSQL_HOST}:${PORT}`);
        });
    })();
}

bootstrap();
