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
  TimesheetMetricsStore,
  TimesheetMetricsDto,
  TimesheetMetrics,
} from '../models';
import {
  DateUtil,
  DetailsTypes,
  FormUtil,
  PubSubUtil,
  QueryUtil,
  StringUtil,
  TimesheetUtil,
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
  private _metricsStore$ = new BehaviorSubject<TimesheetMetricsStore>({
    byDate: {},
    dates: [],
  });
  private destroyed$ = new Subject<boolean>();

  override get listItems$() {
    return this._listItems$.asObservable();
  }

  get metricsStore$() {
    return this._metricsStore$.asObservable();
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
    this.metricsStore$
      .pipe(
        takeUntil(this.destroyed$),
        tap((metricsStore) => {
          this.setTimesheetsMetrics(metricsStore);
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

  private setTimesheetsMetrics(metricsStore: TimesheetMetricsStore): void {
    const newItems = this._listItems$.getValue().map((item): Timesheet => {
      const date = item?.date;
      if (!date) return item;

      return {
        ...item,
        metrics: TimesheetUtil.mapMetricsToDto(metricsStore.byDate[date]),
      };
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
   * @description Normalizing the metrics list state shape to a data table with date keys
   */
  private setMetricsList(metricsList: TimesheetMetricsDto[]): void {
    const metricsStore: TimesheetMetricsStore = { byDate: {}, dates: [] };

    metricsList
      .filter((metrics): metrics is Required<TimesheetMetricsDto> => metrics?.date != null)
      .forEach((metrics) => {
        const date = DateUtil.dateTimeStringToDateString(metrics.date);

        if (!date) return;

        metricsStore.byDate[date] = TimesheetUtil.mapMetrics(metrics);
        metricsStore.dates.push(date);
      });

    this._metricsStore$.next(metricsStore);
  }

  override setListItems(items: Timesheet[]): void {
    const metricsStore = this._metricsStore$.getValue();
    const newItems = items
      .filter((item) => item?.date != null)
      .map((timesheet) => {
        const { date } = timesheet as Required<Timesheet>;
        const dateString = DateUtil.dateTimeStringToDateString(date);
        return {
          ...timesheet,
          date: dateString,
          metrics: TimesheetUtil.mapMetricsToDto(metricsStore.byDate[dateString]),
        };
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
  metricsByDate$(date: string): Observable<TimesheetMetrics> {
    return this.metricsStore$.pipe(
      map((store) => store.byDate[date]),
      filter((metrics): metrics is TimesheetMetrics => metrics != null)
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
