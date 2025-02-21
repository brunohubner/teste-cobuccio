import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidCPF } from '../functions/isValidCPF';

@ValidatorConstraint()
export class IsValidCPF implements ValidatorConstraintInterface {
  validate(cpf: string) {
    return isValidCPF(cpf);
  }
}
