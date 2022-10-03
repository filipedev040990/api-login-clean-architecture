import { AuthenticateController } from '../../controllers/authenticate/authenticate-controller'
import { EmailValidatorAdapter } from '../../infra/validator/email-validator-adapter'
import { AuthenticateUseCase } from '../usecases/authenticate-usecase'
import { UserRepositoryInMemory } from '../../infra/db/repositories/user-in-memory-repository'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { TokenGeneratorAdapter } from '../../infra/token/token-generator-adapter'
import config from '../../infra/config'

export const makeAuthenticateController = (): AuthenticateController => {
  const emailValidator = new EmailValidatorAdapter()
  const userRepository = new UserRepositoryInMemory()
  const hashCompare = new BcryptAdapter()

  const secretKey = config.jwt.secretKey
  const expiresIn = config.jwt.expiresIn
  const tokenGenerator = new TokenGeneratorAdapter(secretKey, expiresIn)
  const authenticateUseCase = new AuthenticateUseCase(userRepository, hashCompare, tokenGenerator)
  return new AuthenticateController(emailValidator, authenticateUseCase)
}
