import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  Max,
  IsString,
  Validate,
  Matches,
} from 'class-validator';
import { REGEX } from '@/shared/constants/regex.const';
import { IsValidCPF } from '@/shared/decorators/is-cpf.decorator';

export class CreateTransactionDto {
  @ApiProperty({ example: '12345678909' })
  @IsString()
  @Validate(IsValidCPF, {
    message: 'CPF matematicamente inválido',
  })
  @Matches(REGEX.CPF_WITHOUT_MASK, { message: 'Formato de CPF inválido' })
    receiver_cpf: string;

  @ApiProperty()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @Min(0.01)
  @Max(Number.MAX_SAFE_INTEGER)
    amount: number;
}
