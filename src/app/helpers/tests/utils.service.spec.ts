import { FormTypes } from 'src/app/utils';
import { UtilsService } from '../utils.service';

import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { ODataOperators } from '../odata';

describe('Service: Utils', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('formatDate', () => {
    it('should return an empty string when given a falsy value', () => {
      expect(UtilsService.formatDate(null as unknown as Date)).toEqual('');
      expect(UtilsService.formatDate(undefined as unknown as Date)).toEqual('');
    });

    it('should format a date correctly', () => {
      const date = new Date(2023, 3, 21);
      expect(UtilsService.formatDate(date)).toEqual('21/04/2023');
    });
  });

  describe('capitalize', () => {
    it('should return an empty string when given a falsy value', () => {
      expect(UtilsService.capitalize(undefined)).toEqual('');
      expect(UtilsService.capitalize('')).toEqual('');
    });

    it('should capitalize the first letter of a word', () => {
      expect(UtilsService.capitalize('hello')).toEqual('Hello');
    });
  });

  describe('deepClone', () => {
    it('should create a deep clone of an object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = UtilsService.deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });
  });

  describe('timeToNumber', () => {
    it('should return 0 when given an invalid time', () => {
      expect(UtilsService.timeToNumber('')).toEqual(0);
      expect(UtilsService.timeToNumber('invalid')).toEqual(0);
      expect(UtilsService.timeToNumber('1:2:3')).toEqual(0);
    });

    it('should convert a valid time string to a number', () => {
      expect(UtilsService.timeToNumber('12:34')).toEqual(1234);
    });
  });

  describe('isCreateForm', () => {
    it('should return true for FormTypes.Create', () => {
      expect(UtilsService.isCreateForm(FormTypes.Create)).toBeTrue();
    });

    it('should return false for other FormTypes', () => {
      expect(UtilsService.isCreateForm(FormTypes.Edit)).toBeFalse();
      expect(UtilsService.isCreateForm(FormTypes.View)).toBeFalse();
      expect(UtilsService.isCreateForm(FormTypes.Duplicate)).toBeFalse();
    });
  });

  describe('isViewForm', () => {
    it('should return true for FormTypes.View', () => {
      expect(UtilsService.isViewForm(FormTypes.View)).toBeTrue();
    });

    it('should return false for other FormTypes', () => {
      expect(UtilsService.isViewForm(FormTypes.Create)).toBeFalse();
      expect(UtilsService.isViewForm(FormTypes.Edit)).toBeFalse();
      expect(UtilsService.isViewForm(FormTypes.Duplicate)).toBeFalse();
    });
  });

  describe('isEditForm', () => {
    it('should return true when type is Edit', () => {
      expect(UtilsService.isEditForm(FormTypes.Edit)).toBe(true);
    });

    it('should return false when type is not Edit', () => {
      expect(UtilsService.isEditForm(FormTypes.Create)).toBe(false);
      expect(UtilsService.isEditForm(FormTypes.View)).toBe(false);
      expect(UtilsService.isEditForm(FormTypes.Duplicate)).toBe(false);
    });
  });

  describe('isDuplicateForm', () => {
    it('should return true when type is Duplicate', () => {
      expect(UtilsService.isDuplicateForm(FormTypes.Duplicate)).toBe(true);
    });

    it('should return false when type is not Duplicate', () => {
      expect(UtilsService.isDuplicateForm(FormTypes.Create)).toBe(false);
      expect(UtilsService.isDuplicateForm(FormTypes.View)).toBe(false);
      expect(UtilsService.isDuplicateForm(FormTypes.Edit)).toBe(false);
    });
  });

  describe('getSubmitLabel', () => {
    it('should return "Create" when type is Create', () => {
      expect(UtilsService.getSubmitLabel(FormTypes.Create)).toBe('Create');
    });

    it('should return "Update" when type is Edit', () => {
      expect(UtilsService.getSubmitLabel(FormTypes.Edit)).toBe('Update');
    });

    it('should return "Duplicate" when type is Duplicate', () => {
      expect(UtilsService.getSubmitLabel(FormTypes.Duplicate)).toBe('Duplicate');
    });

    it('should return empty string when type is View', () => {
      expect(UtilsService.getSubmitLabel(FormTypes.View)).toBe('');
    });
  });

  describe('unsub', () => {
    it('should not call unsubscribe on an empty array', () => {
      const spy = spyOn(Subscription.prototype, 'unsubscribe');
      UtilsService.unsub([]);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call unsubscribe on all subscriptions in the array', () => {
      const sub1 = new Subscription();
      const sub2 = new Subscription();
      const spy1 = spyOn(sub1, 'unsubscribe');
      const spy2 = spyOn(sub2, 'unsubscribe');
      UtilsService.unsub([sub1, sub2]);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('sleep', () => {
    it('should resolve after the specified delay', async () => {
      const startTime = Date.now();
      await UtilsService.sleep(100);
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe('hasItems', () => {
    it('should return false when passed an empty array', () => {
      const result = UtilsService.hasItems([]);
      expect(result).toBeFalse();
    });

    it('should return false when passed undefined', () => {
      const result = UtilsService.hasItems(undefined as unknown as unknown[]);
      expect(result).toBeFalse();
    });

    it('should return true when passed an array with items', () => {
      const result = UtilsService.hasItems([1, 2, 3]);
      expect(result).toBeTrue();
    });
  });

  describe('buildODataQuery', () => {
    it('should build an OData query string', () => {
      const result = UtilsService.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: [ODataOperators.GreaterThanOrEqualTo, 20] }, orderBy: ['name asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=name asc',
      };

      expect(result.length).toEqual("https://example.com/odata?$filter=(name eq 'John') and (age ge 20)&$orderby=name asc".length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should build an OData query string with default options when options are not provided', () => {
      const result = UtilsService.buildODataQuery('https://example.com');
      expect(result).toEqual('https://example.com/odata');
    });

    it('should ignore undefined filters', () => {
      const result = UtilsService.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: undefined, height: [ODataOperators.LessThanOrEqualTo, 180] },
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (height le 180)",
      };

      expect(result.length).toEqual("https://example.com/odata?$filter=(name eq 'John') and (height le 180)".length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });
  });

  describe('buildPaginatedODataQuery', () => {
    it('should build a paginated OData query string', () => {
      const result = UtilsService.buildPaginatedODataQuery('https://example.com', {
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
      const result = UtilsService.buildPaginatedODataQuery('https://example.com', {
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
      const result = UtilsService.buildPaginatedODataQuery('https://example.com', {
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
});
