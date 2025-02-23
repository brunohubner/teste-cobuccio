import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  Length,
  Validate,
} from 'class-validator';
import { REGEX } from '@/shared/constants/regex.const';
import { Match } from '@/shared/decorators/match.decorator';
import { IsValidCPF } from '@/shared/decorators/is-cpf.decorator';
import { IsValidDate } from '@/shared/decorators/is-date.decorator';

export class CreateUserDto {
  @Length(3, 255)
  @Matches(REGEX.PERSON_NAME, { message: 'Nome inválido' })
  @ApiProperty({ example: 'João da Silva' })
    person_name: string;

  @ApiProperty({ example: '12345678909' })
  @IsString()
  @Validate(IsValidCPF, {
    message: 'CPF matematicamente inválido',
  })
  @Matches(REGEX.CPF_WITHOUT_MASK, { message: 'Formato de CPF inválido' })
    cpf: string;

  @IsEmail()
  @ApiProperty({ example: 'joao@domain.com' })
    email: string;

  @ApiProperty({ example: '@Pass1234' })
  @IsString()
  @MinLength(8)
  @Matches(REGEX.PASSWORD, { message: 'A senha deve conter números, caracteres especiais, maiúsculas e minusculas' })
    password: string;

  @ApiProperty({ example: '@Pass1234' })
  @IsString()
  @Match('password', {
    message: 'As senhas não conferem',
  })
    password_confirmation: string;

  @ApiProperty({ example: '2005-02-01' })
  @Validate(IsValidDate, {
    message: 'Data de nascimento inválida',
  })
  @IsString()
  @Matches(REGEX['YYYY-MM-DDD'], { message: 'Data de nascimento deve ser no formato: 2025-02-01' })
    birth_date: string;
}
