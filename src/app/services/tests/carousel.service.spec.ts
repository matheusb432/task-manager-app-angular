import { TestBed, inject } from '@angular/core/testing';
import { DateSlide, DaysOfWeek } from 'src/app/models/types';
import { ElementIds } from 'src/app/utils';
import { DatesCarouselService } from '../dates-carousel.service';

fdescribe('Service: Carousel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatesCarouselService],
    });
  });

  it('should create', inject([DatesCarouselService], (service: DatesCarouselService) => {
    expect(service).toBeTruthy();
  }));

  describe('buildDatesCarousel', () => {
    it('should return the date slides on odd sizes', () => {
      const mockBaseDate = new Date(2021, 0, 1);
      const expectedSlides: DateSlide[] = [
        {
          id: `${ElementIds.DateCarouselSlide}1`,
          date: '31/12/2020',
          day: '31',
          month: 'December',
          dayOfWeek: DaysOfWeek.Thursday,
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '01/01/2021',
          day: '01',
          month: 'January',
          dayOfWeek: DaysOfWeek.Friday,
          isWeekend: false,
          year: 2021,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '02/01/2021',
          day: '02',
          month: 'January',
          dayOfWeek: DaysOfWeek.Saturday,
          isWeekend: true,
          year: 2021,
        },
      ];
      const expectedSize = 3;

      const result = DatesCarouselService.buildDatesCarousel(mockBaseDate, expectedSize);

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.date).toEqual(expectedSlides[i].date);
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
          date: '30/12/2020',
          day: '30',
          dayOfWeek: DaysOfWeek.Wednesday,
          month: 'December',
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '31/12/2020',
          day: '31',
          dayOfWeek: DaysOfWeek.Thursday,
          month: 'December',
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '01/01/2021',
          day: '01',
          dayOfWeek: DaysOfWeek.Friday,
          month: 'January',
          isWeekend: false,
          year: 2021,
        },
        {
          id: `${ElementIds.DateCarouselSlide}4`,
          date: '02/01/2021',
          day: '02',
          dayOfWeek: DaysOfWeek.Saturday,
          month: 'January',
          isWeekend: true,
          year: 2021,
        },
      ];
      const expectedSize = 4;

      const result = DatesCarouselService.buildDatesCarousel(mockBaseDate, expectedSize);

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.date).toEqual(expectedSlides[i].date);
        expect(slide.day).toEqual(expectedSlides[i].day);
        expect(slide.dayOfWeek).toEqual(expectedSlides[i].dayOfWeek);
        expect(slide.month).toEqual(expectedSlides[i].month);
      });
    });
  });
});
