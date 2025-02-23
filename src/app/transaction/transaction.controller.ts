/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller,
  HttpCode,
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

@ApiTags('Transacoes')
@Controller('/api/v1/transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
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

    const data = await this.transactionService.createTransaction(body, user);

    return { data };
  }

  @Put(':transaction_id/cancel')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Solicitar cancelemnto da ultima transação enviada pelo usuário',
    description: `<p>Só é possivel solicitar cancelamento da última transação enviada pelo usuário.</p>
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
