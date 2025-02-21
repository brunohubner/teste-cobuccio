import { Test, TestingModule } from '@nestjs/testing';
import * as bcryptjs from 'bcryptjs';
import User from '@/shared/models/user.model';
import { AuthService } from '@/shared/auth/auth.service';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import { UserService } from '@/app/user/user.service';
import { TransactionService } from '@/app/transaction/transaction.service';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { SigninDto } from '@/app/user/dtos/signin.dto';
import { JwtUser } from '@/shared/types/jwt-user.type';

jest.mock('bcryptjs');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: typeof User;
  let authService: AuthService;
  let transactionService: TransactionService;
  let httpException: typeof HttpException;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: User,
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
        {
          provide: HttpException,
          useValue: {
            badRequest: jest.fn((msg) => new Error(msg)),
            unauthorized: jest.fn((msg) => new Error(msg)),
            internalServerError: jest.fn((msg) => new Error(msg)),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<typeof User>(User);
    authService = module.get<AuthService>(AuthService);
    transactionService = module.get<TransactionService>(TransactionService);
    httpException = module.get<typeof HttpException>(HttpException);
  });

  describe('signUp', () => {
    it('deve lançar erro se o usuário for menor de 18 anos', async () => {
      const dto: CreateUserDto = {
        person_name: 'Test User',
        email: 'test@example.com',
        cpf: '1234567809',
        password: '@Pass123',
        password_confirmation: '@Pass123',
        birth_date: new Date().toISOString(),
      };
      await expect(userService.signUp(dto)).rejects.toThrow('Idade mínima para cadastro é de 18 anos');
    });

    it('deve lançar erro se o email já estiver cadastrado', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });
      const dto: CreateUserDto = {
        person_name: 'Test User',
        email: 'test@example.com',
        cpf: '1234567809',
        password: '@Pass123',
        password_confirmation: '@Pass123',
        birth_date: '2000-01-01',
      };
      await expect(userService.signUp(dto)).rejects.toThrow('Email informado já cadastrado no sistema');
    });
  });

  describe('signIn', () => {
    it('deve lançar erro se o email não for encontrado', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      const dto: SigninDto = { email: 'notfound@example.com', password: '@Pass123' };
      await expect(userService.signIn(dto)).rejects.toThrow('Email ou senha inválidos');
    });

    it('deve lançar erro se a senha for inválida', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue({ hashed_password: 'hashedpass' });
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);
      const dto: SigninDto = { email: 'test@example.com', password: '@Pass123' };
      await expect(userService.signIn(dto)).rejects.toThrow('Email ou senha inválidos');
    });
  });

  describe('getBalance', () => {
    it('deve retornar o saldo do usuário', async () => {
      transactionService.getBalance = jest.fn().mockResolvedValue(1000);
      const user: JwtUser = { user_id: '1', person_name: 'User', email: 'user@example.com' };
      await expect(userService.getBalance(user)).resolves.toEqual({ ...user, balance: 1000 });
    });
  });
});
