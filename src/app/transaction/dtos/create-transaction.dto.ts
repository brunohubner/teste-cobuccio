import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsUUID()
    sender_id: string;

  @ApiProperty()
  @IsUUID()
    receiver_id: string;

  @ApiProperty()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @Min(0.01)
  @Max(Number.MAX_SAFE_INTEGER)
    amount: number;
}
