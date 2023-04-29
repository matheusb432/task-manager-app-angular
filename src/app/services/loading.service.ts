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

  addLoading(id: string, loading: Loading): void {
    loading.id = id;

    this.loadings = [...this._loadings, loading];
  }

  addLoadings(id: string, loadings: Loading[]): void {
    loadings.forEach((x) => (x.id = id));

    this.loadings = [...this._loadings, ...loadings];
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

    this.removeLoadingById(loading.id);
  }

  removeLoadings(loadings: (Loading | undefined)[]): void {
    if (!us.notEmpty(loadings)) return;

    loadings.forEach((x) => this.removeLoading(x));
  }

  removeLoadingById(id: string | undefined): void {
    if (!us.notEmpty(id)) return;

    this.loadings = this._loadings.filter((x) => x.id !== id);
  }

  removeAllLoadings(): void {
    this.loadings = [];
  }

  private getCurrentDataFromAppRequests(url: string): [string, AppRequestData] | null {
    const datas = this.appService.getManyByUrl(url);
    return datas?.[0];
  }

  getKeyAndLoadingByUrlFromAppRequests(url: string): [string, AppRequestData] | [null, null] {
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

  static createFromId(targetElId: string, size = 100): Loading {
    return {
      targetElId: targetElId,
      size,
    };
  }

  static createManyFromId(targetElId: string, size = 100): Loading[] {
    return [this.createFromId(targetElId, size)];
  }

  static createManyFromIds(targetElIds: string[], size = 100): Loading[] {
    return targetElIds.map((id) => LoadingService.createFromId(id, size));
  }
}
