import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { DateSlide } from 'src/app/models/types';
import { ElementIds, Icons } from 'src/app/utils';

@Component({
  selector: 'app-dates-carousel',
  templateUrl: './dates-carousel.component.html',
  styleUrls: ['./dates-carousel.component.scss'],
})
export class DatesCarouselComponent implements AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel?: CarouselComponent;

  @Output() selectedDate = new EventEmitter<string>();

  slideWidth = 160;

  customOptions: OwlOptions = {
    dots: true,
    items: this.calculateItemsFor24PxMargin(),
    nav: true,
  };

  // TODO method to generate date slides
  slides: DateSlide[] = [
    {
      id: `${ElementIds.DateCarouselSlide}1`,
      date: '2021-01-01',
      day: '01',
      dayOfWeek: 'Mon',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}2`,
      date: '2021-01-02',
      day: '02',
      dayOfWeek: 'Tue',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}3`,
      date: '2021-01-03',
      day: '03',
      dayOfWeek: 'Wed',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}4`,
      date: '2021-01-04',
      day: '04',
      dayOfWeek: 'Thu',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}5`,
      date: '2021-01-05',
      day: '05',
      dayOfWeek: 'Fri',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}6`,
      date: '2021-01-06',
      day: '06',
      dayOfWeek: 'Sat',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}7`,
      date: '2021-01-07',
      day: '07',
      dayOfWeek: 'Sun',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}8`,
      date: '2021-01-08',
      day: '08',
      dayOfWeek: 'Mon',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}9`,
      date: '2021-01-09',
      day: '09',
      dayOfWeek: 'Tue',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}10`,
      date: '2021-01-10',
      day: '10',
      dayOfWeek: 'Wed',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}11`,
      date: '2021-01-11',
      day: '11',
      dayOfWeek: 'Thu',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}12`,
      date: '2021-01-12',
      day: '12',
      dayOfWeek: 'Fri',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}13`,
      date: '2021-01-13',
      day: '13',
      dayOfWeek: 'Sat',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}14`,
      date: '2021-01-14',
      day: '14',
      dayOfWeek: 'Sun',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}15`,
      date: '2021-01-15',
      day: '15',
      dayOfWeek: 'Mon',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}16`,
      date: '2021-01-16',
      day: '16',
      dayOfWeek: 'Tue',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}17`,
      date: '2021-01-17',
      day: '17',
      dayOfWeek: 'Wed',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}18`,
      date: '2021-01-18',
      day: '18',
      dayOfWeek: 'Thu',
      selected: false,
    },
  ];

  Icons = Icons;

  get prevDisabled(): boolean {
    if (!this.carousel) return false;

    return this.carousel.navData.prev.disabled;
  }

  get nextDisabled(): boolean {
    if (!this.carousel) return false;

    return this.carousel.navData.next.disabled;
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  onSlideClick(slide: DateSlide): void {
    this.unselectSlides();
    slide.selected = true;

    this.selectedDate.emit(slide.date);
  }

  next(): void {
    this.carousel?.next();
  }

  prev(): void {
    this.carousel?.prev();
  }

  calculateItemsFor24PxMargin(): number {
    return Math.floor(window.innerWidth / (this.slideWidth * 1.25));
  }

  getItemId(index: number, item: DateSlide): string {
    return item?.id ?? index.toString();
  }

  private unselectSlides(): void {
    this.slides.forEach((slide) => (slide.selected = false));
  }
}
