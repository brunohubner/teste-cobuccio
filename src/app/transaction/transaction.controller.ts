/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller,
  HttpCode,
  Inject,
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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { AuthGuard } from '@/shared/auth/auth.guard';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import { CreateTransactionSwaggerResponse } from './swagger/create-transaction.swagger';

@ApiTags('Transacoes')
@Controller('/api/v1/transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject(HttpException.name)
    private readonly httpException: typeof HttpException,
  ) { }

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria uma nova transação',
    description: 'Cria uma nova transação entre dois usuários',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    type: CreateTransactionSwaggerResponse,
  })
  @ApiResponse(API_RESPONSES.BAD_REQUEST)
  @ApiResponse(API_RESPONSES.UNPROCESSABLE_ENTITY)
  @ApiResponse(API_RESPONSES.INTERNAL_SERVER_ERROR)
  async POST_CreateTransaction(
  @Req() { decodedJwt }: Request,
    @Body() body: CreateTransactionDto,
  ) {
    const { user } = decodedJwt;

    const data = await this.transactionService.createTransaction(body, user);

    return { data };
  }
}
