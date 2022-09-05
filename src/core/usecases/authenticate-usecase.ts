import { IHashCompare } from '../../interfaces/criptography/hash-compare-interface'
import { IGetUserByEmailRepository } from '../../interfaces/repositories/get-user-by-email-repository-interface'
import { IAuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'

export class AuthenticateUseCase implements IAuthenticateUseCase {
  constructor (
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly hashCompare: IHashCompare
  ) {}

  async execute (email: string, password: string): Promise<string> {
    const user = await this.getUserByEmailRepository.execute(email)
    if (!user) {
      return null
    }

    const isValidPassword = await this.hashCompare.execute(password, user.password)
    if (!isValidPassword) {
      return null
    }
  }
}
