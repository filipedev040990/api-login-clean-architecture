import { HttpRequest } from '../../interfaces/http-interface'
import { AuthenticateController } from './authenticate-controller'
import { MissingParamError } from '../../shared/errors/missing-param-error'
import { InvalidParamError } from '../../shared/errors/invalid-param-error'
import { EmailValidator } from '../../interfaces/email-validator'

interface SutTypes {
  sut: AuthenticateController
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new AuthenticateController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new EmailValidatorStub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'anyLogin',
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
})
