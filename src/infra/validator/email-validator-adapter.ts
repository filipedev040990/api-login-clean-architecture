import validator from 'validator'
import { IEmailValidator } from '../../interfaces/email-validator'

export class EmailValidatorAdapter implements IEmailValidator {
  async isValid (email: string): Promise<boolean> {
    return validator.isEmail(email)
  }
}
