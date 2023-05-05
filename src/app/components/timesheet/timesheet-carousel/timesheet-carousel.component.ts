import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CarouselComponent, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { DateSlide, MonthSlide } from 'src/app/models';
import { ElementIds, Icons } from 'src/app/util';

@Component({
  selector: 'app-timesheet-carousel [slides]',
  templateUrl: './timesheet-carousel.component.html',
  styleUrls: ['./timesheet-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetCarouselComponent implements OnChanges, AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel?: CarouselComponent;
  @ViewChild('carouselHeader', { static: false }) carouselHeader?: CarouselComponent;

  @Input() slides!: DateSlide[];

  @Output() selectedDate = new EventEmitter<string>();

  monthSlides: MonthSlide[] = [];

  slideWidth = 160;

  carouselOptions: OwlOptions = {
    dots: false,
    items: this.calculateDateItemsFor24PxMargin(),
    nav: true,
    navSpeed: 300,
  };

  // TODO enable carousel month clicking
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

  constructor(private cdRef: ChangeDetectorRef) {}

  checkRender(): boolean {
    console.log('checkRender');
    return true;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.warn('changes in carousel!');
    console.warn(changes);
    if (changes['slides']) {
      this.onSlideChanges();
    }
  }

  ngAfterViewInit(): void {
    this.moveToSelected();
    console.log('afterViewInit');
    // TODO clean
    // this.cdRef.detectChanges();
  }

  onSlideClick(slide: DateSlide): void {
    if (slide.selected) return;

    // this.unselectSlides();
    // slide = { ...slide, selected: true };
    this.selectSlide(slide.id);

    this.selectedDate.emit(slide.date);
  }

  private onSlideChanges(): void {
    this.monthSlides = this.getUniqueMonthsFromSlides();
    this.carouselHeaderOptions.items = this.calculateMonthItems();
  }

  next(): void {
    this.carousel?.next();
  }

  prev(): void {
    this.carousel?.prev();
  }

  goToToday(): void {
    const todaySlide = this.slides.find((slide) => slide.isToday);

    if (!todaySlide) return;
    this.carousel?.to(todaySlide.id);
  }

  handleChange(event: SlidesOutputData): void {
    const startPosition = event?.startPosition ?? -1;
    if (!(startPosition > 0)) return;

    const startSlide = this.slides[startPosition];
    const monthSlideId = this.getMonthSlideId(startSlide.month, startSlide.year);
    this.moveToMonthById(this.carouselHeader, monthSlideId);
  }

  private calculateDateItemsFor24PxMargin(): number {
    // TODO fix (bugs on startup if resolution is low)
    return Math.floor(window.innerWidth / (this.slideWidth * 1.25));
  }

  private calculateMonthItems(): number {
    return Math.min(3, this.monthSlides.length);
  }

  getItemId<T extends { id: string }>(index: number, item: T): string {
    return item?.id ?? index.toString();
  }

  moveToSelected(): void {
    const selectedSlide = this.slides.find((slide) => slide.selected);

    if (!selectedSlide) return;

    this.carousel?.to(selectedSlide.id);
  }

  moveToMonthById(carousel: CarouselComponent | undefined, id: string | undefined): void {
    if (!id) return;

    // const targetIndex = this.monthSlides.find((slide) => slide.id === id);

    // if (!targetIndex) return;
    // this.unselectedMonthSlides(id);
    this.selectMonthSlide(id);
    // this.monthSlides target.selected = true;
    carousel?.to(id);
  }

  // isNextMonthSlide(index: number): boolean {
  //   if (!index || index >= this.monthSlides.length) return false;

  //   return !!this.monthSlides[index - 1].selected;
  // }
  private isNextMonthSlide(index: number, monthSlides: MonthSlide[]): boolean {
    if (!index || index >= monthSlides.length) return false;

    return !!monthSlides[index - 1].selected;
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

  // private selectSlide(id: string): void {
  //   const index = this.slides.findIndex((slide) => slide.id === id);

  //   if (index < 0) return;

  //   this.slides[index] = { ...this.slides[index], selected: true };
  // }

  // private selectMonthSlide(id: string): void {
  //   const index = this.monthSlides.findIndex((slide) => slide.id === id);

  //   this.monthSlides[index] = { ...this.monthSlides[index], selected: true };
  // }

  private selectSlide(id: string): void {
    const index = this.slides.findIndex((slide) => slide.id === id);

    if (index < 0) return;

    this.slides = this.slides.map((slide) => {
      // if (slide.selected) return { ...slide, selected: false };
      // return slide;
      if (slide.id === id) return { ...slide, selected: true };
      if (slide.selected) return { ...slide, selected: false };
      return slide;
    });
    // Unselect all slides with immutability
    // this.slides = this.slides.map((slide) => ({ ...slide, selected: false }));
  }

  private selectMonthSlide(id: string): void {
    const slide = this.monthSlides.find((slide) => slide.id === id);

    if (slide?.selected) return;

    this.monthSlides = this.monthSlides.map((slide, i, curr) => {
      if (slide.id === id) return { ...slide, selected: true, isNextMonth: false };
      const isNextMonth = this.isNextMonthSlide(i, curr);
      if (slide.selected) return { ...slide, selected: false, isNextMonth };
      if (slide.isNextMonth !== slide.isNextMonth) return { ...slide, isNextMonth };
      return slide;
    });
    // this.monthSlides.forEach((slide) => (slide.selected = false));
  }
}
