import { Router } from 'express'
import { adapterRoute } from './core/adapters/express-route-adapter'
import { makeAuthenticateController } from './core/factories/authenticate-factory'

const router = Router()

router.post('/authenticate', adapterRoute(makeAuthenticateController()))
export { router }
