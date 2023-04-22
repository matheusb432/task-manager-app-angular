import { ODataFilterValue } from "./odata-types";

/**
  * @property key - The key of the filter or an array that
  * contains the OData operator and it's value
  *
  * e.g. { name: 'John Doe', age: ['ge', 20] }
  */
export interface ODataFilter {
  // TODO refactor so first param can only be an OData operator
  [key: string]: ODataFilterValue | [string, ODataFilterValue];
}
