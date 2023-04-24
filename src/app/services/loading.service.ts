import { us } from 'src/app/helpers';
import { Injectable } from '@angular/core';
import { Loading } from '../models/configs';
import { AppRequestData } from '../models/types';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loadings: Loading[] = [];

  get isLoading(): boolean {
    return this._loading.isLoading;
  }

  get size(): number {
    return this._loading.size ?? 100;
  }

  private _loading: Loading = {
    isLoading: true,
  };

  get loadings(): Loading[] {
    return us.deepClone(this._loadings);
  }

  private set loadings(value: Loading[]) {
    this._loadings = value;

    console.log(us.deepClone(this._loadings));
  }

  constructor(private appService: AppService) {}

  setLoading(loading: Loading): void {
    this._loading = loading;
  }

  addLoading(loading: Loading): void {
    this.loadings = [...this._loadings, loading];
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

    const index = this._loadings.findIndex((x) => x.targetElId === targetElId);
    if (index >= 0) this.loadings = this._loadings.filter((x, i) => i !==index);
  }

  removeLoadingsByElId(targetElIds: (string | undefined)[]): void {
    if (!us.notEmpty(targetElIds)) return;

    targetElIds.forEach((x) => this.removeLoadingByElId(x));
  }

  removeAllLoadings(): void {
    this.loadings = [];
  }

  removePreviousLoadings(datas: [string, AppRequestData][]): void {
    if (datas == null || datas.length <= 1) return;

    AppService.sortByMostRecentData(datas);

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

  static createLoading(targetElId: string, size = 100): Loading {
    return {
      targetElId,
      size,
      isLoading: true,
    };
  }
}
