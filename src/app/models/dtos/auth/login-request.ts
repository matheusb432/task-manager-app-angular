export class LoginRequest {
  private constructor(
    public password: string,
    public email?: string,
    public userName?: string
  ) {}

  static withEmail(email: string, password: string): LoginRequest {
    return new LoginRequest(password, email);
  }

  static withUserName(userName: string, password: string): LoginRequest {
    return new LoginRequest(password, undefined, userName);
  }
}
