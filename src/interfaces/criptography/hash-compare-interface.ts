export interface IHashCompare {
  execute (value: string, hash: string): Promise<boolean>
}
