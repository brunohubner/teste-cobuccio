/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { API_RESPONSES } from '@/shared/constants/api-responses.const';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserSwaggerResponse } from './swagger/create-user.swagger';
import { SigninDto } from './dtos/signin.dto';

@ApiTags('Cadastro_e_autenticacao_de_usuarios')
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
}
