import { UserEntity } from '../../core/entities/user-entity'

export interface GetUserByEmailRepository {
  execute(email: string): Promise<UserEntity>
}
