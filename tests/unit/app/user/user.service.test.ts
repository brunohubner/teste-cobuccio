import * as bcryptjs from 'bcryptjs';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import User from '@/shared/models/user.model';
import { AuthService } from '@/shared/auth/auth.service';

import { JwtUser } from '@/shared/types/jwt-user.type';
import { UserService } from '@/app/user/user.service';
import { TransactionService } from '@/app/transaction/transaction.service';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { SigninDto } from '@/app/user/dtos/signin.dto';

jest.mock('bcryptjs');

describe('UserService', () => {
  let service: UserService;
  let userRepository: typeof User;
  let authService: AuthService;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: HttpException.name,
          useValue: {
            badRequest: jest.fn().mockImplementation((msg) => new Error(msg)),
            internalServerError: jest.fn().mockImplementation((msg) => new Error(msg)),
            unauthorized: jest.fn().mockImplementation((msg) => new Error(msg)),
          },
        },
        {
          provide: User.name,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generateJwt: jest.fn(),
          },
        },
        {
          provide: TransactionService,
          useValue: {
            getBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<typeof User>(User.name);
    authService = module.get<AuthService>(AuthService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('signUp', () => {
    it('deve criar um usuário com sucesso', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      jest.spyOn(userRepository, 'create').mockResolvedValue(undefined);

      process.env.SALT_PASSWORD = 'test_salt';

      const dto: CreateUserDto = {
        person_name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678901',
        birth_date: '2000-01-01',
        password: '@Pass1234',
        password_confirmation: '@Pass1234',
      };

      const result = await service.signUp(dto);

      expect(result).toEqual({
        message: 'Usuário criado com sucesso',
        user: expect.objectContaining({
          person_name: 'John Doe',
          email: 'john@example.com',
          cpf: '12345678901',
        }),
      });
    });
  });

  describe('signIn', () => {
    it('deve autenticar um usuário com sucesso', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        // @ts-ignore
        id: '1',
        person_name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashed_password',
      });

      // @ts-ignore
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true);

      jest.spyOn(authService, 'generateJwt').mockResolvedValue('jwt_token');

      process.env.SALT_PASSWORD = 'test_salt';

      const dto: SigninDto = {
        email: 'john@example.com',
        password: '@Pass1234',
      };

      const result = await service.signIn(dto);

      expect(result).toEqual({ jwt: 'jwt_token' });
    });
  });

  describe('getBalance', () => {
    it('deve retornar o saldo do usuário', async () => {
      jest.spyOn(transactionService, 'getBalance').mockResolvedValue(1000);

      const user: JwtUser = {
        user_id: '1',
        person_name: 'John Doe',
        email: 'john@example.com',
      };

      const result = await service.getBalance(user);

      expect(result).toEqual({
        ...user,
        balance: 1000,
      });
    });
  });
});
