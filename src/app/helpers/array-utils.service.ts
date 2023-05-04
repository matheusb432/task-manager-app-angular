import { Injectable } from '@angular/core';
import { Nullish } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ArrayUtilsService {
  /*
   * Returns true if every item is equal in value and position, does not check for deep equality
   *
   */
  static areEqualShallow<T>(
    array1: T[] | undefined | null,
    array2: T[] | undefined | null
  ): boolean {
    if (array1 == null || array1.length !== array2?.length) return false;

    return array1.every((item, index) => item === array2[index]);
  }

  static areEqualDeep<T>(
    array1: T[] | undefined | null,
    array2: T[] | undefined | null
  ): boolean {
    if (array1 == null || array1.length !== array2?.length) return false;

    return array1.every((item, index) => JSON.stringify(item) === JSON.stringify(array2[index]));
  }

  static sumNumberProp<T>(items: T[] | Nullish, property: keyof T): number {
    return (
      items?.reduce((prev, curr) => {
        const value = Number(curr?.[property]);

        return prev + (value ? value : 0);
      }, 0) ?? 0
    );
    // return this.taskItems?.reduce((prev, curr) => prev + (curr?.time ?? 0), 0) ?? 0;
  }
}
