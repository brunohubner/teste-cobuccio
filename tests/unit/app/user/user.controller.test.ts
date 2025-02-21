import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UserController } from '@/app/user/user.controller';
import { UserService } from '@/app/user/user.service';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { SigninDto } from '@/app/user/dtos/signin.dto';
import { AuthService } from '@/shared/auth/auth.service';
import { TransactionModule } from '@/app/transaction/transaction.module';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
            getBalance: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
      imports: [TransactionModule],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('POST_Signup', () => {
    it('deve criar um usuário com sucesso', async () => {
      const dto: CreateUserDto = {
        person_name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678901',
        birth_date: '2000-01-01',
        password: '@Pass1234',
        password_confirmation: '@Pass1234',
      };

      jest.spyOn(userService, 'signUp').mockResolvedValue({ message: 'Usuário criado com sucesso' } as any);

      const result = await controller.POST_Signup(dto);

      expect(result).toEqual({ data: { message: 'Usuário criado com sucesso' } });
    });
  });

  describe('POST_Signin', () => {
    it('deve realizar login com sucesso', async () => {
      const dto: SigninDto = { email: 'john@example.com', password: '@Pass1234' };

      jest.spyOn(userService, 'signIn').mockResolvedValue({ token: 'jwt_token' } as any);

      const result = await controller.POST_Signin(dto);

      expect(result).toEqual({ data: { token: 'jwt_token' } });
    });
  });

  describe('GET_Balance', () => {
    it('deve retornar o saldo do usuário', async () => {
      const user = { user_id: '1', person_name: 'John Doe', email: 'john@example.com' };
      const request = { decodedJwt: { user } } as unknown as Request;

      // @ts-ignore
      jest.spyOn(userService, 'getBalance').mockResolvedValue(1000);

      const result = await controller.GET_Balance(request);

      expect(result).toEqual({ data: 1000 });
    });
  });
});
