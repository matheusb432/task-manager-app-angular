import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private service: LoadingService, private appService: AppService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const [key, data] = this.service.getLoadingByUrlFromAppRequests(request.url);
    const loadings = data?.loadings;
    if (key == null || loadings == null) return next.handle(request);

    this.service.addLoadings(key, loadings);

    return next.handle(request).pipe(
      finalize(() => {
        this.service.removeLoadings(loadings);
        this.appService.removeRequestData(key as string);
      })
    );
  }
}
