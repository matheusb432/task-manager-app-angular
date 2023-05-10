import { DateSlide, TimesheetMetricsDto } from 'src/app/models';
import { Icons } from 'src/app/util';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timesheet-slide [slide]',
  templateUrl: './timesheet-slide.component.html',
  styleUrls: ['./timesheet-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetSlideComponent {
  @Input() slide!: DateSlide;

  @Output() selectedSlide = new EventEmitter<DateSlide>();

  get metrics(): TimesheetMetricsDto | undefined {
    return this.slide.metrics;
  }

  Icons = Icons;

  onSlideClick(slide: DateSlide): void {
    this.selectedSlide.emit(slide);
  }
}
