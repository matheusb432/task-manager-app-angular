import { ODataFilter } from './odata-filter';
import { ODataOperators } from './odata-operators.enum';
import { ODataOptions } from './odata-options';
import { ODataFilterValue } from './odata-types';

export class ODataBuilder {
  private baseUrl: string;

  constructor(baseUrl: string, withSuffix = true) {
    this.baseUrl = baseUrl;

    if (withSuffix) this.baseUrl += '/odata';
  }

  buildUrl(options?: ODataOptions): string {
    let queryUrl = this.baseUrl;

    if (options) {
      const queryString = this.buildQueryString(options);
      queryUrl += `?${queryString}`;
    }

    return queryUrl;
  }

  private buildQueryString(options: ODataOptions): string {
    let queryString = '';

    if (options.select) queryString += `$select=${options.select.join(',')}&`;
    if (options.expand) queryString += `$expand=${options.expand.join(',')}&`;
    if (options.filter) {
      const filterString = this.buildFilterString(options.filter);
      if (filterString) queryString += `$filter=${filterString}&`;
    }
    if (options.top != null) queryString += `$top=${options.top}&`;
    if (options.skip != null) queryString += `$skip=${options.skip}&`;
    if (options.orderBy) {
      const orderByString = options.orderBy.join(',');
      if (orderByString) queryString += `$orderby=${orderByString}&`;
    }
    if (options.count) queryString += `$count=${options.count}&`;

    return queryString.slice(0, -1);
  }

  private buildFilterString(filter: ODataFilter): string {
    let filterString = '';

    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined) continue;

      if (value instanceof Array) {
        const [operator, filter] = value;

        if (operator === ODataOperators.Contains) {
          filterString += `contains(${key}, ${this.normalizeValue(filter)}) and `;

          continue;
        }

        filterString += `(${key} ${value[0]} ${this.normalizeValue(value[1])}) and `;
      } else {
        filterString += `(${key} eq ${this.normalizeValue(value)}) and `;
      }
    }

    return filterString.slice(0, -5);
  }

  private normalizeValue(value: ODataFilterValue): string {
    return typeof value === 'string' ? `'${value}'` : `${value}`;
  }
}
