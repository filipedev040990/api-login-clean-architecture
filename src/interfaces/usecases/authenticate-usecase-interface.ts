export interface AuthenticateUseCase {
  execute (email: string, password: string): Promise<string>
}
