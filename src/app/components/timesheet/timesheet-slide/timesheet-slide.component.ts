import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DateSlide, Profile, TimesheetMetricsDto } from 'src/app/models';
import { ProfileService, TimesheetService } from 'src/app/services';
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
  profile$!: Observable<Profile | null>;

  @Output() selectedSlide = new EventEmitter<DateSlide>();

  @Input()
  get slide(): DateSlide {
    return this._slide;
  }
  set slide(value: DateSlide) {
    this._slide = value;
    this.metrics$ = this.service.metricsByDate$(value.date);
    // TODO pipe to not be nullable?
    this.profile$ = this.profileService.byDate$(value.date);
  }

  constructor(private service: TimesheetService, private profileService: ProfileService) {}

  Icons = Icons;

  onSlideClick(slide: DateSlide): void {
    this.selectedSlide.emit(slide);
  }

  getTotalHoursClasses(metrics: TimesheetMetricsDto, profile: Profile | null) {
    return {
      completed: (profile?.timeTarget ?? 0) < (metrics.workedHours ?? 0),
      failed: (profile?.timeTarget ?? 0) >= (metrics.workedHours ?? 0),
    };
  }

  getTasksClasses(metrics: TimesheetMetricsDto, profile: Profile | null) {
    return {
      completed: (profile?.tasksTarget ?? 0) < (metrics.totalTasks ?? 0),
      failed: (profile?.tasksTarget ?? 0) >= (metrics.totalTasks ?? 0),
    };
  }
}
