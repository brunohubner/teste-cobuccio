import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { App } from './app.setup';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let jwtBruno: string;

  const user1 = {
    person_name: 'Bruno Hubner',
    cpf: '12345678909',
    email: 'julia@domain.com',
    password: '@Pass1234',
    password_confirmation: '@Pass1234',
    birth_date: '1999-04-21',
  };

  const user2 = {
    person_name: 'Julia Maria',
    cpf: '90428290019',
    email: 'julia@domain.com',
    password: '@Pass1234',
    password_confirmation: '@Pass1234',
    birth_date: '2006-12-07',
  };

  const user3 = {
    person_name: 'Antonio Carlos',
    cpf: '77789498061',
    email: 'antonio@domain.com',
    password: '@Pass1234',
    password_confirmation: '@Pass1234',
    birth_date: '2004-03-12',
  };

  let penultimateTransaction: string = null;
  let lastTransaction: string = null;

  beforeAll(async () => {
    app = await App.getApp();

    const response = await request(app.getHttpServer())
      .post('/api/v1/user/signin')
      .send({ email: 'bruno@domain.com', password: '@Pass1234' });

    jwtBruno = response.body.data.jwt;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/user/signup ', () => {
    it('deve criar 2 novos usuários', async () => {
      const response2 = await request(app.getHttpServer())
        .post('/api/v1/user/signup')
        .send(user2);

      expect(response2.status).toBe(201);

      expect(response2.body).toHaveProperty('data');
      expect(response2.body.data).toHaveProperty('message', 'Usuário criado com sucesso');
      expect(response2.body.data).toHaveProperty('user');
      expect(response2.body.data.user).toHaveProperty('person_name', user2.person_name);
      expect(response2.body.data.user).toHaveProperty('email', user2.email);
      expect(response2.body.data.user).toHaveProperty('cpf', user2.cpf);
      expect(response2.body.data.user).toHaveProperty('birth_date', user2.birth_date);

      const response3 = await request(app.getHttpServer())
        .post('/api/v1/user/signup')
        .send(user3);

      expect(response3.status).toBe(201);

      expect(response3.body).toHaveProperty('data');
      expect(response3.body.data).toHaveProperty('message', 'Usuário criado com sucesso');
      expect(response3.body.data).toHaveProperty('user');
      expect(response3.body.data.user).toHaveProperty('person_name', user3.person_name);
      expect(response3.body.data.user).toHaveProperty('email', user3.email);
      expect(response3.body.data.user).toHaveProperty('cpf', user3.cpf);
      expect(response3.body.data.user).toHaveProperty('birth_date', user3.birth_date);
    });
  });

  describe('POST /api/v1/transaction', () => {
    it('deve criar 2 transações', async () => {
      const response2 = await request(app.getHttpServer())
        .post('/api/v1/transaction')
        .set('Authorization', `Bearer ${jwtBruno}`)
        .send({
          receiver_cpf: user2.cpf,
          amount: 11.11,
        });

      penultimateTransaction = response2.body.data.transaction_id;

      expect(response2.status).toBe(201);
      expect(response2.body).toHaveProperty('data');
      expect(response2.body.data).toHaveProperty('transaction_amount', 11.11);
      expect(response2.body.data).toHaveProperty('sender_name', user1.person_name);
      expect(response2.body.data).toHaveProperty('sender_cpf', user1.cpf);
      expect(response2.body.data).toHaveProperty('receiver_name', user2.person_name);
      expect(response2.body.data).toHaveProperty('receiver_cpf', user2.cpf);

      const response3 = await request(app.getHttpServer())
        .post('/api/v1/transaction')
        .set('Authorization', `Bearer ${jwtBruno}`)
        .send({
          receiver_cpf: user3.cpf,
          amount: 22.22,
        });

      lastTransaction = response3.body.data.transaction_id;

      expect(response3.status).toBe(201);
      expect(response3.body).toHaveProperty('data');
      expect(response3.body.data).toHaveProperty('transaction_amount', 22.22);
      expect(response3.body.data).toHaveProperty('sender_name', user1.person_name);
      expect(response3.body.data).toHaveProperty('sender_cpf', user1.cpf);
      expect(response3.body.data).toHaveProperty('receiver_name', user3.person_name);
      expect(response3.body.data).toHaveProperty('receiver_cpf', user3.cpf);
    });
  });

  describe('PUT /api/v1/transaction/:transaction_id/cancel', () => {
    it('deve falhar ao tentar cancelar penúltima transação enviada', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/transaction/${penultimateTransaction}/cancel`)
        .set('Authorization', `Bearer ${jwtBruno}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve cancelar ultima transação enviada', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/transaction/${lastTransaction}/cancel`)
        .set('Authorization', `Bearer ${jwtBruno}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('transaction_id', lastTransaction);
      expect(response.body.data).toHaveProperty('transaction_status', 'canceled');
      expect(response.body.data).toHaveProperty('sender_name', user1.person_name);
    });
  });
});
