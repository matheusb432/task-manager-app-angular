import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const code = err.status;

        if (!environment.production) {
          console.table(err?.error?.errors);

          console.log(err);
        }

        switch (code) {
          case 401:
            break;
          case 404:
            break;
          case 400:
            break;
          case code >= 500 && code <= 599:
            break;
          default:
        }
        return new Observable<HttpEvent<any>>();
      })
    );
  }
}
