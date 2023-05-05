import { TestBed, inject } from '@angular/core/testing';
import { DateUtil } from '../date.util';
import { DateValues, DaysOfWeek } from 'src/app/models';
import { WeekDay } from '@angular/common';

describe('Util: Date', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateUtil],
    });
  });

  it('should create', inject([DateUtil], (service: DateUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('formatDate', () => {
    it('should return an empty string when given a falsy value', () => {
      expect(DateUtil.formatDate(null as unknown as Date)).toEqual('');
      expect(DateUtil.formatDate(undefined as unknown as Date)).toEqual('');
    });

    it('should format a date correctly', () => {
      const date = new Date(2023, 3, 21);
      expect(DateUtil.formatDate(date)).toEqual('21/04/2023');
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 3, 21, 12, 0, 0, 0);
      DateUtil.formatDate(date);
      expect(date).toEqual(new Date(2023, 3, 21, 12, 0, 0, 0));
    });
  });

  describe('toDayOfWeek', () => {
    it('should return the day of the week', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtil.toDayOfWeek(date.getDay())).toEqual('Mon');
    });

    it('should return an empty string when given a falsy value', () => {
      expect(DateUtil.toDayOfWeek(null as unknown as number)).toEqual('');
      expect(DateUtil.toDayOfWeek(undefined as unknown as number)).toEqual('');
    });
  });

  describe('addDays', () => {
    it('should return the date with the added days', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtil.addDays(date, 1)).toEqual(new Date(2023, 4, 2));
    });

    it('should move to the next month', () => {
      const date = new Date(2023, 4, 31);
      expect(DateUtil.addDays(date, 1)).toEqual(new Date(2023, 5, 1));
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 4, 1);
      DateUtil.addDays(date, 1);
      expect(date).toEqual(new Date(2023, 4, 1));
    });
  });

  describe('formatDay', () => {
    it('should return the day with a leading zero', () => {
      expect(DateUtil.formatDay(new Date(2023, 4, 1))).toEqual('01');
      expect(DateUtil.formatDay(new Date(2023, 4, 20))).toEqual('20');
    });

    it('should return an empty string when given a falsy value', () => {
      expect(DateUtil.formatDay(null as unknown as Date)).toEqual('');
      expect(DateUtil.formatDay(null as unknown as Date)).toEqual('');
    });
  });

  describe('isWeekend', () => {
    it('should return true when the day index is a weekend', () => {
      expect(DateUtil.isWeekend(WeekDay.Saturday)).toEqual(true);
      expect(DateUtil.isWeekend(WeekDay.Sunday)).toEqual(true);
    });

    it('should return false when the day index is not a weekend', () => {
      expect(DateUtil.isWeekend(WeekDay.Thursday)).toEqual(false);
      expect(DateUtil.isWeekend(WeekDay.Friday)).toEqual(false);
    });
  });

  describe('getDateValues', () => {
    it('should return the date values', () => {
      const expectedResult: DateValues = {
        day: '01',
        dayOfWeek: DaysOfWeek.Monday,
        month: 'May',
        date: '01/05/2023',
        year: 2023,
        isWeekend: false,
        isToday: false,
      }
      expect(DateUtil.getDateValues(new Date(2023, 4, 1))).toEqual(expectedResult);
    });
  });

  describe('isToday', () => {
    it('should return true when the date is today', () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();

      expect(DateUtil.isToday(day, month, year)).toEqual(true);
    });

    it('should return false when the date is not today', () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate() + 1;

      expect(DateUtil.isToday(day, month, year)).toEqual(false);
    });
  });
});
