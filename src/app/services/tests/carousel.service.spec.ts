import { TestBed, inject } from '@angular/core/testing';
import { CarouselService } from '../carousel.service';
import { ElementIds } from 'src/app/utils';
import { DateSlide, DaysOfWeek } from 'src/app/models/types';
import { assertAreEqual } from './test-utils';

fdescribe('Service: Carousel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarouselService],
    });
  });

  it('should create', inject([CarouselService], (service: CarouselService) => {
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
          dayOfWeek: DaysOfWeek.Thursday,
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '01/01/2021',
          day: '01',
          dayOfWeek: DaysOfWeek.Friday,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '02/01/2021',
          day: '02',
          dayOfWeek: DaysOfWeek.Saturday,
        },
      ];
      const expectedSize = 3;

      const result = CarouselService.buildDatesCarousel(mockBaseDate, expectedSize);

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.date).toEqual(expectedSlides[i].date);
        expect(slide.day).toEqual(expectedSlides[i].day);
        expect(slide.dayOfWeek).toEqual(expectedSlides[i].dayOfWeek);
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
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '31/12/2020',
          day: '31',
          dayOfWeek: DaysOfWeek.Thursday,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '01/01/2021',
          day: '01',
          dayOfWeek: DaysOfWeek.Friday,
        },
        {
          id: `${ElementIds.DateCarouselSlide}4`,
          date: '02/01/2021',
          day: '02',
          dayOfWeek: DaysOfWeek.Saturday,
        },
      ];
      const expectedSize = 4;

      const result = CarouselService.buildDatesCarousel(mockBaseDate, expectedSize);

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.date).toEqual(expectedSlides[i].date);
        expect(slide.day).toEqual(expectedSlides[i].day);
        expect(slide.dayOfWeek).toEqual(expectedSlides[i].dayOfWeek);
      });
    });
  });
});
