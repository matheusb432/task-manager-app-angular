import { TestBed, inject } from '@angular/core/testing';
import { QueryUtil } from '../query.util';
import { ODataOperators } from '../odata';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/app/util';

describe('Util: Query', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryUtil],
    });
  });

  it('should create', inject([QueryUtil], (service: QueryUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('buildODataQuery', () => {
    it('should build an OData query string', () => {
      const result1 = QueryUtil.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: [ODataOperators.GreaterThanOrEqualTo, 20] },
        orderBy: ['name', 'asc'],
      });

      const expectedParams1 = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=name asc',
      };

      expect(result1.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John') and (age ge 20)&$orderby=name asc"
          .length
      );
      for (const param of Object.values(expectedParams1)) {
        expect(result1).toContain(param);
      }

      const result2 = QueryUtil.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: [ODataOperators.GreaterThanOrEqualTo, 20] },
        orderBy: [['nested', 'prop', 'test'], 'asc'],
      });

      const expectedParams2 = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=nested/prop/test asc',
      };

      expect(result2.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John') and (age ge 20)&$orderby=nested/prop/test asc"
          .length
      );
      for (const param of Object.values(expectedParams2)) {
        expect(result2).toContain(param);
      }
    });

    it('should build an OData query string with default options when options are not provided', () => {
      const result = QueryUtil.buildODataQuery('https://example.com');
      expect(result).toEqual('https://example.com/odata');
    });

    it('should ignore undefined filters', () => {
      const result = QueryUtil.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: undefined, height: [ODataOperators.LessThanOrEqualTo, 180] },
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (height le 180)",
      };

      expect(result.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John') and (height le 180)".length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });
  });

  describe('buildPaginatedODataQuery', () => {
    it('should build a paginated OData query string', () => {
      const result = QueryUtil.buildPaginatedODataQuery('https://example.com', {
        page: 3,
        itemsPerPage: 10,
        options: { filter: { name: 'John' } },
      });

      const expectedParams = {
        count: '$count=true',
        filter: "$filter=(name eq 'John')",
        skip: '$skip=20',
        top: '$top=10',
      };

      expect(result.length).toEqual(
        `https://example.com/odata?$filter=(name eq 'John')&$count=true&$skip=20&$top=10`.length
      );

      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should build a paginated OData query string with default options when options are not provided', () => {
      const result = QueryUtil.buildPaginatedODataQuery('https://example.com', {
        page: 1,
        itemsPerPage: 20,
      });

      const expectedParams = {
        count: '$count=true',
        skip: '$skip=0',
        top: '$top=20',
      };

      expect(result.length).toEqual(`https://example.com/odata?$count=true&$skip=0&$top=20`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should use default values for page and itemsPerPage when not provided', () => {
      const result = QueryUtil.buildPaginatedODataQuery('https://example.com', {
        options: { filter: { name: 'John' } },
      });
      const expectedParams = {
        count: '$count=true',
        skip: '$skip=0',
        top: '$top=10',
      };

      expect(result.length).toEqual(
        `https://example.com/odata?$filter=(name eq 'John')&$count=true&$skip=0&$top=10`.length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });
  });

  describe('buildApiUrl', () => {
    const apiUrl = environment.apiUrl;

    it('should return api url concatenated with endpoint', () => {
      expect(QueryUtil.buildApiUrl('/users' as unknown as ApiEndpoints)).toBe(`${apiUrl}/users`);
    });
  });
});