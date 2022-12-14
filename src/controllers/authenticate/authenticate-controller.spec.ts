import { HttpRequest, IEmailValidator, IAuthenticateUseCase } from '../../interfaces/'
import { AuthenticateController } from './authenticate-controller'
import { serverError, unauthorized } from '../../shared/helpers/http-helper'

interface SutTypes {
  sut: AuthenticateController
  emailValidatorStub: IEmailValidator
  authenticateUseCaseStub: IAuthenticateUseCase
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticateUseCaseStub = makeAuthenticateUseCaseStub()
  const sut = new AuthenticateController(emailValidatorStub, authenticateUseCaseStub)
  return { sut, emailValidatorStub, authenticateUseCaseStub }
}

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    async isValid (email: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailValidatorStub()
}

const makeAuthenticateUseCaseStub = (): IAuthenticateUseCase => {
  class AuthenticateUseCaseStub implements IAuthenticateUseCase {
    async execute (email: string, password: string): Promise<string> {
      return await Promise.resolve('anyToken')
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
      body: 'Missing param : email'
    })
  })

  test('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.password = null

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: 'Missing param : password'
    })
  })

  test('should return 400 if email invalid is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(Promise.resolve(false))

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: 'Invalid param : email'
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

  test('should return an accessToken if it authenticates successfully', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.execute(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        accessToken: 'anyToken'
      }
    })
  })
})
