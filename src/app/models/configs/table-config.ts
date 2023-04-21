export interface TableConfig<T = unknown> {
  headers: string[];
  keys: (keyof T)[];
  detailsUrl: string;
  hasCopy?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  hasView?: boolean;
}
