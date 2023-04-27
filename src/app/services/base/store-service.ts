import { InjectionToken } from '@angular/core';
import { StoreData } from 'src/app/models/types';
import { StoreKeys } from 'src/app/utils';

export interface StoreService {
  remove(key: StoreKeys): void;
  store<T>(data: StoreData<T>): void;
  get<T>(): StoreData<T>;
}

export const STORE_SERVICE = new InjectionToken<StoreService>('StoreService');
