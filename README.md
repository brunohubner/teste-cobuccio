# API Transacional Cobuccio

Passos para execução e testes do projeto:

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

 - Verificar cobertura de testes:
```sh
yarn test:cov
```

 - Rodar projeto em mode development
```sh
yarn dev
```

 - Fazer build do projeto:
```sh
yarn build
```

 - Executar projeto em modo production:
```sh
yarn stard
```
