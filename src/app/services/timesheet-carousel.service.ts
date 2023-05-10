import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateUtil } from '../util';
import { DateSlide, TimesheetMetricsDto } from 'src/app/models';
import { ElementIds } from '../util';
import { ODataOperators } from '../helpers/odata';
import { TimesheetApiService } from './api';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetCarouselService {
  private slides$ = new BehaviorSubject<DateSlide[]>(TimesheetCarouselService.defaultCarousel());

  constructor(private timesheetApi: TimesheetApiService, private ts: ToastService) {
    this.loadSlides(new Date(), 30);
  }

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

  async loadSlides(centerDate: Date, size: number): Promise<void> {
    const slides = TimesheetCarouselService.buildDatesCarousel(centerDate, size);

    const firstDate = DateUtil.dateStringToDate(slides[0].date);
    const lastDate = DateUtil.dateStringToDate(slides[slides.length - 1].date);

    try {
      const metricsList = await this.getMetricsByRange(firstDate, lastDate);

      slides.forEach((slide) => {
        const metrics = metricsList.find(
          (m) => m.date != null && DateUtil.dateTimeStringToDateString(m.date) === slide.date
        );

        if (metrics == null) return;

        slide.metrics = metrics;
        console.log(slide);
      });
    } catch (error) {
      this.ts.error('Error loading timesheet metrics!');
      throw error;
    } finally {
      console.log(slides);
      this.slides$.next(slides);
    }
  }

  static defaultCarousel = (): DateSlide[] => {
    const today = new Date();

    return TimesheetCarouselService.buildDatesCarousel(today, 30);
  };

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

  getMetricsByRange = async (from: Date, to: Date): Promise<TimesheetMetricsDto[]> => {
    const metrics = await this.timesheetApi.getMetricsQuery({
      filter: {
        date: [
          [ODataOperators.GreaterThanOrEqualTo, from],
          [ODataOperators.LessThanOrEqualTo, to],
        ],
      },
    });

    return metrics;
  };
}
