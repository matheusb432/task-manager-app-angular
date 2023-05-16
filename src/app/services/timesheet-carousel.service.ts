import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, pairwise, shareReplay, takeUntil, tap } from 'rxjs';
import { DateSlide, MonthSlide, Timesheet, TimesheetMetricsDto } from 'src/app/models';
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
  private _monthSlides$ = new BehaviorSubject<MonthSlide[]>([]);

  private destroyed$ = new Subject<boolean>();

  get slides$() {
    return this._slides$.asObservable();
  }

  get monthSlides$() {
    return this._monthSlides$.asObservable();
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

      this.selectSlideByDate(dateString);
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

  private setSlides(dateSlides: DateSlide[]): void {
    this._slides$.next(dateSlides);
  }

  private setMonthSlides(monthSlides: MonthSlide[]): void {
    this._monthSlides$.next(monthSlides);
  }

  addSlides(dateSlides: DateSlide[]): void {
    const currentSlides = this._slides$.getValue();
    this._slides$.next([...currentSlides, ...dateSlides]);
  }

  selectSlideByDate(dateString: string): void {
    const slides = this._slides$.getValue();
    const activeSlide = slides.find((s) => s.date === dateString);
    if (activeSlide == null) return;
    this.selectSlideByIdWithSlides(activeSlide.id, slides);
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

  getSlides(): DateSlide[] {
    return this._slides$.getValue();
  }

  selectSlideById(id: string): void {
    const slides = this._slides$.getValue();
    this.selectSlideByIdWithSlides(id, slides);
  }

  getMonthSlides(): MonthSlide[] {
    return this._monthSlides$.getValue();
  }

  setMonthSlidesFromSlides(): MonthSlide[] {
    const monthSlides = this.getUniqueMonthsFromSlides();
    this.setMonthSlides(monthSlides);
    return monthSlides;
  }

  private getUniqueMonthsFromSlides(): MonthSlide[] {
    const slides = this.getSlides();

    const monthSlides = slides
      .map(TimesheetCarouselService.uniqueMonthFromSlideOrDefault)
      .filter((slide) => slide != null) as MonthSlide[];

    return monthSlides;
  }

  private static uniqueMonthFromSlideOrDefault(
    slide: DateSlide,
    index: number,
    current: DateSlide[]
  ): MonthSlide | undefined {
    if (index === 0) return TimesheetCarouselService.buildMonthSlide(slide.month, slide.year);

    return current[index - 1].month === slide.month
      ? undefined
      : TimesheetCarouselService.buildMonthSlide(slide.month, slide.year);
  }

  private static buildMonthSlide(month: string, year: number): MonthSlide {
    return {
      id: TimesheetCarouselService.buildMonthSlideId(month, year),
      month,
      year,
      isNextMonth: false,
      selected: false,
    };
  }

  static buildMonthSlideId(month: string, year: number): string {
    return `${ElementIds.MonthCarouselSlide}${month}${year}`;
  }

  private selectSlideByIdWithSlides(id: string, slides: DateSlide[]): void {
    const newSlides = slides ?? this._slides$.getValue();
    const slideToSelectIndex = newSlides.findIndex((slide) => slide.id === id);

    if (slideToSelectIndex < 0) return;

    const selectedSlideIndex = newSlides.findIndex((slide) => slide.selected);
    if (selectedSlideIndex >= 0) {
      newSlides[selectedSlideIndex] = {
        ...newSlides[selectedSlideIndex],
        selected: false,
      };
    }

    newSlides[slideToSelectIndex] = { ...newSlides[slideToSelectIndex], selected: true };
    this.setSlides(newSlides);
  }

  selectMonthSlideById(id: string): void {
    let newMonthSlides = this._monthSlides$.getValue();

    const slideIndex = newMonthSlides.findIndex((slide) => slide.id === id);

    if (slideIndex >= 0 && newMonthSlides[slideIndex].selected) return;

    newMonthSlides = newMonthSlides.map((slide) => {
      if (!slide.selected && !slide.isNextMonth) return slide;

      return { ...slide, selected: false, isNextMonth: false };
    });

    if (slideIndex >= 0) {
      newMonthSlides[slideIndex] = {
        ...newMonthSlides[slideIndex],
        selected: true,
        isNextMonth: false,
      };
      newMonthSlides[slideIndex + 1] = {
        ...newMonthSlides[slideIndex + 1],
        selected: false,
        isNextMonth: true,
      };
    }

    this.setMonthSlides(newMonthSlides);
  }
}
