import { StoreKeys } from 'src/app/utils';

export interface StoreData<T = string> {
  key: StoreKeys;
  value: T;
}

export type StoreDataTypes = 'number' | 'object' | 'array' | 'boolean';
