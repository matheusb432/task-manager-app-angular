import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DateSlide } from 'src/app/models';
import { TimesheetCarouselService, TimesheetService } from 'src/app/services';
import { paths } from 'src/app/util';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetsComponent implements OnInit {
  slides$: Observable<DateSlide[]>;
  paths = paths;

  constructor(
    private service: TimesheetService,
    private carouselService: TimesheetCarouselService
  ) {
    this.slides$ = this.carouselService.getSlides();
  }

  ngOnInit(): void {
    this.service.loadListData();
  }

  onSelectDate(date: Date): void {
    this.service.goToCreateOrDetailsBasedOnDate(date);
  }
}
