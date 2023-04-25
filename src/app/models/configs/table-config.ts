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
}

export interface OrderByConfig<T = unknown> {
  key: keyof T;
  direction: 'asc' | 'desc';
}
