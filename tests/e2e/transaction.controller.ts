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
  let authToken: string;

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

    // Simula login para obter token
    const response = await request(app.getHttpServer())
      .post('/api/v1/user/signin')
      .send({ email: 'john@example.com', password: '@Pass1234' });

    authToken = response.body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/transaction (POST)', () => {
    it('deve criar uma transação com sucesso', async () => {
      const transactionDto = {
        recipient_id: '2',
        amount: 100,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/transaction')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionDto);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('/api/v1/transaction/:transaction_id/cancel (PUT)', () => {
    it('deve cancelar uma transação com sucesso', async () => {
      const transactionId = 'some-valid-uuid';

      const response = await request(app.getHttpServer())
        .put(`/api/v1/transaction/${transactionId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});
