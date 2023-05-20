import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DateSlide, Profile, TimesheetMetrics } from 'src/app/models';
import { TimePipe } from 'src/app/pipes';
import { ProfileService, TimesheetService } from 'src/app/services';
import { Icons, StringUtil } from 'src/app/util';
import { IconComponent } from '../../custom/icon/icon.component';
import { TimesheetSlideSpanComponent } from '../timesheet-slide-span/timesheet-slide-span.component';
import { ButtonComponent } from '../../custom/buttons/button/button.component';

@Component({
  selector: 'app-timesheet-slide [slide]',
  templateUrl: './timesheet-slide.component.html',
  styleUrls: ['./timesheet-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, IconComponent, TimesheetSlideSpanComponent, ButtonComponent, TimePipe],
})
export class TimesheetSlideComponent {
  private _slide!: DateSlide;
  metrics$!: Observable<TimesheetMetrics>;
  profile$!: Observable<Profile | null>;

  @Output() selectedSlide = new EventEmitter<DateSlide>();

  @Input()
  get slide(): DateSlide {
    return this._slide;
  }
  set slide(value: DateSlide) {
    this._slide = value;
    this.metrics$ = this.service.metricsByDate$(value.date);
    this.profile$ = this.profileService.byDate$(value.date);
  }

  constructor(private service: TimesheetService, private profileService: ProfileService) {}

  Icons = Icons;

  onSlideClick(slide: DateSlide): void {
    this.selectedSlide.emit(slide);
  }

  getTotalHoursClasses(metrics: TimesheetMetrics, profile: Profile | null) {
    if (profile == null) return {};
    const timeTarget = StringUtil.timeToNumber(profile.timeTarget);
    const workedHours = metrics.workedHours ?? 0;
    const success = timeTarget < workedHours;

    return {
      success,
      fail: !success,
    };
  }

  getTasksClasses(metrics: TimesheetMetrics, profile: Profile | null) {
    if (profile == null) return {};
    const tasksTarget = profile.tasksTarget ?? 0;
    const totalTasks = metrics.totalTasks ?? 0;
    const success = tasksTarget < totalTasks;

    return {
      success,
      fail: !success,
    };
  }
}
