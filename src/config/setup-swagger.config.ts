import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { customCss } from '@/shared/styles/swaggerDark';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Transacional Cobuccio')
    .setDescription('desenvolvido por <a href="https://brunohubner.com" target="_blank" rel="noopener noreferrer">Bruno Hubner</a> - <a href="https://github.com/brunohubner/teste-cobuccio" target="_blank" rel="noopener noreferrer">github.com/brunohubner/teste-cobuccio</a>')
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
