import { AuthenticateController } from '../../controllers/authenticate/authenticate-controller'
import { EmailValidatorAdapter } from '../../infra/validator/email-validator-adapter'
import { AuthenticateUseCase } from '../usecases/authenticate-usecase'
import { GetUserByEmailRepositoryInMemory } from '../../infra/db/repositories/get-user-by-email-in-memory-repository'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { TokenGeneratorAdapter } from '../../infra/token/token-generator-adapter'

export const makeAuthenticateController = (): AuthenticateController => {
  const emailValidator = new EmailValidatorAdapter()
  const getUserByEmailRepository = new GetUserByEmailRepositoryInMemory()
  const hashCompare = new BcryptAdapter()

  const secretKey = '3299eb7b61176d4c651dc523969d1993'
  const expiresIn = '1h'
  const tokenGenerator = new TokenGeneratorAdapter(secretKey, expiresIn)
  const authenticateUseCase = new AuthenticateUseCase(getUserByEmailRepository, hashCompare, tokenGenerator)
  return new AuthenticateController(emailValidator, authenticateUseCase)
}
