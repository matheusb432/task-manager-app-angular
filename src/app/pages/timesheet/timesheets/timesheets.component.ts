import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DateSlide } from 'src/app/models';
import { DatesCarouselService, TimesheetService } from 'src/app/services';
import { paths } from 'src/app/util';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetsComponent implements OnInit {
  slides$: Observable<DateSlide[]> = of([]);
  paths = paths;

  constructor(
    private service: TimesheetService,
    private datesCarouselService: DatesCarouselService
  ) {}

  ngOnInit(): void {
    this.slides$ = this.datesCarouselService.getSlides();
    // TODO remove
    this.service.loadMetricsByRange(new Date(2022, 1, 1), new Date(2023, 11, 31));
  }

  onSelectDate(date: Date): void {
    this.service.goToCreateOrDetailsBasedOnDate(date);
  }
}
