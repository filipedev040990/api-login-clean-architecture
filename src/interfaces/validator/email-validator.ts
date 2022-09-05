export interface IEmailValidator {
  isValid(email: string): Promise<boolean>
}
