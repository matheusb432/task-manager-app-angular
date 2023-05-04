import { PipeTransform, ProviderToken } from "@angular/core";

export interface TableConfig<T = unknown> {
  itemConfigs: TableItemConfig<T>[];
  orderBy: OrderByConfig<T> | null;
  detailsUrl: string;
  hasCopy?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  hasView?: boolean;
}

export interface TableItemConfig<T = unknown> {
  header: string;
  key: TableKey<T>;
  pipe?: ProviderToken<PipeTransform>;
  pipeArgs?: unknown[];
}

export interface OrderByConfig<T = unknown> {
  key: TableKey<T>;
  direction: 'asc' | 'desc';
}

export type TableKey<T = unknown> = keyof T | [keyof T, string];
