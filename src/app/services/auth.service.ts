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
  login(email: string, password: string) {
    return Promise.resolve();
  }

  // TODO implement
  logout() {
    return Promise.resolve();
  }
}
