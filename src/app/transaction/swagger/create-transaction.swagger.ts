import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionSwaggerData {
  @ApiProperty()
    transaction_id: string;

  @ApiProperty()
    transaction_hash: string;

  @ApiProperty()
    transaction_amount: number;

  @ApiProperty()
    sender_name: string;

  @ApiProperty()
    sender_cpf: string;

  @ApiProperty()
    sender_id: string;

  @ApiProperty()
    receiver_name: string;

  @ApiProperty()
    receiver_cpf: string;

  @ApiProperty()
    receiver_id: string;
}

export class CreateTransactionSwaggerResponse {
  @ApiProperty()
    data: CreateTransactionSwaggerData;
}
