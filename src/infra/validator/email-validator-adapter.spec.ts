import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'
import { IEmailValidator } from '../../interfaces/validator/email-validator'

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

  test('should return false if validator return false', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = await sut.isValid('invalidEmail')
    expect(isValid).toBe(false)
  })
})
