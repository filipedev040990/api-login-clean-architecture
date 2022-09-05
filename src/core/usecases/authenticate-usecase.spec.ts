import { IGetUserByEmailRepository } from '../../interfaces/repositories/get-user-by-email-repository-interface'
import { IAuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'
import { AuthenticateUseCase } from './authenticate-usecase'
import { UserEntity } from '../entities/user-entity'
import { IHashCompare } from '../../interfaces/criptography/hash-compare-interface'

interface ISut {
  sut: IAuthenticateUseCase
  getUserByEmailRepositoryStub: IGetUserByEmailRepository
  hashCompareStub: IHashCompare
}

const makeSut = (): ISut => {
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepositoryStub()
  const hashCompareStub = makeHashCompareStub()
  const sut = new AuthenticateUseCase(getUserByEmailRepositoryStub, hashCompareStub)

  return { sut, getUserByEmailRepositoryStub, hashCompareStub }
}

const makeGetUserByEmailRepositoryStub = (): IGetUserByEmailRepository => {
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

const makeHashCompareStub = (): IHashCompare => {
  class HashCompare implements IHashCompare {
    async execute (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashCompare()
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

  test('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const hashCompareSpy = jest.spyOn(hashCompareStub, 'execute')

    await sut.execute('anyEmail@email.com.br', 'anyPassword')
    expect(hashCompareSpy).toHaveBeenCalledWith('anyPassword', 'hashedPassword')
  })

  test('should return null if HashCompare return false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'execute').mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const httpResponse = await sut.execute('anyEmail@email.com.br', 'anyPassword')
    expect(httpResponse).toBe(null)
  })
})
