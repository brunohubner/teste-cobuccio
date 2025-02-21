import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidDate } from '../functions/isValidDate';

@ValidatorConstraint()
export class IsValidDate implements ValidatorConstraintInterface {
  validate(date: string | Date) {
    return isValidDate(new Date(date));
  }
}
