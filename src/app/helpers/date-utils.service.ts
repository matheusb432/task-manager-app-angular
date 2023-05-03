import {
  DatePipe,
  FormStyle,
  TranslationWidth,
  WeekDay,
  getLocaleMonthNames,
} from '@angular/common';
import { Injectable } from '@angular/core';
import { DateValues, DaysOfWeek } from '../models/types';

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

  static getDateValues(date: Date): DateValues {
    const formattedDate = DateUtilsService.formatDate(date);
    const day = DateUtilsService.formatDayFromNumber(date.getDate());
    const dayOfWeek = DateUtilsService.toDayOfWeek(date.getDay());
    const month = DateUtilsService.getMonthName(date.getMonth() + 1);

    return {
      date: formattedDate,
      dayOfWeek,
      day,
      month,
      year: date.getFullYear(),
    };
  }
}
