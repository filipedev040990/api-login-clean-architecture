import { IGetUserByEmailRepository } from '../../interfaces/repositories/get-user-by-email-repository-interface'
import { IAuthenticateUseCase } from '../../interfaces/usecases/authenticate-usecase-interface'
import { AuthenticateUseCase } from './authenticate-usecase'
import { IHashCompare } from '../../interfaces/criptography/hash-compare-interface'
import { ITokenGenerator } from '../../interfaces/token/token-generator-interface'
import { GetUserByEmailRepository } from '../../infra/db/repositories/get-user-by-email-in-memory-repository'

interface ISut {
  sut: IAuthenticateUseCase
  getUserByEmailRepositoryStub: IGetUserByEmailRepository
  hashCompareStub: IHashCompare
  tokenGeneratorStub: ITokenGenerator
}

const makeSut = (): ISut => {
  const getUserByEmailRepositoryStub = new GetUserByEmailRepository()
  const hashCompareStub = makeHashCompareStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const sut = new AuthenticateUseCase(getUserByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub)

  return { sut, getUserByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub }
}

const makeHashCompareStub = (): IHashCompare => {
  class HashCompare implements IHashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashCompare()
}

const makeTokenGeneratorStub = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async execute (value: any): Promise<string> {
      return await new Promise(resolve => resolve('anyToken'))
    }
  }
  return new TokenGeneratorStub()
}

describe('AuthenticateUseCase', () => {
  test('should call getUserByEmailRepository with correct email', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    const repoSpy = jest.spyOn(getUserByEmailRepositoryStub, 'execute')

    await sut.execute('anyEmail@email.com', 'anyPassword')
    expect(repoSpy).toHaveBeenCalledWith('anyEmail@email.com')
  })

  test('should return null if getUserByEmailRepository return null', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockReturnValueOnce(null)

    const httpResponse = await sut.execute('anyEmail@email.com', 'anyPassword')
    expect(httpResponse).toBe(null)
  })

  test('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const hashCompareSpy = jest.spyOn(hashCompareStub, 'compare')

    await sut.execute('anyEmail@email.com', 'anyPassword')
    expect(hashCompareSpy).toHaveBeenCalledWith('anyPassword', 'hashedPassword')
  })

  test('should return null if HashCompare return false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const httpResponse = await sut.execute('anyEmail@email.com', 'anyPassword')
    expect(httpResponse).toBe(null)
  })

  test('should call tokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'execute')

    await sut.execute('anyEmail@email.com', 'anyPassword')
    expect(tokenGeneratorSpy).toHaveBeenCalledWith('3552ba6f-00c4-42e1-82e8-e7646a67fc39')
  })

  test('should return accessToken on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.execute('anyEmail@email.com', 'anyPassword')
    expect(httpResponse).toBe('anyToken')
  })
})
