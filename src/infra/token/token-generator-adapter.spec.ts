import jwt from 'jsonwebtoken'
import { TokenGeneratorAdapter } from './token-generator-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('anyToken'))
  }
}))

const secretKey = '3299eb7b61176d4c651dc523969d1993'
const expiresIn = '1h'

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
