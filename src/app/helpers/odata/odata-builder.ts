import { ODataFilter } from './odata-filter';
import { ODataOperators } from './odata-operators.enum';
import { ODataOptions } from './odata-options';
import { ODataFilterValue, ODataOrderBy } from './odata-types';

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
    queryString += this.getFilter(options.filter);
    if (options.top != null) queryString += `$top=${options.top}&`;
    if (options.skip != null) queryString += `$skip=${options.skip}&`;
    queryString += this.getOrderBy(options.orderBy);
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

  private getFilter(filter: ODataFilter | undefined) {
    if (!filter) return '';

    const filterString = this.buildFilterString(filter);

    return filterString ? `$filter=${filterString}&` : '';
  }

  private getOrderBy(orderBy: ODataOrderBy | ODataOrderBy[] | undefined): string {
    if (!orderBy) return '';

    if (orderBy[1] != null) orderBy = [orderBy as ODataOrderBy];

    const orderBys: string[] = [];

    // TODO test
    orderBy.forEach((orderBy) => {
      const [prop, direction] = orderBy;

      orderBys.push(`${Array.isArray(prop) ? prop.join('/') : prop} ${direction}`);
    });

    const orderByString = orderBys.join(',');

    return orderByString ? `$orderby=${orderByString}&` : '';
  }
}
