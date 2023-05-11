import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, takeUntil } from 'rxjs';
import { DateUtil, PubSubUtil } from '../util';
import { DateSlide, Timesheet, TimesheetMetricsDto } from 'src/app/models';
import { ElementIds } from '../util';
import { ODataOperators } from '../helpers/odata';
import { TimesheetApiService } from './api';
import { ToastService } from './toast.service';
import { TimesheetService } from './timesheet.service';

@Injectable({
  providedIn: 'root',
})
// TODO move timesheet carousel component state to here
export class TimesheetCarouselService implements OnDestroy {
  private slides$ = new BehaviorSubject<DateSlide[]>(TimesheetCarouselService.defaultCarousel());
  private destroyed$ = new Subject<boolean>();

  constructor(
    private service: TimesheetService,
    private timesheetApi: TimesheetApiService,
    private ts: ToastService
  ) {
    this.loadSlides(new Date(), 30);
    this.initSubs();
  }

  initSubs(): void {
    // TODO to activeDate$ ? To use on /create
    this.service.item$.pipe(takeUntil(this.destroyed$)).subscribe((item) => {
      const itemDateString = DateUtil.dateTimeStringToDateString(item?.date);
      if (!itemDateString) return;

      this.setActiveSlide(itemDateString);
    });
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
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

  setActiveSlide(dateString: string): void {
    const slides = this.slides$.getValue();
    const activeSlide = slides.find((s) => s.date === dateString);
    if (activeSlide == null) return;

    const newSlides = slides.map((s) => {
      const isActiveSlide = s === activeSlide;
      if (s.selected === isActiveSlide) return s;
      return { ...s, selected: isActiveSlide };
    });

    this.slides$.next(newSlides);
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
      });
    } catch (error) {
      this.ts.error('Error loading timesheet metrics!');

      throw error;
    } finally {
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
