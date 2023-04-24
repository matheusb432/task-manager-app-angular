import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {finalize} from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private service: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // show loading spinner or progress bar
    // depending on your UI library or implementation
    // for example: showLoadingSpinner();
    console.log(request);
    console.log('calling request...');
    console.log((request as any)['targetElId'])

    return next.handle(request).pipe(
      finalize(() => {
        console.log('finalized!');
        // hide loading spinner or progress bar
        // depending on your UI library or implementation
        // for example: hideLoadingSpinner();
      })
    );
  }

}
