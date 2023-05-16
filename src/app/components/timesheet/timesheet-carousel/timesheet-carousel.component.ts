import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CarouselComponent, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { Observable, takeUntil, tap } from 'rxjs';
import { DateSlide, MonthSlide, WithDestroyed } from 'src/app/models';
import { TimesheetCarouselService } from 'src/app/services';
import { DateUtil, ElementIds, Icons } from 'src/app/util';

@Component({
  selector: 'app-timesheet-carousel',
  templateUrl: './timesheet-carousel.component.html',
  styleUrls: ['./timesheet-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetCarouselComponent extends WithDestroyed implements OnInit {
  @ViewChild('carousel', { static: false }) carousel?: CarouselComponent;
  @ViewChild('carouselHeader', { static: false }) carouselHeader?: CarouselComponent;

  @Output() selectedDate = new EventEmitter<Date>();

  slides$: Observable<DateSlide[]>;
  slides: DateSlide[] = [];

  private _monthSlides: MonthSlide[] = [];
  public get monthSlides(): MonthSlide[] {
    return this._monthSlides;
  }
  public set monthSlides(value: MonthSlide[]) {
    this._monthSlides = value;
  }

  slideWidth = 160;

  carouselOptions: OwlOptions = {
    dots: false,
    items: this.calculateDateItemsFor24PxMargin(),
    nav: true,
    lazyLoad: true,
    lazyLoadEager: 10,
    navSpeed: 300,
  };

  carouselHeaderOptions: OwlOptions = {
    dots: false,
    nav: false,
    pullDrag: false,
    mouseDrag: false,
    touchDrag: false,
    freeDrag: false,
    navSpeed: 300,
    center: true,
    items: this.calculateMonthItems(),
  };

  Icons = Icons;

  get prevDisabled(): boolean {
    if (!this.carousel?.navData?.prev) return true;

    return this.carousel.navData.prev.disabled;
  }

  get nextDisabled(): boolean {
    if (!this.carousel?.navData?.next) return true;

    return this.carousel.navData.next.disabled;
  }

  constructor(private carouselService: TimesheetCarouselService, private cdRef: ChangeDetectorRef) {
    super();
    this.slides$ = this.carouselService.slides$;
  }

  ngOnInit() {
    this.slides$
      .pipe(
        takeUntil(this.destroyed$),
        tap((slides) => {
          this.slides = slides;
          this.onSlideChanges();
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }

  onSlideClick(slide: DateSlide): void {
    if (slide.selected) return;

    this.selectSlide(slide.id);

    this.selectedDate.emit(DateUtil.dateStringToDate(slide.date));
  }

  private onSlideChanges(): void {
    const selectedSlidePosition = this.slides.findIndex((slide) => slide.selected);
    let position = 0;
    if (selectedSlidePosition === -1) {
      const todayPosition = Math.floor(this.slides?.length / 2);
      position = todayPosition;

      this.carouselOptions = {
        ...this.carouselOptions,
        startPosition: this.getCenterPosition(position),
      };
    } else {
      position = selectedSlidePosition;
    }

    this.moveToIndex(this.getCenterPosition(position));

    this.monthSlides = this.getUniqueMonthsFromSlides();
    this.carouselHeaderOptions = {
      ...this.carouselHeaderOptions,
      items: this.calculateMonthItems(),
    };
    this.setMonthStartPosition(position);
  }

  next(): void {
    this.carousel?.next();
  }

  prev(): void {
    this.carousel?.prev();
  }

  goToToday(): void {
    const todayIndex = this.slides.findIndex((slide) => slide.isToday);

    if (todayIndex === -1) return;

    this.moveToIndex(this.getCenterPosition(todayIndex));
  }

  handleChange(event: SlidesOutputData): void {
    const startPosition = event?.startPosition ?? -1;
    if (!(startPosition > 0)) return;

    const startSlide = this.slides[startPosition];
    const monthSlideId = this.getMonthSlideId(startSlide.month, startSlide.year);

    if (!monthSlideId) return;

    this.selectMonthSlide(monthSlideId);
    this.moveToMonthById(this.carouselHeader, monthSlideId);
  }

  private setMonthStartPosition(startPosition: number) {
    const startSlide = this.slides[startPosition];
    const monthSlideId = this.getMonthSlideId(startSlide.month, startSlide.year);
    if (!monthSlideId) return;

    this.selectMonthSlide(monthSlideId);
    this.carouselHeaderOptions.startPosition = this.getSelectedMonthIndex();
  }

  private getSelectedMonthIndex(): number {
    return this.monthSlides.findIndex((slide) => slide.selected);
  }

  private calculateDateItemsFor24PxMargin(): number {
    return Math.floor(window.innerWidth / (this.slideWidth * 1.25));
  }

  private calculateMonthItems(): number {
    return Math.min(3, this.monthSlides.length);
  }

  getItemId<T extends { id: string }>(index: number, item: T): string {
    return item.id;
  }

  moveToSelected(): void {
    const selectedSlide = this.slides.find((slide) => slide.selected);

    if (!selectedSlide) return;

    this.carousel?.to(selectedSlide.id);
  }

  moveToIndex(index: number): void {
    const slide = this.slides[index];

    if (!slide) return;

    this.carousel?.to(slide.id);
  }

  moveToSelectedMonth(): void {
    const selectedMonthSlide = this.monthSlides.find((slide) => slide.selected);

    if (!selectedMonthSlide) return;

    this.carouselHeader?.to(selectedMonthSlide.id);
  }

  moveToMonthById(carousel: CarouselComponent | undefined, id: string | undefined): void {
    if (!id) return;

    carousel?.to(id);
  }

  private getCenterPosition(position: number): number {
    return Math.ceil(Math.max(0, position - (this.carouselOptions.items ?? 0) / 2));
  }

  private getUniqueMonthsFromSlides(): MonthSlide[] {
    const monthSlides = this.slides
      .map(this.uniqueMonthFromSlideOrDefault.bind(this))
      .filter((slide) => slide != null) as MonthSlide[];

    return monthSlides;
  }

  private uniqueMonthFromSlideOrDefault(
    slide: DateSlide,
    index: number,
    current: DateSlide[]
  ): MonthSlide | undefined {
    if (index === 0) return this.buildMonthSlide(slide.month, slide.year);

    return current[index - 1].month === slide.month
      ? undefined
      : this.buildMonthSlide(slide.month, slide.year);
  }

  private buildMonthSlide(month: string, year: number): MonthSlide {
    return {
      id: this.getMonthSlideId(month, year),
      month,
      year,
      isNextMonth: false,
      selected: false,
    };
  }

  private getMonthSlideId(month: string, year: number): string {
    return `${ElementIds.MonthCarouselSlide}${month}${year}`;
  }

  private selectSlide(id: string): void {
    const index = this.slides.findIndex((slide) => slide.id === id);

    if (index < 0) return;

    const selectedSlideIndex = this.slides.findIndex((slide) => slide.selected);
    if (selectedSlideIndex >= 0) {
      this.slides[selectedSlideIndex] = {
        ...this.slides[selectedSlideIndex],
        selected: false,
      };
    }

    this.slides[index] = { ...this.slides[index], selected: true };
  }

  private selectMonthSlide(id: string): void {
    const slideIndex = this.monthSlides.findIndex((slide) => slide.id === id);

    if (slideIndex >= 0 && this.monthSlides[slideIndex].selected) return;

    this.monthSlides = this.monthSlides.map((slide) => {
      if (!slide.selected && !slide.isNextMonth) return slide;

      return { ...slide, selected: false, isNextMonth: false };
    });

    if (slideIndex >= 0) {
      this.monthSlides[slideIndex] = {
        ...this.monthSlides[slideIndex],
        selected: true,
        isNextMonth: false,
      };
      this.monthSlides[slideIndex + 1] = {
        ...this.monthSlides[slideIndex + 1],
        selected: false,
        isNextMonth: true,
      };
    }
  }
}
