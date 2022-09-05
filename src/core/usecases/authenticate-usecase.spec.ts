import { IGetUserByEmailRepository } from '../../interfaces/repositories/get-user-by-email-repository-interface'
import { IAuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'
import { AuthenticateUseCase } from './authenticate-usecase'
import { UserEntity } from '../entities/user-entity'

interface ISut {
  sut: IAuthenticateUseCase
  getUserByEmailRepositoryStub: IGetUserByEmailRepository
}

const makeSut = (): ISut => {
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepositoryStub()
  const sut = new AuthenticateUseCase(getUserByEmailRepositoryStub)

  return { sut, getUserByEmailRepositoryStub }
}

export const makeGetUserByEmailRepositoryStub = (): IGetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    async execute (email: string): Promise<UserEntity> {
      const user = {
        id: '3552ba6f-00c4-42e1-82e8-e7646a67fc39',
        email: 'anyEmail@email.com',
        password: 'hashedPassword',
        active: true
      }
      return await new Promise(resolve => resolve(user))
    }
  }
  return new GetUserByEmailRepositoryStub()
}

describe('AuthenticateUseCase', () => {
  test('should getUserByEmailRepository with correct email', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    const repoSpy = jest.spyOn(getUserByEmailRepositoryStub, 'execute')

    await sut.execute('anyEmail@email.com.br', 'anyPassword')
    expect(repoSpy).toHaveBeenCalledWith('anyEmail@email.com.br')
  })

  test('should return null if getUserByEmailRepository return null', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockReturnValueOnce(null)

    const httpResponse = await sut.execute('anyEmail@email.com.br', 'anyPassword')
    expect(httpResponse).toBe(null)
  })
})
