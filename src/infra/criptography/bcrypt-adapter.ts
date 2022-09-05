import { IHashCompare } from '../../interfaces/criptography/hash-compare-interface'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHashCompare {
  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
