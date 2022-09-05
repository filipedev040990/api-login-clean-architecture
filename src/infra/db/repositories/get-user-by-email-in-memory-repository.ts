import { UserEntity } from '../../../core/entities/user-entity'
import { IGetUserByEmailRepository } from '../../../interfaces/repositories/get-user-by-email-repository-interface'

export class GetUserByEmailRepository implements IGetUserByEmailRepository {
  users = [
    {
      id: '3552ba6f-00c4-42e1-82e8-e7646a67fc39',
      email: 'anyEmail@email.com',
      password: 'hashedPassword',
      active: true
    }
  ]

  async execute (email: string): Promise<UserEntity> {
    const user = this.users.find(user => user.email === email)
    return await new Promise(resolve => resolve(user))
  }
}
