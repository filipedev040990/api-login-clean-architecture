import { HttpRequest } from '../../interfaces/http-interface'
import { AuthenticateController } from './authenticate-controller'
import { MissingParamError } from '../../shared/errors/missing-param-error'

interface SutTypes {
  sut: AuthenticateController
}
const makeSut = (): SutTypes => {
  const sut = new AuthenticateController()
  return { sut }
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
})
