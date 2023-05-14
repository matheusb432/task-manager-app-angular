import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TimesheetService } from 'src/app/services';
import { DateUtil, FormUtil, PubSubUtil, paths } from 'src/app/util';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetsComponent implements OnInit {
  paths = paths;

  filterForm = new FormGroup({
    range: FormUtil.buildDateRangeGroup(),
  });

  today = new Date();
  threeMonthsAgo = DateUtil.addMonths(this.today, -3);
  tomorrow = DateUtil.addDays(this.today, 1);

  get range() {
    return this.filterForm.controls.range;
  }

  constructor(private service: TimesheetService) {}

  ngOnInit(): void {
    this.service.loadListData();
    this.initSubs();
  }

  initSubs(): void {
    this.range.valueChanges
      .pipe(PubSubUtil.ignoreIrrelevantDateRangeChanges())
      .subscribe((value) => {
        // TODO pass data to service
        console.warn(value);
      });
  }

  onSelectDate(date: Date): void {
    this.service.goToCreateOrDetailsBasedOnDate(date);
  }
}
