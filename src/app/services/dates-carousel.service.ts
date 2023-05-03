import { Injectable } from '@angular/core';
import { DateSlide, DateValues } from '../models/types';
import { DateUtilsService } from '../helpers';
import { ElementIds } from '../utils';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatesCarouselService {
  private slides$ = new BehaviorSubject<DateSlide[]>(
    DatesCarouselService.buildDatesCarousel(new Date(), 60)
  );

  getSlides(): Observable<DateSlide[]> {
    return this.slides$.asObservable();
  }

  setSlides(dateSlides: DateSlide[]): void {
    this.slides$.next(dateSlides);
  }

  addSlides(dateSlides: DateSlide[]): void {
    const currentSlides = this.slides$.getValue();
    this.slides$.next([...currentSlides, ...dateSlides]);
  }

  static buildDatesCarousel(centerDate: Date, size: number): DateSlide[] {
    if (centerDate == null) return [];

    const slides: DateSlide[] = [];
    const daysToAdd = -Math.floor(size / 2);
    let lastMonth = '';

    for (let days = 0; days < size; days++) {
      const date = DateUtilsService.addDays(centerDate, days + daysToAdd);
      const dateValues = DateUtilsService.getDateValues(date);

      slides.push({
        id: `${ElementIds.DateCarouselSlide}${days + 1}`,
        ...dateValues,
        selected: days + daysToAdd === 0,
        firstOfMonth: dateValues.month !== lastMonth,
      });

      lastMonth = dateValues.month;
    }
    return slides;
  }
}
