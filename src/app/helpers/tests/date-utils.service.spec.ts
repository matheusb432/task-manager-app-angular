import { TestBed, inject } from '@angular/core/testing';
import { DateUtilsService } from '../date-utils.service';

describe('Service: DateUtils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateUtilsService],
    });
  });

  it('should create', inject([DateUtilsService], (service: DateUtilsService) => {
    expect(service).toBeTruthy();
  }));

  describe('formatDate', () => {
    it('should return an empty string when given a falsy value', () => {
      expect(DateUtilsService.formatDate(null as unknown as Date)).toEqual('');
      expect(DateUtilsService.formatDate(undefined as unknown as Date)).toEqual('');
    });

    it('should format a date correctly', () => {
      const date = new Date(2023, 3, 21);
      expect(DateUtilsService.formatDate(date)).toEqual('21/04/2023');
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 3, 21, 12, 0, 0, 0);
      DateUtilsService.formatDate(date);
      expect(date).toEqual(new Date(2023, 3, 21, 12, 0, 0, 0));
    });
  });

  describe('toDayOfWeek', () => {
    it('should return the day of the week', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtilsService.toDayOfWeek(date.getDay())).toEqual('Mon');
    });

    it('should return an empty string when given a falsy value', () => {
      expect(DateUtilsService.toDayOfWeek(null as unknown as number)).toEqual('');
      expect(DateUtilsService.toDayOfWeek(undefined as unknown as number)).toEqual('');
    });
  });

  describe('addDays', () => {
    it('should return the date with the added days', () => {
      const date = new Date(2023, 4, 1);
      expect(DateUtilsService.addDays(date, 1)).toEqual(new Date(2023, 4, 2));
    });

    it('should move to the next month', () => {
      const date = new Date(2023, 4, 31);
      expect(DateUtilsService.addDays(date, 1)).toEqual(new Date(2023, 5, 1));
    });

    it('should not modify the original date', () => {
      const date = new Date(2023, 4, 1);
      DateUtilsService.addDays(date, 1);
      expect(date).toEqual(new Date(2023, 4, 1));
    });
  });

  describe('formatDay', () => {
    it('should return the day with a leading zero', () => {
      expect(DateUtilsService.formatDay(new Date(2023, 4, 1))).toEqual('01');
      expect(DateUtilsService.formatDay(new Date(2023, 4, 20))).toEqual('20');
    });

    it('should return an empty string when given a falsy value', () => {
      expect(DateUtilsService.formatDay(null as unknown as Date)).toEqual('');
      expect(DateUtilsService.formatDay(null as unknown as Date)).toEqual('');
    });
  });
});
