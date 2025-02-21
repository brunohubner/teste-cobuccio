import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateUserSwaggerContent {
  @ApiProperty()
    person_name: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
    cpf: string;

  @ApiProperty()
    birth_date: string;
}

export class CreateUserSwaggerData {
  @ApiProperty()
    message: string;

  @ApiProperty()
  @Type(() => CreateUserSwaggerContent)
    user: CreateUserSwaggerContent;
}

export class CreateUserSwaggerResponse {
  @ApiProperty()
  @Type(() => CreateUserSwaggerData)
    data: CreateUserSwaggerData;
}
