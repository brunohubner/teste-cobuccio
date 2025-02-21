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
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { API_RESPONSES } from '@/shared/constants/api-responses.const';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserSwaggerResponse } from './swagger/create-user.swagger';

@ApiTags('User')
@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('/signup')
  @ApiBearerAuth()
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
}
