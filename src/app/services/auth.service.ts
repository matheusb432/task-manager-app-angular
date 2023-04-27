import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api';
import { ApiRequest } from '../models';
import { AuthToken, LoginRequest } from '../models/types';
import { ElementIds } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  isLoggedIn = false;

  constructor(private api: ApiService) {}

  // TODO implement
  login(email: string, password: string): Promise<AuthToken> {
    return this.api.insert<LoginRequest, AuthToken>({
      ...ApiRequest.post(this.url, { email, password }),
      customData: { loading: { targetElId: ElementIds.LoginForm } },
    });
  }

  // TODO implement
  logout() {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('refresh_token', 'token');

    return Promise.resolve();
  }
}
