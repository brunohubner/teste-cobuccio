import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import User from '@/shared/models/user.model';
import Transaction from '@/shared/models/transaction.model';
import { TransactionService } from '@/app/transaction/transaction.service';
import { JwtUser } from '@/shared/types/jwt-user.type';
import { CreateTransactionDto } from '@/app/transaction/dtos/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let userRepository: typeof User;
  let transactionRepository: typeof Transaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: HttpException.name,
          useValue: {
            badRequest: jest.fn().mockImplementation((msg) => new Error(msg)),
          },
        },
        {
          provide: User.name,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: Transaction.name,
          useValue: {
            sequelize: {
              transaction: jest.fn((callback) => callback({})),
              query: jest.fn(),
            },
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn().mockImplementation(() => []),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    userRepository = module.get<typeof User>(User.name);
    transactionRepository = module.get<typeof Transaction>(Transaction.name);
  });

  describe('createTransaction', () => {
    const sender: Partial<User> = { id: '1', cpf: '12345678901' };
    const receiver: Partial<User> = { id: '2', cpf: '98765432100', person_name: 'Receiver Name' };

    const dto: CreateTransactionDto = { receiver_cpf: '98765432100', amount: 100 };
    const user: JwtUser = { user_id: '1', person_name: 'John Doe', email: 'john@example.com' };

    it('deve criar uma transação com sucesso', async () => {
      jest.spyOn(userRepository, 'findOne')
        .mockImplementation(async ({ where }: any): Promise<any> => {
          if (where.id === '1') return sender;
          if (where.cpf === '98765432100') return receiver;
          return null;
        });

      jest.spyOn(service, 'getBalance').mockResolvedValue(200);
      jest.spyOn(transactionRepository, 'create').mockResolvedValue({
        id: 'tx123',
        amount: 100,
        toJSON: () => ({ id: 'tx123', amount: 100 }),
      });

      jest.spyOn(transactionRepository, 'update').mockResolvedValue([1]);

      const result = await service.createTransaction(dto, user);

      expect(result.transaction_id).toBe('tx123');
      expect(result.transaction_amount).toBe(100);
    });

    it('deve lançar erro se o saldo for insuficiente', async () => {
      jest.spyOn(userRepository, 'findOne')
        .mockImplementation(async ({ where }: any): Promise<any> => {
          if (where.id === '1') return sender;
          if (where.cpf === '98765432100') return receiver;
          return null;
        });

      jest.spyOn(service, 'getBalance').mockResolvedValue(50);

      const promise = service.createTransaction(dto, user);

      await expect(promise).rejects.toThrow('Seu saldo é insuficiente');
    });

    it('deve lançar erro devido a histórico transacional inválido', async () => {
      jest.spyOn(userRepository, 'findOne')
        .mockImplementation(async ({ where }: any): Promise<any> => {
          if (where.id === '1') return sender;
          if (where.cpf === '98765432100') return receiver;
          return null;
        });

      jest.spyOn(service, 'getBalance').mockResolvedValue(200);
      jest.spyOn(transactionRepository, 'findAll').mockResolvedValue([
        {
          id: 'tx123', sender_id: '1', amount: 100, status: 'completed',
        },
      ] as any);

      const promise = service.createTransaction(dto, user);

      await expect(promise).rejects.toThrow('Identificamos uma transação adulterada. id=tx123');
    });
  });

  describe('cancel', () => {
    const user: JwtUser = { user_id: '1', person_name: 'John Doe', email: 'john@example.com' };

    it('deve cancelar uma transação com sucesso', async () => {
      const transaction: Partial<Transaction> = {
        id: 'tx123', sender_id: '1', amount: 100, status: 'completed',
      };

      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(transaction as any);

      jest.spyOn(service, 'getBalance').mockResolvedValue(1000);

      const result = await service.cancel('tx123', user);

      const expected = {
        sender_id: '1',
        sender_name: 'John Doe',
        transaction_amount: 100,
        transaction_hash: '9a88dd8838705197bb0ab91a4d8b212de7c11b9d92f6174c949159fe6ed1abd7',
        transaction_id: 'tx123',
        transaction_status: 'canceled',
      };

      expect(result).toEqual(expected);
    });

    it('deve lançar erro devido a falta de saldo', async () => {
      const transaction: Partial<Transaction> = {
        id: 'tx123', sender_id: '1', amount: 100, status: 'completed',
      };

      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(transaction as any);

      jest.spyOn(service, 'getBalance').mockResolvedValue(50);

      const promise = service.cancel('tx123', user);

      await expect(promise).rejects
        .toThrow('O usuário que recebeu o dinheiro não tem saldo suficiente para reembolsar a transação');
    });
  });

  describe('getBalance', () => {
    it('deve retornar o saldo correto', async () => {
      jest.spyOn(transactionRepository.sequelize, 'query').mockResolvedValue([{ balance: 500 }] as any);

      const result = await service.getBalance('1');

      expect(result).toBe(500);
    });
  });
});
