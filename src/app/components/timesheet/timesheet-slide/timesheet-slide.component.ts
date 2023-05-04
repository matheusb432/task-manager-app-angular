import { DateSlide } from 'src/app/models/types';
import { Icons } from './../../../utils/icons.enum';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timesheet-slide [slide]',
  templateUrl: './timesheet-slide.component.html',
  styleUrls: ['./timesheet-slide.component.scss'],
})
export class TimesheetSlideComponent {
  @Input() slide!: DateSlide;

  @Output() selectedSlide = new EventEmitter<DateSlide>();

  Icons = Icons;

  onSlideClick(slide: DateSlide): void {
    this.selectedSlide.emit(slide);
  }
}
