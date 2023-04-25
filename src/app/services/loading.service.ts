import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { us } from 'src/app/helpers';
import { Loading } from '../models/configs';
import { AppRequestData } from '../models/types';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loadings: Loading[] = [];
  private _loadingsSet = new BehaviorSubject<void>(undefined);

  get loadings(): Loading[] {
    return us.deepClone(this._loadings);
  }

  private set loadings(value: Loading[]) {
    this._loadings = value;

    this._loadingsSet.next();
  }

  constructor(private appService: AppService) {}

  addLoading(loading: Loading): void {
    this.loadings = [...this._loadings, loading];
  }

  shouldBeLoading(targetElId: string | undefined): boolean {
    if (!us.notEmpty(targetElId)) return false;

    return this.getLoadingByElId(targetElId) != null;
  }

  getLoadingByElId(targetElId: string | undefined): Loading | undefined {
    if (!us.notEmpty(targetElId)) return;

    return this._loadings.find((x) => x.targetElId === targetElId);
  }

  removeLoading(loading: Loading | undefined): void {
    if (loading == null) return;

    this.removeLoadingByElId(loading.targetElId);
  }

  removeLoadings(loadings: (Loading | undefined)[]): void {
    if (!us.notEmpty(loadings)) return;

    loadings.forEach((x) => this.removeLoading(x));
  }

  removeLoadingByElId(targetElId: string | undefined): void {
    if (!us.notEmpty(targetElId)) return;

    this.loadings = this._loadings.filter((x) => x.targetElId !== targetElId);
  }

  removeAllLoadings(): void {
    this.loadings = [];
  }

  /*
   * Remove previous loadings from the same url and sorts datas by most recent
   *
   * @param datas - [key, value] pairs from AppService
   */
  removePreviousLoadings(datas: [string, AppRequestData][]): void {
    if (datas == null || datas.length <= 1) return;

    AppService.sortByMostRecent(datas);

    this.removeLoadings(datas.slice(1).map((x) => x[1].loading));
  }

  private getCurrentDataFromAppRequests(url: string): [string, AppRequestData] | null {
    const datas = this.appService.getManyByUrl(url);
    this.removePreviousLoadings(datas);
    return datas?.[0];
  }

  getLoadingByUrlFromAppRequests(url: string): [string, AppRequestData] | [null, null] {
    const currentData = this.getCurrentDataFromAppRequests(url);
    if (currentData?.length !== 2) return [null, null];
    return currentData;
  }

  isLoadingPipeFactory(elId: string): Observable<boolean> {
    return this._loadingsSet.asObservable().pipe(map(() => this.shouldBeLoading(elId)));
  }

  isAnyLoadingPipeFactory(elIds: string[]): Observable<boolean> {
    return this._loadingsSet
      .asObservable()
      .pipe(map(() => elIds.some(this.shouldBeLoading.bind(this))));
  }

  static createLoading(targetElId: string, size = 100): Loading {
    return {
      targetElId,
      size,
    };
  }
}