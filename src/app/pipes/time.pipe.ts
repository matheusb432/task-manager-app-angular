import { Pipe, PipeTransform } from '@angular/core';
import { Nullish } from '../models';
import { StringUtil } from '../util';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: string | number | Nullish): unknown {
    return TimePipe.formatTimeHhMm(value);
  }

  static formatTimeHhMm(time: string | number | Nullish): string {
    if (time == null) return '';
    if (typeof time !== 'number') return time;

    return StringUtil.numberToTime(time);
  }
}
