import { ApiProperty } from '@nestjs/swagger';

export class ErrorSwagger {
  @ApiProperty()
    id: string;

  @ApiProperty()
    status: number;

  @ApiProperty()
    code: string;

  @ApiProperty()
    title: string;
}
