import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TimesheetService } from 'src/app/services';
import { paths } from 'src/app/util';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetsComponent implements OnInit {
  paths = paths;

  constructor(private service: TimesheetService) {}

  ngOnInit(): void {
    this.service.loadListData();
  }

  onSelectDate(date: Date): void {
    this.service.goToCreateOrDetailsBasedOnDate(date);
  }
}
