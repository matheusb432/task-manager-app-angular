import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Mapper } from 'mapper-ts/lib-esm';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { us } from '../helpers';
import { AuthResponse, Login, Signup } from '../models/dtos/auth';
import { UserAuthGet } from '../models/dtos/user';
import { AuthData, DecodedAuthToken } from '../models/types';
import { StoreKeys, paths } from '../utils';
import { AuthApiService } from './api/auth-api.service';
import { STORE_SERVICE, StoreService } from './interfaces';
import { PageService } from './page.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private accessTokenKey = StoreKeys.AccessToken;

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
          // TODO move logic to route guard
          this.pageService.goToHome();
        } else {
          this.logout();
        }
      })
    );
  }

  private get authResponse$(): Observable<AuthResponse | null | undefined> {
    return this.api.authResponse$.pipe(
      tap((res) => {
        if (res === undefined) return;
        this.handleAuthResult(res?.token, res?.user);
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
    private api: AuthApiService,
    private pageService: PageService,
    @Inject(STORE_SERVICE) private store: StoreService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.initSubscriptions();
    this.retrieveTokenFromStore();
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  retrieveTokenFromStore(): void {
    const token = this.store.get<string>(this.accessTokenKey);

    this.handleAuthResult(token);
  }

  private initSubscriptions() {
    const setAuthDataSub = this.setAuthData$.subscribe();
    const setAuthResponseSub = this.authResponse$.subscribe();

    us.unsub(this.subscriptions);
    this.subscriptions = [setAuthDataSub, setAuthResponseSub];
  }

  async login(data: Login): Promise<AuthResponse> {
    return this.api.login(data);
  }

  async signup(data: Signup): Promise<AuthResponse> {
    return this.api.signup(data);
  }

  logout(): void {
    this.store.remove(this.accessTokenKey);
    // TODO move logic to route guard
    if (!this.isAuthPage()) this.goToLogin();
  }

  isAuthPage(): boolean {
    return this.router.url === paths.login || this.router.url === paths.signup;
  }

  goToLogin = () => this.pageService.goToLogin();

  private handleAuthResult(token: string | null | undefined, user?: UserAuthGet | null) {
    const decodedToken = this.decodeAuthToken(token ?? '');
    if (!decodedToken) {
      this._setLoggedUser.next(null);
      this.setAuthData(null);
      return;
    }

    if (user == null) {
      this.fetchUser(decodedToken.email);
    } else {
      this._setLoggedUser.next(user);
    }

    this.setAuthData(AuthData.fromToken(token as string, decodedToken));
  }

  private setAuthData(data: AuthData | null): void {
    this._setAuthData.next(data);
  }
  private async fetchUser(email: string): Promise<void> {
    if (!email) return;

    const newUser = await this.api.getUserByEmail(email);

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
