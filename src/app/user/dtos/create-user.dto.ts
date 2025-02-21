import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  Length,
} from 'class-validator';
import { REGEX } from '@/shared/constants/regex.const';
import { Match } from '@/shared/decorators/match.decorator';

export class CreateUserDto {
  @Length(3, 255)
  @Matches(REGEX.PERSON_NAME, { message: 'Nome inválido' })
  @ApiProperty()
    person_name: string;

  @ApiProperty()
  @IsString()
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
  @Matches(REGEX['YYYY-MM-DDD'], { message: 'Data de nascimento deve ser no formato: 2025-02-01' })
    birth_date: string;
}
