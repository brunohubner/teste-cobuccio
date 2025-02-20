import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import helmet from 'helmet';
import { JsonapiExceptionFilter } from '@/shared/filters/json-api-exception.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.use(helmet());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalFilters(new JsonapiExceptionFilter());
}
