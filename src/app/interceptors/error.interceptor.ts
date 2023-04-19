import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private ts: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err) => this.handleHttpError(err)));
  }

  handleHttpError(err: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    const code = err.status;

    this.logErrors(err);
    this.notifyErrorByCode(code);

    return new Observable<HttpEvent<unknown>>();
  }

  notifyErrorByCode(code: number): void {
    const errorMessages: { [key: number]: string; default: string } = {
      401: 'Unauthorized access',
      404: 'Resource not found',
      400: 'Bad request',
      default: 'Internal Server error',
    };

    this.ts.error(errorMessages[code] || errorMessages.default);
  }

  logErrors(err: HttpErrorResponse): void {
    if (environment.production) return;

    console.table(err?.error?.errors);

    console.log(err);
  }
}
