import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services';
import { ApiEndpoints } from '../utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private service: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = request.url;

    if (url.includes(ApiEndpoints.Auth)) return next.handle(request);

    const newRequest = this.cloneWithToken(request);

    return next.handle(newRequest);
  }

  cloneWithToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.service.authToken;

    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
