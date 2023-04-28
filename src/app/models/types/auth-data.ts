import { UserAuthGet } from '../dtos/user';

export class AuthData {
  token: string;
  decodedToken: DecodedAuthToken;
  expiration: Date;
  user?: UserAuthGet;

  private constructor(token: string, decodedToken: DecodedAuthToken, user?: UserAuthGet) {
    this.token = token;
    this.user = user;
    this.decodedToken = decodedToken;
    this.expiration = new Date(this.decodedToken.exp * 1000);
  }

  get isValid(): boolean {
    return !!this.token && !this.isExpired;
  }

  get isExpired(): boolean {
    return Date.now() > this.expiration.getTime();
  }

  static fromSelf(self: AuthData | null): AuthData | null {
    if (self == null) return self;

    return new AuthData(self.token, self.decodedToken, self.user);
  }

  static fromToken(token: string, decodedAuthToken: DecodedAuthToken, user?: UserAuthGet): AuthData {
    return new AuthData(token, decodedAuthToken, user);
  }
}

export interface DecodedAuthToken {
  unique_name: string;
  email: string;
  nbf: number;
  exp: number;
  iat: number;
}
