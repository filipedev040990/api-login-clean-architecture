import { UserEntity } from '../../../core/entities/user-entity'
import { IGetUserByEmailRepository } from '../../../interfaces/repositories/get-user-by-email-repository-interface'

export class GetUserByEmailRepositoryInMemory implements IGetUserByEmailRepository {
  users = [
    {
      id: '3552ba6f-00c4-42e1-82e8-e7646a67fc39',
      email: 'teste@email.com',
      password: '$2a$12$EEUwZZtsfqwWg8dfNJRNAOq3DUpB0LKrmy8aBVgCLUC4xg5v8J36a', // Este é o hash da senha 123456789
      active: true
    }
  ]

  async execute (email: string): Promise<UserEntity> {
    const user = this.users.find(user => user.email === email)
    return await new Promise(resolve => resolve(user))
  }
}
