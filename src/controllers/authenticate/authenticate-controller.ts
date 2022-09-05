import { Controller } from '../../interfaces/controller-interface'
import { EmailValidator } from '../../interfaces/email-validator'
import { HttpRequest, HttpResponse } from '../../interfaces/http-interface'
import { AuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'
import { InvalidParamError } from '../../shared/errors/invalid-param-error'
import { MissingParamError } from '../../shared/errors/missing-param-error'
import { badRequest, serverError, unauthorized } from '../../shared/helpers/http-helper'

export class AuthenticateController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticateUseCase: AuthenticateUseCase
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

      return await new Promise(resolve => resolve(null))
    } catch (error) {
      return serverError()
    }
  }
}
