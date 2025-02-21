import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
} from 'class-validator';

export class SigninDto {
  @IsEmail()
  @ApiProperty({ example: 'bruno@empresa.com' })
    email: string;

  @ApiProperty({ example: '@Pass1234' })
  @IsString()
    password: string;
}
