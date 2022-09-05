import { IGetUserByEmailRepository } from '../../interfaces/repositories/get-user-by-email-repository-interface'
import { IAuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'

export class AuthenticateUseCase implements IAuthenticateUseCase {
  constructor (private readonly getUserByEmailRepository: IGetUserByEmailRepository) {}
  async execute (email: string, password: string): Promise<string> {
    const user = await this.getUserByEmailRepository.execute(email)
    if (!user) {
      return null
    }
  }
}
