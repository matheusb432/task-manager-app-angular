import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, map, takeUntil, tap } from 'rxjs';
import { DateRangeValue } from '../components/custom/inputs';
import {
  TimesheetFormGroup,
  getTaskItemFormGroup,
  getTimesheetForm,
  getTimesheetNoteFormGroup,
} from '../components/timesheet/timesheet-form';
import {
  AsNonNullable,
  PaginationOptions,
  Timesheet,
  TimesheetMetricsDictionary,
  TimesheetMetricsDto,
} from '../models';
import {
  DateUtil,
  DetailsTypes,
  FormUtil,
  PubSubUtil,
  QueryUtil,
  StringUtil,
  paths,
} from '../util';
import { TimesheetApiService } from './api';
import { FormService } from './base/form.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService extends FormService<Timesheet> implements OnDestroy {
  readonly defaultRange = {
    start: DateUtil.addMonths(new Date(), -1),
    end: DateUtil.addMonths(new Date(), 1),
  };

  private _metricsDict$ = new BehaviorSubject<TimesheetMetricsDictionary>({ byDate: {} });
  private _activeDateString$ = new BehaviorSubject<string>(
    DateUtil.formatDateToUniversalFormat(new Date())
  );
  private _dateRange$ = new BehaviorSubject<AsNonNullable<DateRangeValue> | null>(null);

  private destroyed$ = new Subject<boolean>();

  get activeDateString$() {
    return this._activeDateString$.asObservable().pipe(map(DateUtil.dateTimeStringToDateString));
  }

  get metricsDict$() {
    return this._metricsDict$.asObservable();
  }

  get dateRange$() {
    return this._dateRange$.asObservable();
  }

  constructor(
    protected override api: TimesheetApiService,
    protected override ts: ToastService,
    private router: Router
  ) {
    super(ts, api);
    this.setToastMessages();

    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  initSubs(): void {
    this.item$
      .pipe(
        takeUntil(this.destroyed$),
        tap((item) => {
          const itemDate = item?.date;

          if (!itemDate) return;

          this.setActiveDate(itemDate);
        })
      )
      .subscribe();
    this.dateRange$
      .pipe(
        takeUntil(this.destroyed$),
        tap((dateRange) => {
          if (dateRange == null) return;

          const { start, end } = dateRange;

          this.loadMetricsByRange(start, end);
          this.loadListItems(
            PaginationOptions.fromOptions({
              filter: {
                ...QueryUtil.getDateRangeFilter('date', start, end),
              },
            })
          );
        })
      )
      .subscribe();
  }

  // TODO search by logged user id also
  async loadItemByDate(date: Date): Promise<Timesheet> {
    const item = this._item$.getValue();
    const itemDate = item?.date;

    if (!!itemDate && DateUtil.dateStringToDate(itemDate) === date) {
      return item;
    }

    const res = await this.api.getByDate(date);

    this._item$.next(res);

    return res;
  }

  async loadMetricsByRange(from: Date, to: Date): Promise<void> {
    const metricsList = await this.getMetricsByRange(from, to);

    this.setMetricsList(metricsList);
  }

  private getMetricsByRange = async (
    from: Date,
    to: Date
  ): Promise<TimesheetMetricsDto[]> | never => {
    const metrics = await this.api
      .getMetricsQuery({
        filter: {
          ...QueryUtil.getDateRangeFilter('date', from, to),
        },
      })
      .catch((err) => {
        this.ts.error('Error loading timesheet metrics!');
        throw err;
      });

    return metrics;
  };

  getActiveDate(): Date {
    const activeDateString = this._activeDateString$.getValue();

    return DateUtil.dateStringToDate(activeDateString);
  }

  /**
   * @description Normalizing the metrics list state shape to a dictionary with date keys
   */
  private setMetricsList(metricsList: TimesheetMetricsDto[]): void {
    const metricsDict: TimesheetMetricsDictionary = { byDate: {} };

    metricsList.forEach((metrics) => {
      const date = DateUtil.dateTimeStringToDateString(metrics.date);

      if (!date) return;

      metricsDict.byDate[date] = metrics;
    });
    console.warn(metricsDict);

    this._metricsDict$.next(metricsDict);
  }

  setActiveDate = (value: Date | string): void => {
    this._activeDateString$.next(
      typeof value === 'string' ? value : DateUtil.formatDateTimeToUniversalFormat(value)
    );
  };

  goToCreateOrDetailsBasedOnDate = async (date: Date): Promise<boolean> => {
    const existingItem = await this.api.getQuery({ filter: { date: date } });

    const item = existingItem?.[0];

    if (item?.id == null) return this.goToCreate(date);

    this._item$.next(item);

    return this.goToDetails(item.id, DetailsTypes.Edit);
  };

  loadListData = async (): Promise<void> => {
    this.setDateRange(this.defaultRange);
  };

  loadEditData = async (id: string | null | undefined): Promise<Timesheet | null> => {
    return this.loadItem(id);
  };

  convertToForm(item: Timesheet): TimesheetFormGroup {
    const newFg = TimesheetFormGroup.from(getTimesheetForm(new Date()));

    FormUtil.setFormFromItem(newFg, {
      ...item,
      date: new Date(item.date ?? ''),
      notes: [],
      tasks: [],
    });

    if (item?.notes) {
      newFg.controls.notes = FormUtil.buildFormArray(item.notes, getTimesheetNoteFormGroup);
    }
    if (item?.tasks) {
      newFg.controls.tasks = FormUtil.buildFormArray(
        item.tasks.map((x) => ({
          ...x,
          time: StringUtil.numberToTime(x.time as unknown as number),
        })),
        getTaskItemFormGroup
      );
    }

    return newFg;
  }

  getDateRange() {
    return this._dateRange$.getValue();
  }

  setDateRange(value: AsNonNullable<DateRangeValue>): void {
    this._dateRange$.next(value);
  }

  toJson(fg: TimesheetFormGroup): Partial<Timesheet> {
    return TimesheetFormGroup.toJson(fg);
  }

  private setToastMessages(): void {
    this.toastMessages = {
      ...this.toastMessages,
      noItem: "Couldn't fetch timesheet!",
      createSuccess: 'Timesheet created successfully!',
      updateSuccess: 'Timesheet updated successfully!',
      updateIdError: "Couldn't update timesheet, couldn't fetch ID!",
      deleteSuccess: 'Timesheet deleted successfully!',
      duplicateSuccess: 'Timesheet duplicated successfully!',
    };
  }
  /**
   * @description Builds an observable stream from a given date in 'yyyy-MM-dd' format
   */
  metricsByDate$(date: string) {
    return this.metricsDict$.pipe(map((m) => m.byDate[date]));
  }

  goToList = () => this.router.navigateByUrl(paths.timesheets);
  goToCreate = (date?: Date) =>
    this.router.navigate([paths.timesheetsCreate], {
      queryParams: { date: DateUtil.formatDateToUniversalFormat(date ?? new Date()) },
    });
  goToDetails = async (id: number, type: DetailsTypes) =>
    this.router.navigate([paths.timesheetsDetails], { queryParams: { id, type } });
}
