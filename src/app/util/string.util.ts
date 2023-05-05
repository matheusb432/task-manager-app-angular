import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringUtil {
  static capitalize = (word: string | undefined): string => {
    if (!word) return '';

    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  };

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

  static isEmail = (email: string): boolean => {
    return RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);
  };

  static notEmpty(items: unknown[] | string | undefined | null): boolean {
    return items != null && items?.length > 0;
  }

  static unsafeRandomHex(length = 10): string {
    const hex = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += hex[Math.floor(Math.random() * 16)];
    }
    return result;
  }
}
