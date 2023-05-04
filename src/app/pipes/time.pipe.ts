import { Pipe, PipeTransform } from '@angular/core';
import { us } from '../helpers';
import { Nullish } from '../models';

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

    return us.numberToTime(time);
  }
}
