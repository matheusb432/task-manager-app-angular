import { us } from 'src/app/helpers';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { AppService } from '../services/app.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private service: LoadingService, private appService: AppService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const [key, data] = this.service.getLoadingByUrlFromAppRequests(request.url);
    const loadingData = data?.loading;
    if (loadingData == null) return next.handle(request);

    this.service.addLoading(loadingData);

    return next.handle(request).pipe(
      finalize(() => {
        this.service.removeLoading(loadingData);
        this.appService.removeRequestData(key as string);
      })
    );
  }
}
