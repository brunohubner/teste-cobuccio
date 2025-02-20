import { PipeTransform } from '@nestjs/common';

export class ValidateBooleanParam implements PipeTransform {
  transform(param: string = ''): boolean {
    return param.toString().toLowerCase() === 'true';
  }
}
