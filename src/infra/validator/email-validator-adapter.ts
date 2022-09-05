import validator from 'validator'
import { IEmailValidator } from '../../interfaces/validator/email-validator'

export class EmailValidatorAdapter implements IEmailValidator {
  async isValid (email: string): Promise<boolean> {
    return validator.isEmail(email)
  }
}
