import { InjectionToken } from '@angular/core';
import { StoreData, StoreDataTypes } from 'src/app/models/types';
import { StoreKeys } from 'src/app/utils';

export interface StoreService {
  remove(key: StoreKeys): void;
  get<T = unknown>(key: StoreKeys, type?: StoreDataTypes): T | null;
  store<T>(data: StoreData<T>): void;
  clear(): void;
}

export const STORE_SERVICE = new InjectionToken<StoreService>('StoreService');
