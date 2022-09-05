import { Request, Response } from 'express'
import { Controller } from '../../interfaces/controller-interface'

export const adapterRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest = { body: req.body }
    const httpResponse = await controller.execute(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
