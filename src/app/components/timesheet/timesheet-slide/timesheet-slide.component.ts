import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DateSlide, TimesheetMetricsDto } from 'src/app/models';
import { TimesheetService } from 'src/app/services';
import { Icons } from 'src/app/util';

@Component({
  selector: 'app-timesheet-slide [slide]',
  templateUrl: './timesheet-slide.component.html',
  styleUrls: ['./timesheet-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetSlideComponent {
  private _slide!: DateSlide;
  metrics$!: Observable<TimesheetMetricsDto | undefined>;

  @Output() selectedSlide = new EventEmitter<DateSlide>();

  @Input()
  get slide(): DateSlide {
    return this._slide;
  }
  set slide(value: DateSlide) {
    this._slide = value;
    this.metrics$ = this.service.metricsByDate$(value.date);
  }

  constructor(private service: TimesheetService) {}

  Icons = Icons;

  onSlideClick(slide: DateSlide): void {
    this.selectedSlide.emit(slide);
  }
}
