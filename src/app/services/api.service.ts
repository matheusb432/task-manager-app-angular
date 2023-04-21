import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { us } from 'src/app/helpers';

import { ApiRequest, ErrorMessages, Requests, ResCallback } from 'src/app/models';
import { PaginatedResult, PostReturn } from '../models/types';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  async get<T>(apiReq: ApiRequest<T>): Promise<T[]> {
    if (!this.isValidRequest[Requests.Get](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidURLRequest);
    }

    const req$ = this._getRequest({ ...apiReq, url: `${apiReq.url}/odata` });

    return this._returnAsync(req$, apiReq.resCallback) as Promise<T[]>;
  }

  async getPaginated<T>(apiReq: ApiRequest<T>): Promise<PaginatedResult<T>> {
    if (!this.isValidRequest[Requests.Get](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    const req$ = this._getPaginatedRequest<T>(apiReq);

    return this._returnAsync(req$, apiReq.resCallback) as Promise<PaginatedResult<T>>;
  }

  async getById<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.GetById](apiReq)) {
      this.handleInvalidRequestError(apiReq);

      return Promise.reject(ErrorMessages.InvalidServiceRequest);
    }

    const url = us.buildODataQuery(apiReq.url, { filter: `id eq ${apiReq.id}` });

    const req$ = this._getRequest<T>({
      ...apiReq,
      url,
    }).pipe(map((res: T[]) => res?.[0]));

    return this._returnAsync(req$, apiReq.resCallback) as Promise<T>;
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
    if (!environment.production) console.log(err, req);
  }

  private _getRequest<T>({ url, itemType, params }: ApiRequest<T>): Observable<T[]> {
    return this.http.get<T[]>(url, { params }).pipe(
      map((data) => {
        if (!itemType) return data;

        return new Mapper(itemType).map(data);
      })
    ) as unknown as Observable<T[]>;
  }

  private _getPaginatedRequest<T>({
    url,
    itemType,
    params,
  }: ApiRequest): Observable<PaginatedResult<T>> {
    return this.http.get<PaginatedResult<T>>(url, { params }).pipe(
      map((data) => {
        if (!itemType) return data;

        return {
          total: data.total,
          items: new Mapper(itemType).map(data.items),
        };
      })
    ) as unknown as Observable<PaginatedResult<T>>;
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

  private async _returnAsync(
    req$: Observable<unknown>,
    resCallback?: ResCallback
  ): Promise<unknown> {
    return lastValueFrom(req$)
      .then((res) => {
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
