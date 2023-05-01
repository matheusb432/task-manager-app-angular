import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { us } from '../helpers';
import { ApiRequest } from '../models';
import { AuthResponse, Login, Signup } from '../models/dtos/auth';
import { AuthData, DecodedAuthToken } from '../models/types';
import { ApiEndpoints, ElementIds, StoreKeys } from '../utils';
import { ApiService, UserApiService } from './api';
import { STORE_SERVICE, StoreService } from './interfaces';
import { LoadingService } from './loading.service';
import { TokenService } from './token.service';
import { UserAuthGet } from '../models/dtos/user';
import { PageService } from './page.service';
import { User } from '../models/entities';

@Injectable({
  providedIn: 'root',
})
// TODO refactor into AuthApiService & AuthService
export class AuthService implements OnDestroy {
  private url = us.buildApiUrl(ApiEndpoints.Auth);
  private accessTokenKey = StoreKeys.AccessToken;

  private _setAuthResponse = new BehaviorSubject<AuthResponse | null | undefined>(undefined);
  private _setAuthData = new BehaviorSubject<AuthData | null | undefined>(undefined);
  private _setLoggedUser = new BehaviorSubject<UserAuthGet | null | undefined>(undefined);

  private _authData: AuthData | null = null;

  get authToken(): string | undefined {
    return this._authData?.token;
  }
  get setAuthData$(): Observable<AuthData | null | undefined> {
    return this._setAuthData.asObservable().pipe(
      map((authData) => {
        return AuthData.fromSelf(authData);
      }),
      tap((authData) => {
        if (authData === undefined) return;

        this._authData = authData;

        const loggedIn = this._authValidator();

        if (authData != null && loggedIn) {
          this.store.store<string>({ key: this.accessTokenKey, value: authData.token });
        } else {
          this.logout();
        }
      })
    );
  }

  private get _setAuthResponse$(): Observable<AuthResponse | null | undefined> {
    return this._setAuthResponse.asObservable().pipe(
      tap((res) => {
        if (res === undefined) return;

        const decodedToken = this.decodeAuthToken(res?.token ?? '');
        if (res == null || !decodedToken) {
          this._setLoggedUser.next(null);
          this.setAuthData(null);
          return;
        }

        if (res.user == null) {
          this.fetchUser(decodedToken.email);
        } else {
          this._setLoggedUser.next(res.user);
        }

        this.setAuthData(AuthData.fromToken(res.token as string, decodedToken));
      })
    );
  }

  get loggedIn$(): Observable<boolean> {
    return this.setAuthData$.pipe(map(this._authValidator.bind(this)));
  }

  get setLoggedUser$(): Observable<UserAuthGet | null | undefined> {
    return this._setLoggedUser.asObservable().pipe(
      map((user) => {
        if (user == null) return user;

        return new Mapper(UserAuthGet).map(user) as UserAuthGet;
      })
    );
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    private userApi: UserApiService,
    private pageService: PageService,
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
    const token = this.store.get<string>(this.accessTokenKey);
    if (token == null) {
      this.setAuthResponse(null);

      return;
    }

    this.setAuthResponse({ token });
  }

  private initSubscriptions() {
    const setAuthDataSub = this.setAuthData$.subscribe();
    const setAuthResponseSub = this._setAuthResponse$.subscribe();

    us.unsub(this.subscriptions);
    this.subscriptions = [setAuthDataSub, setAuthResponseSub];
  }

  async login(data: Login): Promise<AuthResponse> {
    const res = await this.api.insert<Login, AuthResponse>({
      ...ApiRequest.post(`${this.url}/login`, data),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.LoginSubmit) },
      mapFn: (res) => {
        if (res == null) return res;

        return new Mapper(AuthResponse).map(res);
      },
      // TODO add map & tap and configure them in login & signup
    });

    this.setAuthResponse(res);

    return res;
  }

  async signup(data: Signup): Promise<AuthResponse> {
    const res = await this.api.insert<Signup, AuthResponse>({
      ...ApiRequest.post(`${this.url}/signup`, data),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.SignupSubmit) },
      // TODO refactor to remove duplication
      mapFn: (res) => {
        if (res == null) return res;

        return new Mapper(AuthResponse).map(res);
      },
    });

    this.setAuthResponse(res);

    return res;
  }

  logout(): void {
    this.store.remove(this.accessTokenKey);
    this.goToLogin();
  }

  setAuthResponse(data: AuthResponse | null): void {
    this._setAuthResponse.next(data);
  }

  goToLogin = () => this.pageService.goToLogin();

  private setAuthData(data: AuthData | null): void {
    this._setAuthData.next(data);
  }

  private async fetchUser(email: string): Promise<void> {
    if (!email) return;

    const res = await this.userApi.getByEmail(email);

    const newUser = new Mapper(UserAuthGet).map(res) as UserAuthGet;

    this._setLoggedUser.next(newUser);
  }

  private decodeAuthToken(token: string): DecodedAuthToken | null {
    if (!token) return null;

    return this.tokenService.decode(token);
  }

  private _authValidator = (): boolean => {
    const authData = this._authData;
    return !!authData?.isValid;
  };
}
