import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { AsNonNullable } from 'src/app/models';
import { STORE_SERVICE, StoreService } from 'src/app/services/interfaces';
import { DateUtil, FormUtil, PubSubUtil, StoreKeys, paths } from 'src/app/util';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { TitleComponent } from '../../../shared/components/title/title.component';

import { SlideComponent } from 'src/app/shared/components/inputs/slide/slide.component';
import { DateRangePickerComponent } from 'src/app/shared/components/inputs/date-range-picker';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { TimesheetCarouselComponent } from '../components/timesheet-carousel/timesheet-carousel.component';
import {
  DateRangeForm,
  DateRangeValue,
} from 'src/app/shared/components/inputs/date-range-picker/date-range-form-group';
import { AppService } from 'src/app/services';
import { ProfileService } from '../../profile/services/profile.service';
import { TimesheetService } from '../services/timesheet.service';
import { TimesheetListComponent } from '../components/timesheet-list/timesheet-list.component';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageLayoutComponent,
    TitleComponent,
    FormLayoutComponent,
    ReactiveFormsModule,
    SlideComponent,
    DateRangePickerComponent,
    NgIf,
    NgClass,
    TimesheetCarouselComponent,
    TimesheetListComponent,
    RouterOutlet,
  ],
})
export class TimesheetsComponent implements OnInit {
  paths = paths;

  filterForm!: FormGroup<{
    range: FormGroup<DateRangeForm>;
    showList: FormControl<boolean>;
    showCalendar: FormControl<boolean>;
  }>;

  today = new Date();
  twoMonthsAgo = DateUtil.addMonths(this.today, -2);
  twoMonthsFromNow = DateUtil.addMonths(this.today, 2);

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

  private initSubs(): void {
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
