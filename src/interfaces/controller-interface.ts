import { HttpRequest, HttpResponse } from './http-interface'

export interface Controller {
  execute(httpRequest: HttpRequest): HttpResponse
}
