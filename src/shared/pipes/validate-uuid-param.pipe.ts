import { PipeTransform, BadRequestException } from '@nestjs/common';
import * as uuid from 'uuid';

export class ValidateUuidParam implements PipeTransform {
  transform(uuidParam = ''): string {
    if (uuidParam && !uuid.validate(uuidParam)) {
      throw new BadRequestException('UUID inválido');
    }

    return uuidParam;
  }
}
