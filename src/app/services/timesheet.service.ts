import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  TimesheetFormGroup,
  getTaskItemFormGroup,
  getTimesheetForm,
  getTimesheetNoteFormGroup,
} from '../components/timesheet/timesheet-form';
import {
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
import { AppService } from './app.service';
import { FormService } from './base/form.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService extends FormService<Timesheet> implements OnDestroy {
  private _metricsDict$ = new BehaviorSubject<TimesheetMetricsDictionary>({
    byDate: {},
    dates: [],
  });
  private destroyed$ = new Subject<boolean>();

  override get listItems$() {
    return this._listItems$.asObservable();
  }

  get metricsDict$() {
    return this._metricsDict$.asObservable();
  }

  constructor(
    protected override api: TimesheetApiService,
    protected override ts: ToastService,
    private app: AppService,

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

          this.app.setActiveDate(itemDate);
        })
      )
      .subscribe();
    this.app.dateRange$
      .pipe(
        takeUntil(this.destroyed$),
        tap((dateRange) => {
          if (dateRange == null) return;

          const { start, end } = dateRange;

          this.loadMetricsByRange(start, end);
          this.loadListItemsByRange(start, end);
        })
      )
      .subscribe();
    this.metricsDict$
      .pipe(
        takeUntil(this.destroyed$),
        tap((metricsDict) => {
          this.setTimesheetsMetrics(metricsDict);
        })
      )
      .subscribe();
  }

  async loadListItemsByRange(from: Date, to: Date): Promise<void> {
    const options = PaginationOptions.fromOptions({
      filter: {
        ...QueryUtil.getDateRangeFilter('date', from, to),
      },
    });
    this.loadListItems(options);
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

  private setTimesheetsMetrics(metricsDict: TimesheetMetricsDictionary): void {
    const newItems = this._listItems$.getValue().map((item) => {
      const date = item?.date;
      if (!date) return item;

      return { ...item, metrics: metricsDict.byDate[date] };
    });

    this._listItems$.next(newItems);
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

  /**
   * @description Normalizing the metrics list state shape to a dictionary with date keys
   */
  private setMetricsList(metricsList: TimesheetMetricsDto[]): void {
    const metricsDict: TimesheetMetricsDictionary = { byDate: {}, dates: [] };

    metricsList.forEach((metrics) => {
      const date = DateUtil.dateTimeStringToDateString(metrics.date);

      if (!date) return;

      metricsDict.byDate[date] = metrics;
      metricsDict.dates.push(date);
    });

    this._metricsDict$.next(metricsDict);
  }

  override setListItems(items: Timesheet[]): void {
    const metricsDict = this._metricsDict$.getValue();
    const newItems = items
      .filter((item) => item?.date != null)
      .map((timesheet) => {
        const { date } = timesheet as Required<Timesheet>;
        const dateString = DateUtil.dateTimeStringToDateString(date);
        return { ...timesheet, date: dateString, metrics: metricsDict.byDate[dateString] };
      });

    this._listItems$.next(newItems);
  }

  goToCreateOrDetailsBasedOnDate = async (date: Date): Promise<boolean> => {
    const existingItem = await this.api.getQuery({ filter: { date: date } });

    const item = existingItem?.[0];

    if (item?.id == null) return this.goToCreate(date);

    this._item$.next(item);

    return this.goToDetails(item.id, DetailsTypes.Edit);
  };

  loadListData = async (): Promise<void> => {
    this.app.initDateRange();
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
  metricsByDate$(date: string): Observable<TimesheetMetricsDto> {
    return this.metricsDict$.pipe(
      filter((m) => m.byDate[date] != null),
      map((m) => m.byDate[date])
    );
  }

  goToList = () => this.router.navigateByUrl(paths.timesheets);
  goToCreate = (date?: Date) =>
    this.router.navigate([paths.timesheetsCreate], {
      queryParams: { date: DateUtil.formatDateToUniversalFormat(date ?? new Date()) },
    });
  goToDetails = async (id: number, type: DetailsTypes) =>
    this.router.navigate([paths.timesheetsDetails], { queryParams: { id, type } });
}
