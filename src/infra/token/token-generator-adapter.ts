import jwt from 'jsonwebtoken'
import { ITokenGenerator } from '../../interfaces/token/token-generator-interface'

export class TokenGeneratorAdapter implements ITokenGenerator {
  constructor (
    private readonly secretKey: string,
    private readonly expiresIn: string
  ) {}

  async execute (id: any): Promise<string> {
    const token = await jwt.sign(
      { id },
      this.secretKey,
      { expiresIn: this.expiresIn }
    )
    return token
  }
}
