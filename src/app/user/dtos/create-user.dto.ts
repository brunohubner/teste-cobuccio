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
  @ApiProperty()
    person_name: string;

  @ApiProperty()
  @IsString()
  @Validate(IsValidCPF, {
    message: 'CPF matematicamente inválido',
  })
  @Matches(REGEX.CPF_WITHOUT_MASK, { message: 'Formato de CPF inválido' })
    cpf: string;

  @IsEmail()
  @ApiProperty()
    email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(REGEX.PASSWORD, { message: 'A senha deve conter números, caracteres especiais, maiúsculas e minusculas' })
    password: string;

  @ApiProperty()
  @IsString()
  @Match('password', {
    message: 'As senhas não conferem',
  })
    password_confirmation: string;

  @ApiProperty()
  @IsString()
  @Validate(IsValidDate, {
    message: 'Data de nascimento inválida',
  })
  @Matches(REGEX['YYYY-MM-DDD'], { message: 'Data de nascimento deve ser no formato: 2025-02-01' })
    birth_date: string;
}
