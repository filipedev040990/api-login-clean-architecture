import { IHashCompare } from '../../interfaces/criptography/hash-compare-interface'
import { IUserRepository } from '../../interfaces/repositories/user-repository-interface'
import { ITokenGenerator } from '../../interfaces/token/token-generator-interface'
import { IAuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'

export class AuthenticateUseCase implements IAuthenticateUseCase {
  constructor (
    private readonly getUserByEmailRepository: IUserRepository,
    private readonly hashCompare: IHashCompare,
    private readonly tokenGenerator: ITokenGenerator
  ) {}

  async execute (email: string, password: string): Promise<string> {
    const user = await this.getUserByEmailRepository.getUserByEmail(email)
    if (!user) {
      return null
    }

    const isValidPassword = await this.hashCompare.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }

    const accessToken = await this.tokenGenerator.execute(user.id)
    if (!accessToken) {
      return null
    }
    return accessToken
  }
}
