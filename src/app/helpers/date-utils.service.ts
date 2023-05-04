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
export class DateUtilsService {
  static formatDate = (date: Date): string => {
    if (!date) return '';

    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(date, 'dd/MM/yyyy');

    return formattedDate || '';
  };

  static formatDay = (date: Date): string => {
    if (!date) return '';

    return DateUtilsService.formatDayFromNumber(date.getDate());
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

  static getDateValues(date: Date): DateValues {
    const dayIndex = date.getDay();

    const formattedDate = DateUtilsService.formatDate(date);
    const day = DateUtilsService.formatDayFromNumber(date.getDate());
    const dayOfWeek = DateUtilsService.toDayOfWeek(dayIndex);
    const isWeekend = DateUtilsService.isWeekend(dayIndex);
    const month = DateUtilsService.getMonthName(date.getMonth() + 1);

    return {
      date: formattedDate,
      dayOfWeek,
      day,
      month,
      year: date.getFullYear(),
      isWeekend,
    };
  }
}
