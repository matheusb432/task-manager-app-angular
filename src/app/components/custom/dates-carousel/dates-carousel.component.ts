import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CarouselComponent, OwlOptions, SlideModel, SlidesOutputData } from 'ngx-owl-carousel-o';
import { DateSlide, MonthSlide } from 'src/app/models/types';
import { ElementIds, Icons } from 'src/app/utils';

@Component({
  selector: 'app-dates-carousel [slides]',
  templateUrl: './dates-carousel.component.html',
  styleUrls: ['./dates-carousel.component.scss'],
})
export class DatesCarouselComponent implements OnChanges, AfterViewInit {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['slides']) this.onSlideChanges();
  }

  ngAfterViewInit(): void {
    this.moveToSelected();
    this.cdRef.detectChanges();
  }

  onSlideClick(slide: DateSlide): void {
    this.unselectSlides();
    slide.selected = true;

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

    const target = this.monthSlides.find((slide) => slide.id === id);

    if (!target) return;

    this.unselectedMonthSlides();
    target.selected = true;
    carousel?.to(id);
  }

  isNextMonthSlide(index: number): boolean {
    if (!index || index >= this.monthSlides.length) return false;

    return !!this.monthSlides[index - 1].selected;
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
    return { id: this.getMonthSlideId(month, year), month, year };
  }

  private getMonthSlideId(month: string, year: number): string {
    return `${ElementIds.MonthCarouselSlide}${month}${year}`;
  }

  private unselectSlides(): void {
    this.slides.forEach((slide) => (slide.selected = false));
  }

  private unselectedMonthSlides(): void {
    this.monthSlides.forEach((slide) => (slide.selected = false));
  }
}
