import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'
import { IEmailValidator } from '../../interfaces/email-validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): IEmailValidator => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('should call validator with correct email', async () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(validator, 'isEmail')

    await sut.isValid('anyEmail@email.com')
    expect(isValidSpy).toHaveBeenCalledWith('anyEmail@email.com')
  })

  test('should return true if validator return true', async () => {
    const sut = makeSut()
    const isValid = await sut.isValid('anyEmail@email.com')
    expect(isValid).toBe(true)
  })
})
