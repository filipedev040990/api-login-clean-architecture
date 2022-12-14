import { Controller, IEmailValidator, HttpRequest, HttpResponse, IAuthenticateUseCase } from '../../interfaces'
import { InvalidParamError, MissingParamError } from '../../shared/errors'
import { badRequest, serverError, success, unauthorized } from '../../shared/helpers/http-helper'

export class AuthenticateController implements Controller {
  constructor (
    private readonly emailValidator: IEmailValidator,
    private readonly authenticateUseCase: IAuthenticateUseCase
  ) {}

  async execute (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body
      const isValid = await this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authenticateUseCase.execute(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return success({ accessToken })
    } catch (error) {
      return serverError()
    }
  }
}
