import { ODataFilter } from "./odata-filter";

export interface ODataOptions {
  select?: string[];
  expand?: string[];
  filter?: ODataFilter;
  top?: number;
  skip?: number;
  orderBy?: string[];
  count?: boolean;
}
