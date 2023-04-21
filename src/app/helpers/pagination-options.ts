import { ODataOptions } from 'src/app/helpers/odata';

export class PaginationOptions {
  page?: number;
  itemsPerPage?: number;
  options?: ODataOptions;

  private constructor(page?: number, itemsPerPage?: number, options?: ODataOptions) {
    this.page = page;
    this.itemsPerPage = itemsPerPage;
    this.options = options;
  }

  static default(): PaginationOptions {
    return new PaginationOptions(0, 10);
  }

  static from(page: number, itemsPerPage: number, options?: ODataOptions): PaginationOptions {
    return new PaginationOptions(page, itemsPerPage, options);
  }
}
