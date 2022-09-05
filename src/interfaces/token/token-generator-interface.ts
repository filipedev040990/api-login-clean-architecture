export interface ITokenGenerator {
  execute (value: any): Promise<string>
}
