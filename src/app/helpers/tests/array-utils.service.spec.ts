import { ArrayUtilsService } from './../array-utils.service';
import { TestBed, inject } from '@angular/core/testing';

describe('Service: ArrayUtils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArrayUtilsService],
    });
  });

  it('should create', inject([ArrayUtilsService], (service: ArrayUtilsService) => {
    expect(service).toBeTruthy();
  }));

  describe('areEqualShallow', () => {
    it('should return true when arrays are equal', () => {
      expect(ArrayUtilsService.areEqualShallow([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(ArrayUtilsService.areEqualShallow(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
      expect(ArrayUtilsService.areEqualShallow([true, false], [true, false])).toBe(true);
    });

    it('should return false when arrays are not equal', () => {
      expect(ArrayUtilsService.areEqualShallow([1, 2, 3], [1, 2])).toBe(false);
      expect(ArrayUtilsService.areEqualShallow([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(ArrayUtilsService.areEqualShallow(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false);
      expect(ArrayUtilsService.areEqualShallow([true, false], [true, true])).toBe(false);
    });

    it('should return false when one or both of the arrays are null', () => {
      const nullArr = null as unknown as unknown[];

      expect(ArrayUtilsService.areEqualShallow(nullArr, [1, 2, 3])).toBe(false);
      expect(ArrayUtilsService.areEqualShallow([1, 2, 3], nullArr)).toBe(false);
      expect(ArrayUtilsService.areEqualShallow(nullArr, nullArr)).toBe(false);
    });
  });

  describe('areEqualDeep', () => {
    it('should return true when arrays are equal', () => {
      expect(ArrayUtilsService.areEqualDeep([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(ArrayUtilsService.areEqualDeep(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
      expect(ArrayUtilsService.areEqualDeep([true, false], [true, false])).toBe(true);
      expect(ArrayUtilsService.areEqualDeep([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(
        true
      );
      expect(
        ArrayUtilsService.areEqualDeep(
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
      expect(ArrayUtilsService.areEqualDeep([1, 2, 3], [1, 2])).toBe(false);
      expect(ArrayUtilsService.areEqualDeep([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(ArrayUtilsService.areEqualDeep(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false);
      expect(ArrayUtilsService.areEqualDeep([true, false], [true, true])).toBe(false);
      expect(
        ArrayUtilsService.areEqualDeep([{ a: 1 }, { b: 20 }], [{ a: 1 }, { b: 2 }])
      ).toBe(false);
      expect(
        ArrayUtilsService.areEqualDeep(
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

      expect(ArrayUtilsService.areEqualDeep(nullArr, [1, 2, 3])).toBe(false);
      expect(ArrayUtilsService.areEqualDeep([1, 2, 3], nullArr)).toBe(false);
      expect(ArrayUtilsService.areEqualDeep(nullArr, nullArr)).toBe(false);
    });
  });

  describe('sumNumberProp', () => {
    it('should return the sum of the property of each item in the array', () => {
      expect(
        ArrayUtilsService.sumNumberProp(
          [
            { a: 1, b: 0, c: 0 },
            { a: 2, b: 0, c: 0 },
            { a: 3, b: 0, c: 0 },
          ],
          'a'
        )
      ).toBe(6);
      expect(
        ArrayUtilsService.sumNumberProp(
          [
            { a: 1, b: 0, c: 0 },
            { a: 2, b: 0, c: 0 },
            { a: 3, b: 0, c: 0 },
          ],
          'b'
        )
      ).toBe(0);
      expect(
        ArrayUtilsService.sumNumberProp(
          [
            { a: 1, b: 0, c: 10 },
            { a: 2, b: 0, c: 0 },
            { a: 3, b: 0, c: 0 },
          ],
          'c'
        )
      ).toBe(10);
    });

    it('should return 0 when the array is empty or nullish', () => {
      expect(ArrayUtilsService.sumNumberProp([], 'a')).toBe(0);
      expect(ArrayUtilsService.sumNumberProp(null as unknown as { a: number }[], 'a')).toBe(0);
      expect(ArrayUtilsService.sumNumberProp(undefined as unknown as { a: number }[], 'a')).toBe(0);
    });

    it('should return 0 when the property is not a number', () => {
      expect(ArrayUtilsService.sumNumberProp([{ a: 'a' }, { a: 'b' }, { a: 'c' }], 'a')).toBe(0);
    });
  });
});
