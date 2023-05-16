import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, pairwise, takeUntil, tap } from 'rxjs';
import { DateSlide, Timesheet, TimesheetMetricsDto } from 'src/app/models';
import { QueryUtil } from 'src/app/util';
import { DateUtil, ElementIds, PubSubUtil } from '../util';
import { TimesheetApiService } from './api';
import { TimesheetService } from './timesheet.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetCarouselService implements OnDestroy {
  private _slides$ = new BehaviorSubject<DateSlide[]>([]);
  private destroyed$ = new Subject<boolean>();

  get slides$() {
    return this._slides$.asObservable();
  }

  constructor(
    private service: TimesheetService,
    private timesheetApi: TimesheetApiService,
    private ts: ToastService
  ) {
    this.initSubs();
  }

  initSubs(): void {
    this.service.item$.pipe(takeUntil(this.destroyed$)).subscribe((timesheet) => {
      if (timesheet?.date == null || !(timesheet instanceof Timesheet)) return;

      const metrics = Timesheet.buildMetricsDto(timesheet);
      this.setMetric(DateUtil.dateTimeStringToDateString(timesheet.date), metrics);
    });
    this.service.activeDateString$.pipe(takeUntil(this.destroyed$)).subscribe((dateString) => {
      if (!dateString) return;

      this.setActiveSlide(dateString);
    });
    this.slides$
      .pipe(
        takeUntil(this.destroyed$),
        pairwise(),
        tap(([prevSlides, currSlides]) => {
          if (!this.shouldLoadSlides(prevSlides, currSlides)) return;

          this.loadSlidesMetrics();
        })
      )
      .subscribe();
    this.service.dateRange$.pipe(takeUntil(this.destroyed$)).subscribe((dateRange) => {
      if (dateRange == null) return;

      const { start, end } = dateRange;
      this.setSlides(TimesheetCarouselService.buildDatesCarouselFromRange(start, end));
    });
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  setSlides(dateSlides: DateSlide[]): void {
    this._slides$.next(dateSlides);
  }

  addSlides(dateSlides: DateSlide[]): void {
    const currentSlides = this._slides$.getValue();
    this._slides$.next([...currentSlides, ...dateSlides]);
  }

  setActiveSlide(dateString: string): void {
    const slides = this._slides$.getValue();
    const activeSlide = slides.find((s) => s.date === dateString);
    if (activeSlide == null) return;

    const newSlides = slides.map((s) => {
      const isActiveSlide = s === activeSlide;
      if (s.selected === isActiveSlide) return s;

      return { ...s, selected: isActiveSlide };
    });

    this._slides$.next(newSlides);
  }

  async loadSlidesMetrics(): Promise<void> {
    const slides = this._slides$.getValue();

    const dates = TimesheetCarouselService.getSlidesFirstAndLastDates(slides);
    if (dates == null) return;
    const { first, last } = dates;

    try {
      const metricsList = await this.getMetricsByRange(first, last);

      const newSlides = this._slides$.getValue().map((slide) => {
        const metrics = metricsList.find(
          (m) => m.date != null && DateUtil.dateTimeStringToDateString(m.date) === slide.date
        );

        if (metrics == null) return slide;

        return { ...slide, metrics };
      });
      this._slides$.next(newSlides);
    } catch (error) {
      this.ts.error('Error loading timesheet metrics!');

      throw error;
    }
  }

  setMetric(dateString: string, metric: TimesheetMetricsDto): void {
    const slides = this._slides$.getValue();
    const slide = slides.find((s) => s.date === dateString);
    if (slide == null) return;

    const newSlides = slides.map((s) => {
      if (s !== slide) return s;

      return { ...s, metrics: metric };
    });

    this._slides$.next(newSlides);
  }

  shouldLoadSlides(prevSlides: DateSlide[], currSlides: DateSlide[]): boolean {
    const prevDates = TimesheetCarouselService.getSlidesFirstAndLastDates(prevSlides);
    const currDates = TimesheetCarouselService.getSlidesFirstAndLastDates(currSlides);

    if (prevDates == null) return true;
    if (currDates == null) return false;

    return (
      !DateUtil.datesEqual(prevDates.first, currDates.first) ||
      !DateUtil.datesEqual(prevDates.last, currDates.last)
    );
  }

  getMetricsByRange = async (from: Date, to: Date): Promise<TimesheetMetricsDto[]> => {
    const metrics = await this.timesheetApi.getMetricsQuery({
      filter: {
        ...QueryUtil.getDateRangeFilter('date', from, to),
      },
    });

    return metrics;
  };

  defaultCarousel(): DateSlide[] {
    const { start, end } = this.service.defaultRange;

    return TimesheetCarouselService.buildDatesCarouselFromRange(start, end);
  }

  static getSlidesFirstAndLastDates = (slides: DateSlide[]): { first: Date; last: Date } | null => {
    if (slides.length === 0) return null;

    const first = DateUtil.dateStringToDate(slides[0].date);
    const last = DateUtil.dateStringToDate(slides[slides.length - 1].date);

    return { first, last };
  };

  static buildDatesCarouselFromRange = (from: Date, to: Date): DateSlide[] => {
    const size = DateUtil.daysDiff(from, to) + 1;

    return TimesheetCarouselService.buildDatesCarousel(from, size);
  };

  static buildDatesCarouselFromCenterDate(centerDate: Date, size: number): DateSlide[] {
    if (centerDate == null) return [];

    const daysToAdd = -Math.floor(size / 2);
    return TimesheetCarouselService.buildDatesCarousel(centerDate, size, daysToAdd);
  }

  private static buildDatesCarousel(
    initialDate: Date,
    size: number,
    daysToAdd = 0,
    lastMonth = ''
  ): DateSlide[] {
    const slides: DateSlide[] = [];
    for (let days = 0; days < size; days++) {
      const date = DateUtil.addDays(initialDate, days + daysToAdd);
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
