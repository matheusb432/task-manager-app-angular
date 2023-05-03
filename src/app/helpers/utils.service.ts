import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ApiEndpoints, Constants, FormTypes } from '../utils';
import { Subscription } from 'rxjs';
import { ODataBuilder, ODataOptions } from './odata';
import { PaginationOptions } from './pagination-options';
import { stringify } from 'crypto-js/enc-hex';
import * as CryptoJS from 'crypto-js';
import { OrderByConfig } from '../models/configs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  static capitalize = (word: string | undefined): string => {
    if (!word) return '';

    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  };

  static deepClone<T>(obj: T): T {
    if (obj == null || obj instanceof Function) return obj;

    return JSON.parse(JSON.stringify(obj));
  }

  static timeToNumber = (timeHhMm: string): number => {
    const splitTime = timeHhMm?.split(':');
    if (splitTime?.length !== 2) return 0;

    const [hours, minutes] = splitTime;
    return Number(hours + minutes);
  };

  static numberToTime(numberTime: number | null | undefined): string {
    if (numberTime == null || numberTime < 0 || numberTime > 9999) return '';

    let time = numberTime.toString();

    if (time.length > 2) {
      time = time.slice(0, -2) + ':' + time.slice(-2);
    }

    while (time.length < 5) {
      if (!time.includes(':')) time = `:${'0'.repeat(2 - time.length)}${time}`;

      time = `0${time}`;
    }

    return time;
  }

  static isCreateForm = (type: FormTypes) => type === FormTypes.Create;
  static isViewForm = (type: FormTypes) => type === FormTypes.View;
  static isEditForm = (type: FormTypes) => type === FormTypes.Edit;
  static isDuplicateForm = (type: FormTypes) => type === FormTypes.Duplicate;

  static getSubmitLabel = (type: FormTypes): string => {
    const submitLabels: { [key: string]: string } = {
      [FormTypes.Create]: 'Create',
      [FormTypes.Edit]: 'Update',
      [FormTypes.Duplicate]: 'Duplicate',
    };

    return submitLabels[type] || '';
  };

  static unsub(subscriptions: Subscription[]): void {
    if (!subscriptions?.length) return;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  static async delayHtmlRender(timeMs = 0): Promise<unknown> {
    return this.sleep(timeMs);
  }

  static async sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static notEmpty(items: unknown[] | string | undefined | null): boolean {
    return items != null && items?.length > 0;
  }

  static buildODataQuery = (url: string, options?: ODataOptions): string => {
    return new ODataBuilder(url).buildUrl(options);
  };

  static buildPaginatedODataQuery = (
    url: string,
    { page, itemsPerPage, options }: PaginationOptions
  ): string => {
    page ??= 1;
    itemsPerPage ??= Constants.DefaultItemsPerPage;

    const skip = (page - 1) * itemsPerPage;
    const top = itemsPerPage;

    return UtilsService.buildODataQuery(url, { count: true, skip, top, ...options });
  };

  static randomHex(length = 10): string {
    const randomBytesBuffer = CryptoJS.lib.WordArray.random(length);

    return stringify(randomBytesBuffer).slice(0, length);
  }

  static orderByToOData<T>(orderBy: OrderByConfig<T> | null): string[] {
    if (!orderBy) return [''];

    const { key, direction } = orderBy;

    return [`${key as string} ${direction}`];
  }

  static onOrderByChange<T>(
    orderBy: OrderByConfig<T> | null,
    newColumnKey: keyof T
  ): OrderByConfig<T> | null {
    if (!orderBy) return { key: newColumnKey, direction: 'asc' };
    const { key, direction } = orderBy;

    if (direction === 'desc') return null;

    return { key: newColumnKey, direction: key === newColumnKey ? 'desc' : 'asc' };
  }

  static orderItems<T>(items: T[], key: keyof T, direction: 'asc' | 'desc'): T[] {
    return this.deepClone(items).sort((a, b) => this.orderFn(a, b, key, direction));
  }

  private static orderFn<T>(a: T, b: T, key?: keyof T, direction?: string): number {
    if (!key || !direction) return 0;
    const multiplier = direction === 'asc' ? 1 : -1;

    return a[key] < b[key] ? -multiplier : a[key] > b[key] ? multiplier : 0;
  }

  static isFromEnum<T extends object>(enumType: T, value: unknown): boolean {
    if (value == null) return false;

    return Object.values(enumType).includes(value);
  }

  static shouldParseJson(value: string | null | undefined): boolean {
    if (value == null) return false;
    return RegExp(/^\{.*\}$/).test(value) || RegExp(/^\[.*\]$/).test(value);
  }

  /*
   * Returns true if every item is equal in value and position, does not check for deep equality
   *
   */
  static arraysAreEqualShallow<T>(
    array1: T[] | undefined | null,
    array2: T[] | undefined | null
  ): boolean {
    if (array1 == null || array1.length !== array2?.length) return false;

    return array1.every((item, index) => item === array2[index]);
  }

  static arraysAreEqualDeep<T>(
    array1: T[] | undefined | null,
    array2: T[] | undefined | null
  ): boolean {
    if (array1 == null || array1.length !== array2?.length) return false;

    return array1.every((item, index) => JSON.stringify(item) === JSON.stringify(array2[index]));
  }

  static buildApiUrl = (endpoint: ApiEndpoints): string => {
    const url = environment.apiUrl;

    return `${url}${endpoint}`;
  };

  static isEmail = (email: string): boolean => {
    return RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);
  };
}
