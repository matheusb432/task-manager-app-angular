import { Injectable } from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { BehaviorSubject, Observable } from 'rxjs';
import { us } from 'src/app/helpers';
import { ApiRequest } from 'src/app/models';
import { AuthResponse, Login, Signup } from 'src/app/models/dtos/auth';
import { UserAuthGet } from 'src/app/models/dtos/user';
import { ApiEndpoints, ElementIds } from 'src/app/utils';
import { LoadingService } from '../loading.service';
import { ApiService } from './api.service';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private url = us.buildApiUrl(ApiEndpoints.Auth);

  private authResponseSet = new BehaviorSubject<AuthResponse | null | undefined>(undefined);

  get authResponse$(): Observable<AuthResponse | null | undefined> {
    return this.authResponseSet.asObservable();
  }

  constructor(private api: ApiService, private userApi: UserApiService) {}

  async login(data: Login): Promise<AuthResponse> {
    return this.api.insert(this.createAuthApiRequest('login', ElementIds.LoginSubmit, data));
  }

  async signup(data: Signup): Promise<AuthResponse> {
    return this.api.insert(this.createAuthApiRequest('signup', ElementIds.SignupSubmit, data));
  }

  async getUserByEmail(email: string): Promise<UserAuthGet | null> {
    const res = await this.userApi.getByEmail(email);

    if (res == null) return null;

    return new Mapper(UserAuthGet).map(res) as UserAuthGet;
  }

  private createAuthApiRequest<T>(endpoint: string, elId: string, data: T): ApiRequest<T> {
    return {
      ...ApiRequest.post(`${this.url}/${endpoint}`, data),
      customData: { loadings: LoadingService.createManyFromId(elId) },
      mapFn: (res) => this.mapAuthResponse(res),
      tapFn: (res: AuthResponse | null) => this.tapAuthResponse(res),
    };
  }

  private setAuthResponse(data: AuthResponse | null): void {
    this.authResponseSet.next(data);
  }

  private mapAuthResponse(res: unknown) {
    if (res == null) return res;

    return new Mapper(AuthResponse).map(res);
  }

  private tapAuthResponse(res: AuthResponse | null) {
    this.setAuthResponse(res);
  }
}