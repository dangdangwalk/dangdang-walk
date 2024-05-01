import * as session from 'express-session';
import * as process from 'node:process';
import { INestApplication } from '@nestjs/common';

/**
 * 지정된 NestJS 애플리케이션에 대한 세션 미들웨어를 설정합니다.
 *
 * @param app - NestJS 애플리케이션 인스턴스입니다.
 */
export const setupSession = (app: INestApplication<any>) => {
    app.use(
        session({
            secret: process.env.JWT_SECRET!,
            resave: false,
            saveUninitialized: false,
        })
    );
};
