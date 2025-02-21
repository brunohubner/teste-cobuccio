import { ApiProperty } from '@nestjs/swagger';

export class GetUserBalanceSwaggerData {
  @ApiProperty()
    user_id: string;

  @ApiProperty()
    person_name: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
    balance: number;
}

export class GetUserBalanceSwaggerResponse {
  @ApiProperty()
    data: GetUserBalanceSwaggerData;
}
