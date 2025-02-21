/* eslint-disable class-methods-use-this */
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@/shared/auth/auth.guard';
import { API_RESPONSES } from '@/shared/constants/api-responses.const';
import { UserService } from './user.service';



@ApiTags('User')
@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }
}
