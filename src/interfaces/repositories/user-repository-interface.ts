import { UserEntity } from '../../core/entities/user-entity'

export interface IUserRepository {
  getUserByEmail(email: string): Promise<UserEntity>
}
