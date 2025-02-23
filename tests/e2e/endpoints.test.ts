import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { AuthService } from '@/shared/auth/auth.service';
import { TransactionService } from '@/app/transaction/transaction.service';
import { RedisService } from '@/shared/redis/redis.service';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let transactionService: TransactionService;
  let redisService: RedisService;
  let jwtBruno: string;

  const user1 = {
    person_name: 'Julia Maria',
    cpf: '90428290019',
    email: 'julia@domain.com',
    password: '@Pass1234',
    password_confirmation: '@Pass1234',
    birth_date: '2006-12-07',
  };

  const user2 = {
    person_name: 'Antonio Carlos',
    cpf: '77789498061',
    email: 'antonio@domain.com',
    password: '@Pass1234',
    password_confirmation: '@Pass1234',
    birth_date: '2004-03-12',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    transactionService = moduleFixture.get<TransactionService>(TransactionService);
    redisService = moduleFixture.get<RedisService>(RedisService);

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
      const response1 = await request(app.getHttpServer())
        .post('/api/v1/user/signup')
        .send(user1);

      expect(response1.status).toBe(201);

      expect(response1.body).toHaveProperty('data');
      expect(response1.body.data).toHaveProperty('message', 'Usuário criado com sucesso');
      expect(response1.body.data).toHaveProperty('user');
      expect(response1.body.data.user).toHaveProperty('person_name', user1.person_name);
      expect(response1.body.data.user).toHaveProperty('email', user1.email);
      expect(response1.body.data.user).toHaveProperty('cpf', user1.cpf);
      expect(response1.body.data.user).toHaveProperty('birth_date', user1.birth_date);

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
    });
  });

  // describe('/api/v1/transaction (POST)', () => {

  // it('deve criar uma transação com sucesso', async () => {
  //   const transactionDto = {
  //     recipient_id: '2',
  //     amount: 100,
  //   };

  //   const response = await request(app.getHttpServer())
  //     .post('/api/v1/transaction')
  //     .set('Authorization', `Bearer ${jwtBruno}`)
  //     .send(transactionDto);

  //   expect(response.status).toBe(201);
  //   expect(response.body).toHaveProperty('data');
  // });
  // });

  // describe('/api/v1/transaction/:transaction_id/cancel (PUT)', () => {
  //   it('deve cancelar uma transação com sucesso', async () => {
  //     const transactionId = 'some-valid-uuid';

  //     const response = await request(app.getHttpServer())
  //       .put(`/api/v1/transaction/${transactionId}/cancel`)
  //       .set('Authorization', `Bearer ${jwtBruno}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('data');
  //   });
  // });
});
