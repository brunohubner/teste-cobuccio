import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const description = `<div>
  <p>
    desenvolvido por <a href="https://brunohubner.com" target="_blank" rel="noopener noreferrer">Bruno Hubner</a> - 
    <a href="https://github.com/brunohubner/teste-cobuccio" target="_blank" rel="noopener noreferrer">github.com/brunohubner/teste-cobuccio</a>
  </p>

  <br />

  <p>Passos para utilização das APIs:</p>
  <p>1 - Criar um novo usuário;</p>
  <p>2 - Gerar token jwt na rota de login com o usuário criado;</p>
  <p>3 - Utilizar o token jwt gerado nas rotas que necessitam de autenticação.</p>

  <br />

  <p>Todo novo usuário cadastrado possui saldo zerado. Após criar um ou mais usuários no sistema</p>
  <p>faça login com o usuário pré cadastrado de email = <strong>bruno@domain.com</strong> e senha = <strong>@Pass1234</strong></p>
  <p>Esse usuário possui 10 mil de saldo, use esse saldo para enviar transações para os outros usuários.</p>
</div>`;

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Transacional Cobuccio')
    .setDescription(description)
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
    // customCss,
    customSiteTitle: 'API Transacional Cobuccio',
  });
}
