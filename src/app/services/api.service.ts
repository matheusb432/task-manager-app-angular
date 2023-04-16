import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiRequest, ErrorMessages, Requests, ResCallback } from 'src/app/models';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  async getAll<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.Get](apiReq)) {
      this.handleError();

      return Promise.reject(ErrorMessages.InvalidURLRequest);
    }

    const req$ = this._getRequest<T>({...apiReq, url: `${apiReq.url}/odata`});

    return this._returnAsync<T>(req$, apiReq.resCallback);
  }

  async getById<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.GetById](apiReq)) {
      this.handleError();

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    // TODO Utility class to build OData queries
    const req$ = this._getRequest<T>({...apiReq, url: `${apiReq.url}/odata?$filter=id eq ${apiReq.id}`});

    return this._returnAsync<T>(req$, apiReq.resCallback);
  }

  async insert<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.Post](apiReq)) {
      this.handleError();

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    const req$ = this._postRequest<T>(apiReq);

    return this._returnAsync(req$);
  }

  async update<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.Put](apiReq)) {
      this.handleError();

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    apiReq.url = this.urlWithId(apiReq);

    const req$ = this._putRequest<T>(apiReq);

    return this._returnAsync(req$);
  }

  async remove<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.Delete](apiReq)) {
      this.handleError();

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    apiReq.url = this.urlWithId(apiReq);

    const req$ = this._deleteRequest<T>(apiReq);

    return this._returnAsync(req$);
  }

  handleError(): void {}

  handleHttpError(err: HttpErrorResponse, req: Observable<any>): void {
    if (!environment.production) {
      console.log(err, req);
    }
  }

  private _getRequest<T>({ url, itemType }: ApiRequest<T>): Observable<T> {
    return this.http.get<T>(url).pipe(
      map((data: any) => {
        if (!itemType) return data;

        return new Mapper(itemType).map(data);
      })
    );
  }

  private _postRequest<T>({ url, item, postDto }: ApiRequest<T>): Observable<T> {
    const mappedItem = new Mapper(postDto!).map(item!);

    return this.http.post<T>(url, mappedItem);
  }

  private _putRequest<T>({ url, item, putDto }: ApiRequest<T>): Observable<T> {
    const mappedItem = new Mapper(putDto!).map(item!);

    return this.http.put<T>(url, mappedItem);
  }

  private _deleteRequest<T>({ url }: ApiRequest<T>): Observable<T> {
    return this.http.delete<T>(url);
  }

  private async _returnAsync<T>(req$: Observable<T>, resCallback?: ResCallback): Promise<T> {
    return lastValueFrom(req$)
      .then((res: T) => {
        return resCallback?.(res) ?? res;
      })
      .catch((err: HttpErrorResponse) => this.handleHttpError(err, req$));
  }

  private urlWithId = (apiReq: ApiRequest<any>) => `${apiReq.url}/${apiReq.id}`;

  isValidRequest = {
    [Requests.Get]: ({ url }: ApiRequest<any>) => url,
    [Requests.GetById]: ({ url, id }: ApiRequest<any>) => url && id,
    [Requests.Post]: ({ url, item }: ApiRequest<any>) => url && item,
    [Requests.Put]: ({ url, id, item }: ApiRequest<any>) => url && id && item,
    [Requests.Delete]: ({ url, id }: ApiRequest<any>) => url && id,
  };
}
