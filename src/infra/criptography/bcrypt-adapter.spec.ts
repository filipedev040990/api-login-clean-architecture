import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async compare (value: string, hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter()
}

describe('BcryptAdapter', () => {
  test('Should call compare with correct value', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('password', 'hashedPassword')
    expect(compareSpy).toHaveBeenCalledWith('password', 'hashedPassword')
  })

  test('Should return true when compare on succeeds', async () => {
    const sut = makeSut()
    const isValidPassword = await sut.compare('password', 'hashedPassword')
    expect(isValidPassword).toBe(true)
  })

  test('Should return false when compare on fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const isValidPassword = await sut.compare('password', 'hashedPassword')
    expect(isValidPassword).toBe(false)
  })
})
