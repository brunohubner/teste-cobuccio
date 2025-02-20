import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { customCss } from '@/shared/styles/swaggerDark';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Transacional Cobuccio')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Infomar o JWT para autorizar o acesso',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customCss,
    customSiteTitle: 'API Transacional Cobuccio',
  });
}
