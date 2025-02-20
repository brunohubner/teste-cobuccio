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
@Controller()
export class HealthController {
  @ApiResponse({
    status: statusCode,
    description: message,
    type: HealthResponse,
  })
  @Get('health')
  async GET_Health() {
    return {
      statusCode,
      message,
    };
  }

  @ApiResponse({
    status: statusCode,
    description: message,
    type: HealthResponse,
  })
  @Get()
  async GET_Index() {
    return {
      statusCode,
      message,
    };
  }
}
