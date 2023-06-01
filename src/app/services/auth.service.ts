import { UserRoles } from './../util/constants/user-roles.enum';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  AuthData,
  AuthResponse,
  DecodedAuthToken,
  Login,
  Signup,
  UserAuthGet,
} from 'src/app/models';
import { PubSubUtil, StoreKeys } from '../util';
import { AppService } from './app.service';
import { STORE_SERVICE, StoreService } from './interfaces';
import { PageService } from './page.service';
import { ToastService } from './toast.service';
import { TokenService } from './token.service';
import { AuthApiService } from './api/auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private accessTokenKey = StoreKeys.AccessToken;

  private _setAuthData = new BehaviorSubject<AuthData | null | undefined>(undefined);
  private _setLoggedUser = new BehaviorSubject<UserAuthGet | null | undefined>(undefined);

  private _authData: AuthData | null = null;

  private subscriptions: Subscription[] = [];

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

        const loggedIn = this.isLoggedIn;

        if (authData != null && loggedIn) {
          this.store.store<string>({ key: this.accessTokenKey, value: authData.token });
        } else {
          this.app.activateClearSessionState();
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

  get isLoggedIn(): boolean {
    return !!this._authData?.isValid;
  }

  get isAdmin(): boolean {
    return this.currentUserRoles.includes(UserRoles.Admin);
  }

  get currentUserRoles(): string[] {
    const decodedToken = this._authData?.decodedToken;

    if (decodedToken?.role) return [decodedToken.role];

    return decodedToken?.roles ?? [];
  }

  get setLoggedUser$(): Observable<UserAuthGet | null | undefined> {
    return this._setLoggedUser.asObservable();
  }

  constructor(
    private app: AppService,
    private api: AuthApiService,
    private toaster: ToastService,
    private pageService: PageService,
    @Inject(STORE_SERVICE) private store: StoreService,
    private tokenService: TokenService
  ) {
    this.initSubscriptions();
    this.retrieveTokenFromStore();
  }

  ngOnDestroy(): void {
    PubSubUtil.unsub(this.subscriptions);
  }

  retrieveTokenFromStore(): void {
    const token = this.store.get<string>(this.accessTokenKey);

    this.handleAuthResult(token);
  }

  private initSubscriptions() {
    const setAuthDataSub = this.setAuthData$.subscribe();
    const setAuthResponseSub = this.authResponse$.subscribe();

    PubSubUtil.unsub(this.subscriptions);
    this.subscriptions = [setAuthDataSub, setAuthResponseSub];
  }

  async login(data: Login): Promise<AuthResponse> {
    const res = await this.api.login(data);
    this.pageService.goToHome();
    return res;
  }

  async signup(data: Signup): Promise<AuthResponse> {
    const res = await this.api.signup(data);
    this.pageService.goToHome();
    return res;
  }

  logout(): void {
    this.emptyAuthData();
    this.goToLogin();
  }

  goToLogin = () => this.pageService.goToLogin();

  hasRoles(roles: string[] | undefined): boolean {
    if (!roles) return true;

    return roles.every((role) => this.currentUserRoles.includes(role));
  }

  private emptyAuthData(): void {
    this.store.remove(this.accessTokenKey);
    this._setLoggedUser.next(null);
    this.setAuthData(null);
  }

  private handleAuthResult(token: string | null | undefined, user?: UserAuthGet | null): void {
    const decodedToken = this.decodeAuthToken(token ?? '');
    if (!decodedToken) {
      this.emptyAuthData();

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

    try {
      const newUser = await this.api.getUserByEmail(email);
      if (!newUser) {
        this.toaster.info('Your user was not found. Please login again.');
        return this.logout();
      }
      this._setLoggedUser.next(newUser);
    } catch {
      this.logout();
    }
  }

  private decodeAuthToken(token: string): DecodedAuthToken | null {
    if (!token) return null;

    return this.tokenService.decode(token);
  }
}
