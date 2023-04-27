import { Injectable } from '@angular/core';
import { StoreData } from '../models/types';
import { StoreService } from './base';
import { StoreKeys } from '../utils';

@Injectable()
export class LocalStorageService implements StoreService {
  get<T>(): StoreData<T> {
    throw new Error('Method not implemented.');
  }

  store<T>(data: StoreData<T>) {
    console.log(data);
    if (!data) return;
  }

  remove(key: StoreKeys): void {
    throw new Error('Method not implemented.');
  }
}
