import { ApiProperty } from '@nestjs/swagger';

export class CancelTransactionSwaggerData {
  @ApiProperty()
    transaction_id: string;

  @ApiProperty()
    transaction_hash: string;

  @ApiProperty()
    transaction_amount: number;

  @ApiProperty()
    transaction_status: string;

  @ApiProperty()
    sender_name: string;

  @ApiProperty()
    sender_id: string;
}

export class CancelTransactionSwaggerResponse {
  @ApiProperty()
    data: CancelTransactionSwaggerData;
}
