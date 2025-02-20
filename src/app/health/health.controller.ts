import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const message = 'Server running...';
const statusCode = 200;

class HealthResponse {
  @ApiProperty({ example: statusCode })
    statusCode: number;

  @ApiProperty({ example: message })
    message: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiResponse({
    status: statusCode,
    description: message,
    type: HealthResponse,
  })
  @Get()
  async getHealth() {
    return {
      statusCode,
      message,
    };
  }
}
