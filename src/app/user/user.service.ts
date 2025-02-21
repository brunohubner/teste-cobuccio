import * as bcryptjs from 'bcryptjs';

import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import User from '@/shared/models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import { CreateUserSwaggerData } from './swagger/create-user.swagger';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from '@/shared/auth/auth.service';
import { TransactionService } from '../transaction/transaction.service';
import { JwtUser } from '@/shared/types/jwt-user.type';
import { GetUserBalanceSwaggerData } from './swagger/get-balance.swagger';

@Injectable()
export class UserService {
  constructor(
    @Inject(HttpException.name)
    private readonly httpException: typeof HttpException,
    @Inject(User.name)
    private readonly userRepository: typeof User,
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService,
  ) { }

  async signUp(dto: CreateUserDto): Promise<CreateUserSwaggerData> {
    const birth_date = new Date(dto.birth_date);

    const $18YearsAgo = new Date();
    $18YearsAgo.setFullYear($18YearsAgo.getFullYear() - 18);

    if (birth_date > $18YearsAgo) {
      throw this.httpException.badRequest('Idade mínima para cadastro é de 18 anos');
    }

    const user = await this.userRepository.findOne({
      attributes: ['email', 'cpf'],
      where: {
        [Op.or]: [
          { email: dto.email },
          { cpf: dto.cpf },
        ],
      },
      raw: true,
    });

    if (user && user.email === dto.email) {
      throw this.httpException.badRequest('Email informado já cadastrado no sistema, por favor, informe outro email');
    }

    if (user && user.cpf === dto.cpf) {
      throw this.httpException.badRequest('CPF informado já cadastrado no sistema, por favor, informe outro CPF');
    }

    const saltPassword = process.env.SALT_PASSWORD;

    const hashed_password = await bcryptjs.hash(`${dto.password}${saltPassword}`, 10);

    const userModel: Partial<User> = {
      person_name: dto.person_name,
      cpf: dto.cpf,
      email: dto.email,
      hashed_password,
      birth_date,
    };

    await this.userRepository.create(userModel);

    return {
      message: 'Usuário criado com sucesso',
      user: {
        person_name: dto.person_name,
        email: dto.email,
        cpf: dto.cpf,
        birth_date: dto.birth_date,
      },
    };
  }

  async signIn(dto: SigninDto) {
    const user = await this.userRepository.findOne({
      attributes: ['id', 'person_name', 'email', 'hashed_password'],
      where: {
        email: dto.email,
      },
      raw: true,
    });

    if (!user) {
      throw this.httpException.unauthorized('Email ou senha inválidos');
    }

    const saltPassword = process.env.SALT_PASSWORD;

    const isValidPassword = await bcryptjs.compare(`${dto.password}${saltPassword}`, user.hashed_password);

    if (!isValidPassword) {
      throw this.httpException.unauthorized('Email ou senha inválidos');
    }

    const jwt = await this.authService.generateJwt({
      user: {
        user_id: user.id,
        person_name: user.person_name,
        email: user.email,
      },
    });

    return {
      jwt,
    };
  }

  async getBalance(user: JwtUser): Promise<GetUserBalanceSwaggerData> {
    const balance = await this.transactionService.getBalance(user.user_id);

    return {
      ...user,
      balance,
    };
  }
}
