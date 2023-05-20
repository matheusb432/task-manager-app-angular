import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { DateUtil } from '../util';
import { DateRangeValue } from '../components/custom/inputs';
import { AsNonNullable } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly defaultRange = {
    start: DateUtil.addMonths(new Date(), -1),
    end: DateUtil.addMonths(new Date(), 1),
  };

  private _activeDateString$ = new BehaviorSubject<string>(
    DateUtil.formatDateToUniversalFormat(new Date())
  );
  private _dateRange$ = new BehaviorSubject<AsNonNullable<DateRangeValue> | null>(null);

  get dateRange$() {
    return this._dateRange$
      .asObservable()
      .pipe(filter((dateRange): dateRange is AsNonNullable<DateRangeValue> => dateRange != null));
  }

  get dateRangeOrDefault$() {
    return this.dateRange$.pipe(map((dateRange) => dateRange ?? this.defaultRange));
  }

  get activeDateString$() {
    return this._activeDateString$.asObservable().pipe(
      filter((dateString) => !!dateString),
      map(DateUtil.dateTimeStringToDateString)
    );
  }

  getActiveDate(): Date {
    const activeDateString = this._activeDateString$.getValue();

    return DateUtil.dateStringToDate(activeDateString);
  }

  setActiveDate(value: Date | string): void {
    this._activeDateString$.next(
      typeof value === 'string' ? value : DateUtil.formatDateTimeToUniversalFormat(value)
    );
  }

  getDateRange() {
    return this._dateRange$.getValue();
  }

  getDateRangeOrDefault() {
    return this.getDateRange() ?? this.defaultRange;
  }

  setDateRange(value: AsNonNullable<DateRangeValue>): void {
    this._dateRange$.next(value);
  }

  initDateRange(): void {
    if (this.getDateRange() != null) return;
    this.setDateRange(this.defaultRange);
  }
}
