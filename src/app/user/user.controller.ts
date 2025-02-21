/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { API_RESPONSES } from '@/shared/constants/api-responses.const';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserSwaggerResponse } from './swagger/create-user.swagger';
import { SigninDto } from './dtos/signin.dto';
import { AuthGuard } from '@/shared/auth/auth.guard';

@ApiTags('Usuarios')
@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar um novo usuário no sistema',
    description: 'Criar um novo usuário no sistema informando os dados necessarios corretamente',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CreateUserSwaggerResponse,
  })
  @ApiResponse(API_RESPONSES.BAD_REQUEST)
  @ApiResponse(API_RESPONSES.UNPROCESSABLE_ENTITY)
  @ApiResponse(API_RESPONSES.INTERNAL_SERVER_ERROR)
  async POST_Signup(@Body() body: CreateUserDto) {
    const data = await this.userService.signUp(body);

    return { data };
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Realizar login no sistema',
    description: 'Realizar login no sistema informando email e senha',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: Object,
  })
  @ApiResponse(API_RESPONSES.BAD_REQUEST)
  @ApiResponse(API_RESPONSES.UNPROCESSABLE_ENTITY)
  @ApiResponse(API_RESPONSES.INTERNAL_SERVER_ERROR)
  async POST_Signin(@Body() body: SigninDto) {
    const data = await this.userService.signIn(body);

    return { data };
  }

  @Get('balance')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consulta o saldo do usuário logado',
    description: 'Consulta o saldo do usuário logado',
  })
  @ApiResponse({
    status: 200,
    description: 'Saldo consultado com sucesso',
    type: Object,
  })
  @ApiResponse(API_RESPONSES.BAD_REQUEST)
  @ApiResponse(API_RESPONSES.UNPROCESSABLE_ENTITY)
  @ApiResponse(API_RESPONSES.INTERNAL_SERVER_ERROR)
  async GET_Balance(
  @Req() { decodedJwt }: Request,
  ) {
    const { user } = decodedJwt;

    const data = await this.userService.getBalance(user);

    return { data };
  }
}
