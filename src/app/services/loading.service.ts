import { Injectable } from '@angular/core';
import { Loading } from '../models/configs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  get isLoading(): boolean {
    return this._loading.isLoading;
  }

  get size(): number {
    return this._loading.size ?? 100;
  }

  private _loading: Loading = {
    isLoading: true,
  };

  setLoading(loading: Loading): void {
    this._loading = loading;
  }
}
