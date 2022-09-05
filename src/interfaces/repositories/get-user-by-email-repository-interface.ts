import { UserEntity } from '../../core/entities/user-entity'

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<UserEntity>
}
