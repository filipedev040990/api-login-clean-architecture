import { HttpResponse } from '../../interfaces/http-interface'
import { ServerError } from '../errors/server-error'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: 'Unauthorized'
})
