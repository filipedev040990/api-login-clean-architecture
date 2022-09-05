import { Controller } from '../../interfaces/controller-interface'
import { HttpRequest, HttpResponse } from '../../interfaces/http-interface'
import { MissingParamError } from '../../shared/errors/missing-param-error'
import { badRequest } from '../../shared/helpers/http-helper'

export class AuthenticateController implements Controller {
  async execute (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return await new Promise(resolve => resolve(null))
  }
}
