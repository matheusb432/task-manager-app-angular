import {
  DatePipe,
  FormStyle,
  TranslationWidth,
  WeekDay,
  getLocaleMonthNames,
} from '@angular/common';
import { Injectable } from '@angular/core';
import { DateValues, DaysOfWeek } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class DateUtil {
  static formatDateToUniversalFormat = (date: Date): string => {
    if (!date) return '';

    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(date, 'yyyy-MM-dd');

    return formattedDate || '';
  };

  static dateStringToDate = (dateString: string): Date => {
    const [year, monthIndex, day] = dateString.split('-').map((x) => +x);

    return new Date(year, monthIndex - 1, day);
  };

  static formatDateTimeToUniversalFormat = (date: Date): string => {
    if (!date) return '';

    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss');

    return formattedDate || '';
  };

  static formatDay = (date: Date): string => {
    if (!date) return '';

    return DateUtil.formatDayFromNumber(date.getDate());
  };

  private static formatDayFromNumber = (day: number): string => {
    if (!day) return '';

    return day.toString().padStart(2, '0');
  };

  static toDayOfWeek = (dayOfWeek: WeekDay): DaysOfWeek | '' => {
    const weekDays: { [key: number]: DaysOfWeek } = {
      [WeekDay.Sunday]: DaysOfWeek.Sunday,
      [WeekDay.Monday]: DaysOfWeek.Monday,
      [WeekDay.Tuesday]: DaysOfWeek.Tuesday,
      [WeekDay.Wednesday]: DaysOfWeek.Wednesday,
      [WeekDay.Thursday]: DaysOfWeek.Thursday,
      [WeekDay.Friday]: DaysOfWeek.Friday,
      [WeekDay.Saturday]: DaysOfWeek.Saturday,
    };

    return weekDays[dayOfWeek] ?? '';
  };

  static addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  static getMonthName = (month: number): string => {
    const monthNames = getLocaleMonthNames('en-US', FormStyle.Format, TranslationWidth.Wide);

    return monthNames[month - 1];
  };

  static isWeekend = (dayOfWeek: WeekDay): boolean => {
    return dayOfWeek === WeekDay.Saturday || dayOfWeek === WeekDay.Sunday;
  };

  static isToday = (date: number, month: number, year: number): boolean => {
    const today = new Date();
    return date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  static getDateValues(date: Date): DateValues {
    const dayIndex = date.getDay();

    const dateNumber = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const formattedDate = DateUtil.formatDateToUniversalFormat(date);
    const day = DateUtil.formatDayFromNumber(dateNumber);
    const dayOfWeek = DateUtil.toDayOfWeek(dayIndex);
    const isWeekend = DateUtil.isWeekend(dayIndex);
    const month = DateUtil.getMonthName(monthIndex + 1);

    return {
      date: formattedDate,
      dayOfWeek,
      day,
      month,
      year,
      isWeekend,
      isToday: DateUtil.isToday(dateNumber, monthIndex, year),
    };
  }
}
