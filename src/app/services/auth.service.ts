import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { us } from '../helpers';
import { ApiRequest } from '../models';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/dtos/auth';
import { AuthData, DecodedAuthToken } from '../models/types';
import { ApiEndpoints, ElementIds, StoreKeys } from '../utils';
import { ApiService } from './api';
import { STORE_SERVICE, StoreService } from './interfaces';
import { LoadingService } from './loading.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
// TODO refactor into AuthApiService & AuthService
export class AuthService implements OnDestroy {
  private url = us.buildApiUrl(ApiEndpoints.Auth);
  private accessTokenKey = StoreKeys.AccessToken;

  private _setAuthData = new BehaviorSubject<AuthData | null>(null);
  private _authData: AuthData | null = null;

  get authToken(): string | undefined {
    return this._authData?.token;
  }

  get setAuthData$(): Observable<AuthData | null> {
    return this._setAuthData.asObservable().pipe(
      map((authData) => AuthData.fromSelf(authData)),
      tap((authData) => {
        this._authData = authData;
        const loggedIn = this._authValidator();

        if (authData != null && loggedIn) {
          this.store.store<string>({ key: this.accessTokenKey, value: authData.token });
        } else {
          this.store.remove(this.accessTokenKey);
        }
      })
    );
  }

  get loggedIn$(): Observable<boolean> {
    return this.setAuthData$.pipe(map(this._authValidator.bind(this)));
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    @Inject(STORE_SERVICE) private store: StoreService,
    private tokenService: TokenService
  ) {
    this.initSubscriptions();
    this.retrieveTokenFromStore();
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  retrieveTokenFromStore(): void {
    if (this._authData != null) return;

    const token = this.store.get<string>(this.accessTokenKey);
    if (token == null) return;

    const decodedToken = this.decodeAuthToken(token);
    if (decodedToken == null) return;

    this.setAuthData(AuthData.fromToken(token, decodedToken));
  }

  private initSubscriptions() {
    const setAuthDataSub = this.setAuthData$.subscribe();

    us.unsub(this.subscriptions);
    this.subscriptions = [setAuthDataSub];
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await this.api.insert<LoginRequest, AuthResponse>({
      ...ApiRequest.post(`${this.url}/login`, data),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.LoginForm) },
      resCallback: (res) => {
        if (res == null) return res;

        return new Mapper(AuthResponse).map(res);
      },
      // TODO add map & tap and configure them in login & signup
    });

    if (res?.token == null) {
      this.setAuthData(null);
      return res;
    }

    const decodedToken = this.decodeAuthToken(res.token);
    // TODO refactor
    this.setAuthData(AuthData.fromToken(res.token, decodedToken!, res.user));

    return res;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const res = await this.api.insert<SignupRequest, AuthResponse>({
      ...ApiRequest.post(`${this.url}/signup`, data),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.SignupForm) },
      // TODO refactor to remove duplication
      resCallback: (res) => {
        if (res == null) return res;

        return new Mapper(AuthResponse).map(res);
      },
    });

    if (res?.token == null) {
      this.setAuthData(null);
      return res;
    }

    const decodedToken = this.decodeAuthToken(res.token);
    // TODO refactor
    this.setAuthData(AuthData.fromToken(res.token, decodedToken!, res.user));

    return res;
  }

  // TODO test
  logout(): void {
    this.setAuthData(null);
  }

  setAuthData(data: AuthData | null): void {
    this._setAuthData.next(data);
  }

  private decodeAuthToken(token: string): DecodedAuthToken | null {
    return this.tokenService.decode(token);
  }

  private _authValidator = (): boolean => {
    const authData = this._authData;
    return !!authData?.isValid;
  };
}
