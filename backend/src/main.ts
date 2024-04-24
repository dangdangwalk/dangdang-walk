import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './setting';
import * as process from 'node:process';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(PORT, () => {
    console.log(`Server running at http://${process.env.MYSQL_HOST}:${PORT}`);
  });
}

bootstrap();
