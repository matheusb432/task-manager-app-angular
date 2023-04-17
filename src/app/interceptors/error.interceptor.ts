import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private ts: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const code = err.status;

        if (!environment.production) {
          console.table(err?.error?.errors);

          console.log(err);
        }

        switch (code) {
          case 401:
            this.ts.error('Unauthorized access');
            break;
          case 404:
            this.ts.error('Resource not found');
            break;
          case 400:
            this.ts.error('Bad request');
            break;
          default:
            this.ts.error('Internal Server error');
            break;
        }
        return new Observable<HttpEvent<any>>();
      })
    );
  }
}
