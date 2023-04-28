import { Inject, Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiRequest } from '../models';
import { AuthToken, LoginRequest } from '../models/types';
import { ElementIds, StoreKeys } from '../utils';
import { ApiService } from './api';
import { STORE_SERVICE, StoreService } from './interfaces';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { us } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private url = `${environment.apiUrl}/auth`;
  private accessTokenKey = StoreKeys.AccessToken;

  private _setAuthToken = new BehaviorSubject<AuthToken | null>(null);
  private _authToken: AuthToken | null = null;

  get setAuthToken$(): Observable<AuthToken | null> {
    return this._setAuthToken.asObservable().pipe(
      map((authToken) => us.deepClone(authToken)),
      tap((authToken) => {
        this._authToken = authToken;
        const loggedIn = this._authTokenValidator();

        if (loggedIn) {
          this.store.store({ key: this.accessTokenKey, value: authToken });
        } else {
          this.store.remove(this.accessTokenKey);
        }
      })
    );
  }

  get loggedIn$(): Observable<boolean> {
    return this.setAuthToken$.pipe(map(this._authTokenValidator.bind(this)));
  }

  private subscriptions: Subscription[] = [];

  constructor(private api: ApiService, @Inject(STORE_SERVICE) private store: StoreService) {
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  private initSubscriptions() {
    const setAuthTokenSub = this.setAuthToken$.subscribe();

    us.unsub(this.subscriptions);
    this.subscriptions = [setAuthTokenSub];
  }

  // TODO test
  async login(email: string, password: string): Promise<AuthToken> {
    const res = await this.api.insert<LoginRequest, AuthToken>({
      ...ApiRequest.post(`${this.url}/login`, { email, password }),
      customData: { loading: { targetElId: ElementIds.LoginForm } },
    });

    this.setAuthToken(res);

    return res;
  }

  // TODO test
  async signup(email: string, password: string): Promise<AuthToken> {
    const res = await this.api.insert<LoginRequest, AuthToken>({
      ...ApiRequest.post(`${this.url}/signup`, { email, password }),
      customData: { loading: { targetElId: ElementIds.SignupForm } },
    });

    this.setAuthToken(res);

    return res;
  }

  // TODO test
  logout(): void {
    this.setAuthToken(null);
  }

  setAuthToken(authToken: AuthToken | null): void {
    this._setAuthToken.next(authToken);
  }

  private _authTokenValidator = (): boolean => {
    const authToken = this._authToken;
    if (authToken == null) return false;
    const { access_token, expires_in } = authToken;

    return !!access_token && expires_in > 0;
  };
}
