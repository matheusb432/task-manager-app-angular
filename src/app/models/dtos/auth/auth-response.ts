import { AddMap } from 'mapper-ts/lib-esm';
import { UserAuthGet } from '../user/user-auth-get';

export class AuthResponse {
  @AddMap(UserAuthGet)
  user?: UserAuthGet;
  token?: string;
}
