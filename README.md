# API Transacional Cobuccio

Passos para execução e testes do projeto:

1 - Criar arquivo `.env` baseado no `.env.example`
```sh
cp .env.example .env
```

2 - Iniciar containers docker:
```sh
docker-compose up -d
```

3 - Conectar no database Postgres e executar os scripts de Migrations e Seeds
disponíveis em `migrations/migrations.sql` `seeds/seeds.sql`.

4 - Executar testes untários:
```sh
yarn test:unit
```

5 - Executar testes end-to-end:
```sh
yarn test:e2e
```

6 - Rodar projeto em mode development
```sh
yarn dev
```

7 - Fazer build do projeto:
```sh
yarn build
```

8 - Executar projeto em modo production:
```sh
yarn stard
```
