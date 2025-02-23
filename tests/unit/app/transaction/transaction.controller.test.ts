import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { TransactionController } from '@/app/transaction/transaction.controller';
import { TransactionService } from '@/app/transaction/transaction.service';
import { RedisService } from '@/shared/redis/redis.service';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import { CreateTransactionDto } from '@/app/transaction/dtos/create-transaction.dto';
import { AuthService } from '@/shared/auth/auth.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionService;
  let redisService: RedisService;
  let httpException: typeof HttpException;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            createTransaction: jest.fn(),
            cancel: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: HttpException.name,
          useValue: {
            badRequest: jest.fn().mockImplementation((msg) => new Error(msg)),
          },
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
    redisService = module.get<RedisService>(RedisService);
    httpException = module.get<typeof HttpException>(HttpException.name);
  });

  describe('POST_CreateTransaction', () => {
    const user = { user_id: '1', person_name: 'John Doe' };
    const request = { decodedJwt: { user } } as unknown as Request;
    const dto: CreateTransactionDto = { receiver_cpf: '12345678990', amount: 500 };

    it('deve criar uma transação com sucesso', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(transactionService, 'createTransaction')
        .mockResolvedValue({ transaction_id: '123' } as any);

      const result = await controller.POST_CreateTransaction(request, dto);

      expect(result).toEqual({ data: { transaction_id: '123' } });
    });

    it('deve falhar se o usuário tentar criar uma transação enquanto bloqueado', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue('true');

      await expect(controller.POST_CreateTransaction(request, dto)).rejects.toThrow(
        'Aguarde 10 segundos antes de realizar uma nova transação',
      );
    });
  });

  describe('PUT_Cancel', () => {
    it('deve cancelar a transação com sucesso', async () => {
      const user = { user_id: '1', person_name: 'John Doe' };
      const request = { decodedJwt: { user } } as unknown as Request;
      const transaction_id = '123';

      jest.spyOn(transactionService, 'cancel').mockResolvedValue({ success: true } as any);

      const result = await controller.PUT_Cancel(request, transaction_id);

      expect(result).toEqual({ data: { success: true } });
    });
  });
});
