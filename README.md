# API de Pagamentos Vink

Passos fazer deploy:

- Criar `.env` baseado `.env.example`.

- Ter instalado a versão do Nodejs declarada no `.tool-versions`.

- Rodar os comandos:

```sh
yarn install
```

```sh
yarn build
```

```sh
yarn start
```
#
### Fluxo atual de pagamento ao acessar página `/pagamento` no `concilador-frontend`:

1. O cliente deve estar logado e selecionar um produto/serviço para assinar ou comprar.

2. Na tela `/pagamento` do `concilador-frontend` o endpoint `GET /v1/metodo-pagamento` 
será chamado para listar todos os métodos de pagamentos daquele cliente. 
Como estamos usando o meio de pagamento [Vindi](https://vindi.com.br/) esse 
microsserviço irá consultar as API da Vindi para retornar os meios de pagamentos
mascarados, já que o database da Vink não armazena absolutamente nenhuma informação
de cartão de crédito, como número, data de validade, cvv ou nome do titular do cartão.

3. Se no frontend o cliente quiser adicionar um novo método de pagamento (cartão de crédito)
a API pública de criação de meios de pagamento da Vindi será chamada pelo frontend mesmo,
para evitar que dados senssíves de cartão de cédito trafeguem pelo backend da Vink.
Esse microsserviço irá apenas atrelar o token retornado pela Vindi ao cliente correto.
detalhes [na documentação da Vindi](https://atendimento.vindi.com.br/hc/pt-br/articles/115009609107-Como-eu-cadastro-perfis-de-pagamento-via-API-).