# API Transacional Cobuccio 

## <a href="https://cobuccio.brunohubner.com/docs" target="_blank">https://cobuccio.brunohubner.com/docs</a>

#### Acesse o proje no link acima, fiz deploy na AWS para caso vocês não queiram executar o projeto localmente

# 

### Passos para execução e testes do projeto localmente em sua máquina:

 - Criar arquivo `.env` baseado no `.env.example`
```sh
cp .env.example .env
```

 - Iniciar containers docker:
```sh
docker-compose up -d
```

 - Apos confirmar que o container docker está rodando executar os comando de Migrations e Seeds e criar um database novo exclusivo para a execução dos testes:
```sh
yarn db:migrate
yarn db:seed
yarn db:create-db-tests
```

 - Instalar pacotes NPM:
```sh
yarn install
```

 - Executar testes untários:
```sh
yarn test:unit
```

 - Executar testes end-to-end:
```sh
yarn test:e2e
```

 - Verificar cobertura de testes e visualizar relatório em http://127.0.0.1:3009
```sh
yarn test:cov
```

 - Rodar projeto em mode development e ver documentação em http://localhost:3007/docs
```sh
yarn dev
```

 - Fazer build do projeto:
```sh
yarn build
```

 - Executar projeto em modo production e ver documentação em http://localhost:3007/docs
```sh
yarn stard
```

## Kibana

A API está enviando todos os logs da aplicação para o Elastic Search.

Todos os logs podem ser visualizados no Kibana

produção: https://kibana.brunohubner.com

local: http://localhost:5601
