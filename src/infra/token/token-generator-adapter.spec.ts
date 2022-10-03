import jwt from 'jsonwebtoken'
import { TokenGeneratorAdapter } from './token-generator-adapter'
import config from '../../infra/config'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('anyToken')
  }
}))

const secretKey = config.jwt.secretKey
const expiresIn = config.jwt.expiresIn

const makeSut = (): TokenGeneratorAdapter => {
  return new TokenGeneratorAdapter(secretKey, expiresIn)
}

describe('TokenGeneratorAdapter', () => {
  test('should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    const id = '3552ba6f-00c4-42e1-82e8-e7646a67fc39'

    await sut.execute(id)
    expect(signSpy).toHaveBeenCalledWith({ id }, secretKey, { expiresIn })
  })

  test('should return an token when sign on success', async () => {
    const sut = makeSut()
    const id = '3552ba6f-00c4-42e1-82e8-e7646a67fc39'

    const token = await sut.execute(id)
    expect(token).toBe('anyToken')
  })
})
