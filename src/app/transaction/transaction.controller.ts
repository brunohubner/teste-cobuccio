/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
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
import { CreateTransactionSwaggerResponse } from './swagger/create-transaction.swagger';
import { ValidateUuidParam } from '@/shared/pipes/validate-uuid-param.pipe';
import { RedisService } from '@/shared/redis/redis.service';
import { HttpException } from '@/shared/errors/http/http-exception.error';

@ApiTags('Transacoes')
@Controller('/api/v1/transaction')
export class TransactionController {
  constructor(
    @Inject(HttpException.name)
    private readonly httpException: typeof HttpException,
    private readonly transactionService: TransactionService,
    private readonly redisService: RedisService,

  ) { }

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar uma nova transação (envio de saldo para outro usuário)',
    description: 'Criar uma nova transação (envio de saldo para outro usuário)',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    type: CreateTransactionSwaggerResponse,
  })
  @ApiResponse(API_RESPONSES.BAD_REQUEST)
  @ApiResponse(API_RESPONSES.INTERNAL_SERVER_ERROR)
  async POST_CreateTransaction(
  @Req() { decodedJwt }: Request,
    @Body() body: CreateTransactionDto,
  ) {
    const { user } = decodedJwt;
    const { user_id } = user;

    const lockKey = `lock:transaction:${user_id}`;

    const locked = await this.redisService.get(lockKey);

    const lockSecondsTTl = 10;

    if (locked) {
      throw this
        .httpException
        .badRequest(`Aguarde ${lockSecondsTTl} segundos antes de realizar uma nova transação`);
    }

    await this.redisService.set(lockKey, true, lockSecondsTTl * 1000);

    const data = await this.transactionService.createTransaction(body, user);

    await this.redisService.del(lockKey); // comentado propositalmente

    return { data };
  }

  @Put(':transaction_id/cancel')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Solicitar cancelamento da ultima transação enviada pelo usuário auntenticado',
    description: `<p>Só é possivel solicitar cancelamento da última transação enviada pelo usuário auntenticado.</p>
      </br>
      <p>Se o usuário que recebeu o dinheiro tiver um valor menor que o valor da transação, a transação não será cancelada.</p>`,
  })
  @ApiResponse({
    status: 201,
    description: 'Transação cancelada com sucesso',
    type: Object,
  })
  @ApiResponse(API_RESPONSES.BAD_REQUEST)
  @ApiResponse(API_RESPONSES.INTERNAL_SERVER_ERROR)
  async PUT_Cancel(
  @Req() { decodedJwt }: Request,
    @Param('transaction_id', ValidateUuidParam) transaction_id: string,
  ) {
    const { user } = decodedJwt;

    const data = await this.transactionService.cancel(transaction_id, user);

    return { data };
  }
}
