import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonConfigForMain } from '@/config/winston.config';
import { applyGlobalConfig } from './config/nest-global.config';
import { setupSwagger } from './config/setup-swagger.config';

const SERVER_PORT = process.env.PORT || process.env.SERVER_PORT;

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfigForMain);

  const fastifyAdapter = new FastifyAdapter({ maxParamLength: 2048 });

  const app = await NestFactory.create<INestApplication>(
    AppModule,
    fastifyAdapter,
    { logger },
  );

  applyGlobalConfig(app);
  setupSwagger(app);

  await app.listen(SERVER_PORT, '0.0.0.0', () => {
    logger.log(`Listening at http://localhost:${SERVER_PORT}`);
    logger.log(`Swagger docs http://localhost:${SERVER_PORT}/docs`);
  });
}

bootstrap();
