import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DateSlide } from 'src/app/models/types';
import { ElementIds, Icons } from 'src/app/utils';

@Component({
  selector: 'app-dates-carousel',
  templateUrl: './dates-carousel.component.html',
  styleUrls: ['./dates-carousel.component.scss'],
})
export class DatesCarouselComponent {
  slideWidth = 160;

  customOptions: OwlOptions = {
    pullDrag: false,
    // TODO test with dots
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
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
      id: `${ElementIds.DateCarouselSlide}1`,
      date: '2021-01-10',
      day: '10',
      dayOfWeek: 'Wed',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}4`,
      date: '2021-01-11',
      day: '11',
      dayOfWeek: 'Thu',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}5`,
      date: '2021-01-12',
      day: '12',
      dayOfWeek: 'Fri',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}6`,
      date: '2021-01-13',
      day: '13',
      dayOfWeek: 'Sat',
      selected: false,
    },
    {
      id: `${ElementIds.DateCarouselSlide}7`,
      date: '2021-01-14',
      day: '14',
      dayOfWeek: 'Sun',
      selected: false,
    },
  ];

  Icons = Icons;

  test(slide: unknown): void {
    console.log(slide);
  }

  calculateItemsFor24PxMargin(): number {
    return Math.floor(window.innerWidth / (this.slideWidth * 1.25));
  }
}
