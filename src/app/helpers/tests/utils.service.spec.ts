import { ApiEndpoints, FormTypes } from 'src/app/utils';
import { UtilsService } from '../utils.service';

import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { ODataOperators } from '../odata';
import { OrderByConfig } from 'src/app/models/configs';
import { environment } from 'src/environments/environment';

describe('Service: Utils', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

    it('should create a deep clone of an array', () => {
      const arr = [1, 2, 3, { a: 1, b: 2 }];
      const clone = UtilsService.deepClone(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
      expect(clone[3]).not.toBe(arr[3]);
    });

    it('should not throw an error when given a falsy value', () => {
      expect(() => UtilsService.deepClone(null)).not.toThrow();
      expect(() => UtilsService.deepClone(undefined)).not.toThrow();
    });

    it('should return the same value when given a primitive', () => {
      expect(UtilsService.deepClone(1)).toEqual(1);
      expect(UtilsService.deepClone('hello')).toEqual('hello');
      expect(UtilsService.deepClone(true)).toEqual(true);
    });

    it('should return the same value when given a function', () => {
      const fn = () => 'hello';
      expect(UtilsService.deepClone(fn)).toEqual(fn);
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

  describe('numberToTime', () => {
    it('should return an empty string when given an invalid number', () => {
      expect(UtilsService.numberToTime(-1)).toEqual('');
      expect(UtilsService.numberToTime(12345)).toEqual('');
    });

    it('should convert a valid number to a time string', () => {
      expect(UtilsService.numberToTime(1234)).toEqual('12:34');
      expect(UtilsService.numberToTime(559)).toEqual('05:59');
      expect(UtilsService.numberToTime(56)).toEqual('00:56');
      expect(UtilsService.numberToTime(7)).toEqual('00:07');
      expect(UtilsService.numberToTime(0)).toEqual('00:00');
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

  describe('notEmpty', () => {
    it('should return false when passed an empty array', () => {
      const result = UtilsService.notEmpty([]);
      expect(result).toBeFalse();
    });

    it('should return false when passed an empty string', () => {
      const result = UtilsService.notEmpty('');
      expect(result).toBeFalse();
    });

    it('should return false when passed undefined', () => {
      const result = UtilsService.notEmpty(undefined as unknown as unknown[]);
      expect(result).toBeFalse();
    });

    it('should return true when passed an array with items', () => {
      const result = UtilsService.notEmpty([1, 2, 3]);
      expect(result).toBeTrue();
    });

    it('should return true when passed a string with characters', () => {
      const result = UtilsService.notEmpty('word');
      expect(result).toBeTrue();
    });
  });

  describe('buildODataQuery', () => {
    it('should build an OData query string', () => {
      const result = UtilsService.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: [ODataOperators.GreaterThanOrEqualTo, 20] },
        orderBy: ['name asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=name asc',
      };

      expect(result.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John') and (age ge 20)&$orderby=name asc"
          .length
      );
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

  describe('onOrderByChange', () => {
    it('should return an object with new column key and ascending direction when orderBy is null', () => {
      const newOrderBy = UtilsService.onOrderByChange(null, 'name');
      expect(newOrderBy).toEqual({ key: 'name', direction: 'asc' });
    });

    it('should return null when direction is descending and key matches the existing key', () => {
      const existingOrderBy = { key: 'name', direction: 'desc' } as OrderByConfig;
      const newOrderBy = UtilsService.onOrderByChange(existingOrderBy, 'name' as keyof unknown);
      expect(newOrderBy).toBeNull();
    });

    it('should return an object with new column key and ascending direction when key does not match the existing key', () => {
      const existingOrderBy = { key: 'name', direction: 'asc' } as OrderByConfig;
      const newOrderBy = UtilsService.onOrderByChange(existingOrderBy, 'age' as keyof unknown);
      expect(newOrderBy).toEqual({ key: 'age' as keyof unknown, direction: 'asc' });
    });

    it('should return an object with new column key and descending direction when direction is ascending and key does not match the existing key', () => {
      const existingOrderBy = { key: 'name', direction: 'asc' } as OrderByConfig;
      const newOrderBy = UtilsService.onOrderByChange(existingOrderBy, 'age' as keyof unknown);
      expect(newOrderBy).toEqual({ key: 'age' as keyof unknown, direction: 'asc' });
    });

    it('should return an object with existing column key and descending direction when direction is ascending and key matches the existing key', () => {
      const existingOrderBy = { key: 'name', direction: 'asc' } as OrderByConfig;
      const newOrderBy = UtilsService.onOrderByChange(existingOrderBy, 'name' as keyof unknown);
      expect(newOrderBy).toEqual({ key: 'name' as keyof unknown, direction: 'desc' });
    });
  });

  describe('orderItems', () => {
    const items = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 20 },
    ];

    it('should order items in ascending direction by default', () => {
      const orderedItems = UtilsService.orderItems(items, 'age', 'asc');
      expect(orderedItems).toEqual([
        { name: 'Charlie', age: 20 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ]);
    });

    it('should order items in descending direction', () => {
      const orderedItems = UtilsService.orderItems(items, 'age', 'desc');
      expect(orderedItems).toEqual([
        { name: 'Bob', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Charlie', age: 20 },
      ]);
    });

    it('should not modify original array', () => {
      const unorderedItems = items;
      const orderedItems = UtilsService.orderItems(unorderedItems, 'age', 'desc');

      expect(orderedItems).not.toEqual(items);
      expect(unorderedItems).toEqual(items);
    });
  });

  describe('isFromEnum', () => {
    it('should return true when value is from enum', () => {
      enum TestEnum {
        One = 'one',
        Two = 'two',
      }

      expect(UtilsService.isFromEnum(TestEnum, 'one')).toBe(true);
    });

    it('should return false when value is not from enum', () => {
      enum TestEnum {
        One = 'one',
        Two = 'two',
      }

      expect(UtilsService.isFromEnum(TestEnum, 'three')).toBe(false);
    });

    it('should return false when value is not from enum and enum is empty', () => {
      enum TestEnum {}

      expect(UtilsService.isFromEnum(TestEnum, 'three')).toBe(false);
    });

    it('should return false when value is nullish', () => {
      enum TestEnum {}

      expect(UtilsService.isFromEnum(TestEnum, null)).toBe(false);
      expect(UtilsService.isFromEnum(TestEnum, undefined)).toBe(false);
    });
  });

  describe('shouldParseJson', () => {
    it('should return true when value is a stringified JSON', () => {
      expect(UtilsService.shouldParseJson('{"name":"John"}')).toBe(true);
    });

    it('should return true when value is a stringified Array', () => {
      expect(UtilsService.shouldParseJson('[2, 3, 5]')).toBe(true);
    });

    it('should return false when value is not a stringified JSON', () => {
      expect(UtilsService.shouldParseJson('John')).toBe(false);
    });
  });

  describe('arraysAreEqualShallow', () => {
    it('should return true when arrays are equal', () => {
      expect(UtilsService.arraysAreEqualShallow([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(UtilsService.arraysAreEqualShallow(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
      expect(UtilsService.arraysAreEqualShallow([true, false], [true, false])).toBe(true);
    });

    it('should return false when arrays are not equal', () => {
      expect(UtilsService.arraysAreEqualShallow([1, 2, 3], [1, 2])).toBe(false);
      expect(UtilsService.arraysAreEqualShallow([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(UtilsService.arraysAreEqualShallow(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false);
      expect(UtilsService.arraysAreEqualShallow([true, false], [true, true])).toBe(false);
    });

    it('should return false when one or both of the arrays are null', () => {
      const nullArr = null as unknown as unknown[];

      expect(UtilsService.arraysAreEqualShallow(nullArr, [1, 2, 3])).toBe(false);
      expect(UtilsService.arraysAreEqualShallow([1, 2, 3], nullArr)).toBe(false);
      expect(UtilsService.arraysAreEqualShallow(nullArr, nullArr)).toBe(false);
    });
  });

  describe('arraysAreEqualDeep', () => {
    it('should return true when arrays are equal', () => {
      expect(UtilsService.arraysAreEqualDeep([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(UtilsService.arraysAreEqualDeep(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
      expect(UtilsService.arraysAreEqualDeep([true, false], [true, false])).toBe(true);
      expect(UtilsService.arraysAreEqualDeep([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(
        true
      );
      expect(
        UtilsService.arraysAreEqualDeep(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBe(true);
    });

    it('should return false when arrays are not equal', () => {
      expect(UtilsService.arraysAreEqualDeep([1, 2, 3], [1, 2])).toBe(false);
      expect(UtilsService.arraysAreEqualDeep([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(UtilsService.arraysAreEqualDeep(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false);
      expect(UtilsService.arraysAreEqualDeep([true, false], [true, true])).toBe(false);
      expect(UtilsService.arraysAreEqualDeep([{ a: 1 }, { b: 20 }], [{ a: 1 }, { b: 2 }])).toBe(
        false
      );
      expect(
        UtilsService.arraysAreEqualDeep(
          [
            [1, 2],
            [3, 5],
          ],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBe(false);
    });

    it('should return false when one or both of the arrays are null', () => {
      const nullArr = null as unknown as unknown[];

      expect(UtilsService.arraysAreEqualDeep(nullArr, [1, 2, 3])).toBe(false);
      expect(UtilsService.arraysAreEqualDeep([1, 2, 3], nullArr)).toBe(false);
      expect(UtilsService.arraysAreEqualDeep(nullArr, nullArr)).toBe(false);
    });
  });

  describe('buildApiUrl', () => {
    const apiUrl = environment.apiUrl;

    it('should return api url concatenated with endpoint', () => {
      expect(UtilsService.buildApiUrl('/users' as unknown as ApiEndpoints)).toBe(`${apiUrl}/users`);
    });
  });

  describe('isEmail', () => {
    it('should return true when email is valid', () => {
      expect(UtilsService.isEmail('email@example.com')).toBe(true);
  })

    it('should return false when email is invalid', () => {
      expect(UtilsService.isEmail('email')).toBe(false);
    });
});
});
