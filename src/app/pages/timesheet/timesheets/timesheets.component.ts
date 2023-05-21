import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs';
import { DateRangeForm, DateRangeValue } from 'src/app/components/custom/inputs';
import { AsNonNullable } from 'src/app/models';
import { AppService, ProfileService, TimesheetService } from 'src/app/services';
import { STORE_SERVICE, StoreService } from 'src/app/services/interfaces';
import { DateUtil, FormUtil, PubSubUtil, StoreKeys, paths } from 'src/app/util';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetsComponent implements OnInit {
  paths = paths;

  filterForm!: FormGroup<{
    range: FormGroup<DateRangeForm>;
    showList: FormControl<boolean>;
    showCalendar: FormControl<boolean>;
  }>;

  today = new Date();
  threeMonthsAgo = DateUtil.addMonths(this.today, -3);
  tomorrow = DateUtil.addDays(this.today, 1);

  get range() {
    return this.filterForm.controls.range;
  }

  get showList() {
    return this.filterForm.controls.showList;
  }

  get showCalendar() {
    return this.filterForm.controls.showCalendar;
  }

  enableListAnimation = true;
  enableCalendarAnimation = true;

  constructor(
    private service: TimesheetService,
    private app: AppService,
    @Inject(STORE_SERVICE) private store: StoreService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.profileService.loadListItems();
    this.service.loadListData();
    this.initSubs();
  }

  initSubs(): void {
    this.range.valueChanges
      .pipe(
        PubSubUtil.ignoreIrrelevantDateRangeChanges(),
        tap((value) => this.app.setDateRange(value as AsNonNullable<DateRangeValue>))
      )
      .subscribe();
  }

  initFilterForm(): void {
    const { start, end } = this.app.getDateRangeOrDefault();

    const { timesheetShowCalendar, timesheetShowList } = this.store.getMany<boolean>([
      { key: StoreKeys.TimesheetShowList, type: 'boolean' },
      { key: StoreKeys.TimesheetShowCalendar, type: 'boolean' },
    ]);

    this.enableListAnimation = timesheetShowList ?? true;
    this.enableCalendarAnimation = timesheetShowCalendar ?? true;

    this.filterForm = new FormGroup({
      range: FormUtil.buildDateRangeGroup(start, end),
      showList: new FormControl(this.enableListAnimation, { nonNullable: true }),
      showCalendar: new FormControl(this.enableCalendarAnimation, { nonNullable: true }),
    });
  }

  onSelectDate(date: Date): void {
    this.service.goToCreateOrDetailsBasedOnDate(date);
  }

  onShowListChanged(value: boolean): void {
    this.enableListAnimation = true;
    this.store.store({
      key: StoreKeys.TimesheetShowList,
      value,
    });
  }

  onShowCalendarChanged(value: boolean): void {
    this.enableCalendarAnimation = true;
    this.store.store({
      key: StoreKeys.TimesheetShowCalendar,
      value,
    });
  }
}
