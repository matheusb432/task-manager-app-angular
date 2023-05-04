import { PercentPipe } from "@angular/common";
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
  key: keyof T;
  pipe?: ProviderToken<PipeTransform>;
  pipeArgs?: unknown[];
}

export interface OrderByConfig<T = unknown> {
  key: keyof T;
  direction: 'asc' | 'desc';
}
