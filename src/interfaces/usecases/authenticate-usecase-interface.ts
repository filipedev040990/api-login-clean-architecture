export interface IAuthenticateUseCase {
  execute (email: string, password: string): Promise<string>
}
