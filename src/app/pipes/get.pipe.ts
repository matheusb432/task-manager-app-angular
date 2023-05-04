import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash-es';
import { us } from '../helpers';

@Pipe({
  name: 'get',
})
/*
 * Pipe to get a nested value from an object.
 * Usage:
 *  value | get:nestedKey
 * Example:
 * {{ { foo: { bar: 'barValue' } } | get:'foo.bar' }} -> 'barValue'
 */
export class GetPipe implements PipeTransform {
  transform(value: object, nestedKey: string): unknown {
    if (value == null || !nestedKey) return '';

    return this.getNestedValue(value, nestedKey);
  }

  private getNestedValue(value: object, nestedKey: string): unknown {
    const nestedValue = us.getPropValue(value, nestedKey);

    if (typeof nestedValue === 'object' || nestedValue == null) return '';
    return nestedValue;
  }
}
