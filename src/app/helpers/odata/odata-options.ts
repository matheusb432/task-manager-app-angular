export interface ODataOptions {
  select?: string[];
  expand?: string[];
  filter?: string;
  top?: number;
  skip?: number;
  orderBy?: string[];
  count?: boolean;
}
