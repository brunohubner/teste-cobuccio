/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@/shared/auth/auth.guard';
import { API_RESPONSES } from '@/shared/constants/api-responses.const';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';



@ApiTags('User')
@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('/:signup')
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Cria um novo usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: Object,
  })
  @ApiResponse(API_RESPONSES.BAD_REQUEST)
  @ApiResponse(API_RESPONSES.UNPROCESSABLE_ENTITY)
  @ApiResponse(API_RESPONSES.INTERNAL_SERVER_ERROR)
  async POST_Signup(@Body() body: CreateUserDto) {
    const data = await this.userService.signUp(body)

    return { data };
  }
}
