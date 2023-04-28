import { Inject, Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiRequest } from '../models';
import { AuthData, DecodedAuthToken } from '../models/types';
import { ElementIds, StoreKeys } from '../utils';
import { ApiService } from './api';
import { STORE_SERVICE, StoreService } from './interfaces';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { us } from '../helpers';
import { Mapper } from 'mapper-ts/lib-esm';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/dtos/auth';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private url = `${environment.apiUrl}/auth`;
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
          // TODO decode token when retrieving from store
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

  constructor(private api: ApiService, @Inject(STORE_SERVICE) private store: StoreService) {
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  private initSubscriptions() {
    const setAuthDataSub = this.setAuthData$.subscribe();

    us.unsub(this.subscriptions);
    this.subscriptions = [setAuthDataSub];
  }

  // TODO test
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await this.api.insert<LoginRequest, AuthResponse>({
      ...ApiRequest.post(`${this.url}/login`, data),
      customData: { loading: { targetElId: ElementIds.LoginForm } },
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

  // TODO test
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const res = await this.api.insert<SignupRequest, AuthResponse>({
      ...ApiRequest.post(`${this.url}/signup`, data),
      customData: { loading: { targetElId: ElementIds.SignupForm } },
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

  // TODO move to separate TokenService ?
  // TODO research on how to mock injected services
  private decodeAuthToken(token: string): DecodedAuthToken | null {
    return token != null ? jwtDecode(token) : null;
  }

  private _authValidator = (): boolean => {
    const authData = this._authData;
    return !!authData?.isValid;
  };
}
