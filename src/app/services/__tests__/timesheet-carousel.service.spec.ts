import { TestBed, inject } from '@angular/core/testing';
import { DateSlide, DaysOfWeek } from 'src/app/models';
import { ElementIds } from 'src/app/util';
import { TimesheetCarouselService } from '../timesheet-carousel.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TimesheetService } from '../timesheet.service';
import { mockToastService } from './test-utils';
import { ToastService } from '../toast.service';
import { of } from 'rxjs';

describe('Service: TimesheetCarousel', () => {
  const toastService = mockToastService();

  beforeEach(() => {
    const mockTimesheetService = {
      defaultRange: jasmine.createSpy(),
      activeDateString$: of(),
      dateRange$: of(),
      item$: of(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TimesheetCarouselService,
        {
          provide: TimesheetService,
          useValue: mockTimesheetService,
        },
        {
          provide: ToastService,
          useValue: toastService,
        },
      ],
    });
  });

  it('should create', inject([TimesheetCarouselService], (service: TimesheetCarouselService) => {
    expect(service).toBeTruthy();
  }));

  describe('buildDatesCarouselFromCenterDate', () => {
    it('should return the date slides on odd sizes', () => {
      const mockBaseDate = new Date(2021, 0, 1);
      const expectedSlides: DateSlide[] = [
        {
          id: `${ElementIds.DateCarouselSlide}1`,
          date: '2020-12-31',
          day: '31',
          month: 'December',
          dayOfWeek: DaysOfWeek.Thursday,
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '2021-01-01',
          day: '01',
          month: 'January',
          dayOfWeek: DaysOfWeek.Friday,
          isWeekend: false,
          year: 2021,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '2021-01-02',
          day: '02',
          month: 'January',
          dayOfWeek: DaysOfWeek.Saturday,
          isWeekend: true,
          year: 2021,
        },
      ];
      const expectedSize = 3;

      const result = TimesheetCarouselService.buildDatesCarouselFromCenterDate(
        mockBaseDate,
        expectedSize
      );

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.day).toEqual(expectedSlides[i].day);
        expect(slide.dayOfWeek).toEqual(expectedSlides[i].dayOfWeek);
        expect(slide.month).toEqual(expectedSlides[i].month);
      });
    });

    it('should return the date slides on even sizes', () => {
      const mockBaseDate = new Date(2021, 0, 1);
      const expectedSlides: DateSlide[] = [
        {
          id: `${ElementIds.DateCarouselSlide}1`,
          date: '2021-12-30',
          day: '30',
          dayOfWeek: DaysOfWeek.Wednesday,
          month: 'December',
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '2021-12-31',
          day: '31',
          dayOfWeek: DaysOfWeek.Thursday,
          month: 'December',
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '2021-01-01',
          day: '01',
          dayOfWeek: DaysOfWeek.Friday,
          month: 'January',
          isWeekend: false,
          year: 2021,
        },
        {
          id: `${ElementIds.DateCarouselSlide}4`,
          date: '2021-01-02',
          day: '02',
          dayOfWeek: DaysOfWeek.Saturday,
          month: 'January',
          isWeekend: true,
          year: 2021,
        },
      ];
      const expectedSize = 4;

      const result = TimesheetCarouselService.buildDatesCarouselFromCenterDate(
        mockBaseDate,
        expectedSize
      );

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.day).toEqual(expectedSlides[i].day);
        expect(slide.dayOfWeek).toEqual(expectedSlides[i].dayOfWeek);
        expect(slide.month).toEqual(expectedSlides[i].month);
      });
    });
  });

  describe('buildDatesCarouselFromRange', () => {
    it('should return the date slides on odd sizes', () => {
      const mockFromDate = new Date(2021, 0, 1);
      const mockToDate = new Date(2021, 0, 3);
      const expectedStartDate = '2021-01-01';
      const expectedEndDate = '2021-01-03';
      const expectedSize = 3;

      const result = TimesheetCarouselService.buildDatesCarouselFromRange(mockFromDate, mockToDate);

      expect(result.length).toBe(expectedSize);
      expect(result[0].date).toEqual(expectedStartDate);
      expect(result[result.length - 1].date).toEqual(expectedEndDate);
    });

    it('should return the date slides on even sizes', () => {
      const mockFromDate = new Date(2021, 0, 1);
      const mockToDate = new Date(2021, 0, 4);
      const expectedStartDate = '2021-01-01';
      const expectedEndDate = '2021-01-04';
      const expectedSize = 4;

      const result = TimesheetCarouselService.buildDatesCarouselFromRange(mockFromDate, mockToDate);

      expect(result.length).toBe(expectedSize);
      expect(result[0].date).toEqual(expectedStartDate);
      expect(result[result.length - 1].date).toEqual(expectedEndDate);
    });
  });
});