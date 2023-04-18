import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiRequest, ErrorMessages, Requests, ResCallback } from 'src/app/models';
import { environment } from './../../environments/environment';
import { PostReturn } from '../models/types';
import { SourceType } from 'mapper-ts/lib-esm/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  async getAll<T>(apiReq: ApiRequest<T>): Promise<T[]> {
    if (!this.isValidRequest[Requests.Get](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidURLRequest);
    }

    const req$ = this._getRequest({ ...apiReq, url: `${apiReq.url}/odata` });

    return this._returnAsync<T>(req$, apiReq.resCallback) as Promise<T[]>;
  }

  async getById<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.GetById](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    // TODO Utility class to build OData queries
    const req$ = (this._getRequest<T>({
      ...apiReq,
      url: `${apiReq.url}/odata?$filter=id eq ${apiReq.id}`,
    }) as unknown as Observable<T[]>).pipe(map((res: T[]) => res?.[0]));

    return this._returnAsync<T>(req$, apiReq.resCallback) as Promise<T>;
  }

  async insert<T>(apiReq: ApiRequest<T>): Promise<PostReturn> {
    if (!this.isValidRequest[Requests.Post](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    const req$ = this._postRequest<T>(apiReq);

    return this._returnAsync(req$) as Promise<PostReturn>;
  }

  async update<T>(apiReq: ApiRequest<T>): Promise<void> {
    if (!this.isValidRequest[Requests.Put](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    apiReq.url = this.urlWithId(apiReq);

    const req$ = this._putRequest<T>(apiReq);

    return this._returnAsync(req$) as Promise<void>;
  }

  async remove<T>(apiReq: ApiRequest<T>): Promise<void> {
    if (!this.isValidRequest[Requests.Delete](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    apiReq.url = this.urlWithId(apiReq);

    const req$ = this._deleteRequest<T>(apiReq);

    return this._returnAsync(req$) as Promise<void>;
  }

  handleInvalidRequestError(apiReq: ApiRequest): void {
    console.error('Invalid request!', apiReq);
  }

  handleHttpError(err: HttpErrorResponse, req: Observable<unknown>): void {
    if (!environment.production) {
      console.log(err, req);
    }
  }

  private _getRequest<T>({ url, itemType }: ApiRequest<T>): Observable<T> {
    return this.http.get<T>(url).pipe(
      map((data: unknown) => {
        if (!itemType) return data;

        return new Mapper(itemType).map(data as SourceType[]);
      })
    ) as unknown as Observable<T>;
  }

  private _postRequest<T>({ url, item, postDto }: ApiRequest<T>): Observable<T> {
    if (!postDto || !item) throw new Error(ErrorMessages.InvalidServiceRequest);

    const mappedItem = new Mapper(postDto).map(item);

    return this.http.post<T>(url, mappedItem);
  }

  private _putRequest<T>({ url, item, putDto }: ApiRequest<T>): Observable<T> {
    if (!putDto || !item) throw new Error(ErrorMessages.InvalidServiceRequest);

    const mappedItem = new Mapper(putDto).map(item);

    return this.http.put<T>(url, mappedItem);
  }

  private _deleteRequest<T>({ url }: ApiRequest<T>): Observable<T> {
    return this.http.delete<T>(url);
  }

  private async _returnAsync<T>(req$: Observable<T>, resCallback?: ResCallback): Promise<unknown> {
    return lastValueFrom(req$)
      .then((res: T) => {
        return resCallback?.(res) ?? res;
      })
      .catch((err: HttpErrorResponse) => this.handleHttpError(err, req$));
  }

  private urlWithId = (apiReq: ApiRequest): string => `${apiReq.url}/${apiReq.id}`;

  isValidRequest = {
    [Requests.Get]: ({ url }: ApiRequest) => url,
    [Requests.GetById]: ({ url, id }: ApiRequest) => url && id,
    [Requests.Post]: ({ url, item }: ApiRequest) => url && item,
    [Requests.Put]: ({ url, id, item }: ApiRequest) => url && id && item,
    [Requests.Delete]: ({ url, id }: ApiRequest) => url && id,
  };
}
