import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateUtil } from '../util';
import { DateSlide } from 'src/app/models';
import { ElementIds } from '../util';

@Injectable({
  providedIn: 'root',
})
export class DatesCarouselService {
  private slides$ = new BehaviorSubject<DateSlide[]>(
    DatesCarouselService.buildDatesCarousel(new Date(), 30)
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
      const date = DateUtil.addDays(centerDate, days + daysToAdd);
      const dateValues = DateUtil.getDateValues(date);

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
