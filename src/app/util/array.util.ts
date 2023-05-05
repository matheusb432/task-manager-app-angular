import { Injectable } from '@angular/core';
import { Nullish, OrderByConfig, TableKey } from '../models';
import { orderBy } from 'lodash-es';
import { ObjectUtil } from './object.util';

@Injectable({
  providedIn: 'root',
})
export class ArrayUtil {
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

  static areEqualDeep<T>(array1: T[] | undefined | null, array2: T[] | undefined | null): boolean {
    if (array1 == null || array1.length !== array2?.length) return false;

    return array1.every((item, index) => JSON.stringify(item) === JSON.stringify(array2[index]));
  }

  static sumNumberProp<T>(items: T[] | Nullish, property: keyof T): number {
    if (!items) return 0;

    return (
      items?.reduce((prev, curr) => {
        const value = Number(curr?.[property]);

        return prev + (value ? value : 0);
      }, 0) ?? 0
    );
  }

  static onOrderByChange<T>(
    orderBy: OrderByConfig<T> | null,
    newColumnKey: TableKey<T>
  ): OrderByConfig<T> | null {
    if (!orderBy) return { key: newColumnKey, direction: 'asc' };
    const { key, direction } = orderBy;

    if (direction === 'desc') return null;

    return { key: newColumnKey, direction: this.isSameKey(key, newColumnKey) ? 'desc' : 'asc' };
  }

  private static isSameKey<T>(key: TableKey<T>, newColumnKey: TableKey<T>): boolean {
    if (!Array.isArray(key) || !Array.isArray(newColumnKey)) {
      return key === newColumnKey;
    }
    return ArrayUtil.areEqualShallow(key, newColumnKey);
  }

  static orderItems<T>(items: T[], key: TableKey<T>, direction: 'asc' | 'desc'): T[] {
    if (!Array.isArray(key)) {
      return ObjectUtil.deepClone(items).sort((a, b) => this.orderFn(a, b, key, direction));
    }

    return orderBy(items, ObjectUtil.keyToProp(key), direction);
  }

  private static orderFn<T>(a: T, b: T, key?: keyof T, direction?: string): number {
    if (!key || !direction) return 0;
    const multiplier = direction === 'asc' ? 1 : -1;

    return a[key] < b[key] ? -multiplier : a[key] > b[key] ? multiplier : 0;
  }
}
