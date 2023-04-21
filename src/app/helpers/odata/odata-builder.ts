import { ODataOptions } from './odata-options';

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
    // TODO improve method, allow for a more declarative approach to filter definition
    // TODO (implement unit tests before refactoring)
    if (options.filter) queryString += `$filter=${options.filter}&`;
    if (options.top != null) queryString += `$top=${options.top}&`;
    if (options.skip != null) queryString += `$skip=${options.skip}&`;
    if (options.orderBy) queryString += `$orderby=${options.orderBy.join(',')}&`;
    if (options.count) queryString += `$count=${options.count}&`;

    return queryString.slice(0, -1);
  }
}
