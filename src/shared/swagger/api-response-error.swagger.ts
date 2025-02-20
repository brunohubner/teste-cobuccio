import { ApiProperty } from '@nestjs/swagger';
import { ErrorSwagger } from './error.swagger';

export class ApiResponseErrorSwagger {
  @ApiProperty({ type: () => [ErrorSwagger] })
    errors: ErrorSwagger[];
}
