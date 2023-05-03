import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { DateSlide } from 'src/app/models/types';
import { Icons } from 'src/app/utils';

@Component({
  selector: 'app-dates-carousel [slides]',
  templateUrl: './dates-carousel.component.html',
  styleUrls: ['./dates-carousel.component.scss'],
})
export class DatesCarouselComponent implements AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel?: CarouselComponent;

  @Input() slides!: DateSlide[];

  @Output() selectedDate = new EventEmitter<string>();

  slideWidth = 160;

  customOptions: OwlOptions = {
    dots: true,
    items: this.calculateItemsFor24PxMargin(),
    nav: true,
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

  ngAfterViewInit(): void {
    this.moveToSelected();
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

  moveToSelected(): void {
    const selectedSlide = this.slides.find((slide) => slide.selected);

    if (!selectedSlide) return;

    this.carousel?.to(selectedSlide.id);
  }
}
