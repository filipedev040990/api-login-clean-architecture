import { HttpRequest } from '../../interfaces/http-interface'
import { AuthenticateController } from './authenticate-controller'
import { MissingParamError } from '../../shared/errors/missing-param-error'
import { InvalidParamError } from '../../shared/errors/invalid-param-error'
import { EmailValidator } from '../../interfaces/email-validator'
import { serverError, unauthorized } from '../../shared/helpers/http-helper'
import { AuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'

interface SutTypes {
  sut: AuthenticateController
  emailValidatorStub: EmailValidator
  authenticateUseCaseStub: AuthenticateUseCase
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticateUseCaseStub = makeAuthenticateUseCaseStub()
  const sut = new AuthenticateController(emailValidatorStub, authenticateUseCaseStub)
  return { sut, emailValidatorStub, authenticateUseCaseStub }
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new EmailValidatorStub()
}

const makeAuthenticateUseCaseStub = (): AuthenticateUseCase => {
  class AuthenticateUseCaseStub implements AuthenticateUseCase {
    async execute (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('anyToken'))
    }
  }
  return new AuthenticateUseCaseStub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'anyEmail@email.com',
    password: 'anyPassword'
  }
})

describe('AuthenticateController', () => {
  test('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = null

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('email')
    })
  })

  test('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.password = null

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('password')
    })
  })

  test('should return 400 if email invalid is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email')
    })
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.execute(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('anyEmail@email.com')
  })

  test('should throw exception if EmailValidator throw exception', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(async () => { throw new Error() })

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('should return 401 if email or password not exists in database', async () => {
    const { sut, authenticateUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()

    jest.spyOn(authenticateUseCaseStub, 'execute').mockReturnValueOnce(null)

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })
})
