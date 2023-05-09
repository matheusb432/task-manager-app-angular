import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  TimesheetFormGroup,
  getTaskItemFormGroup,
  getTimesheetForm,
  getTimesheetNoteFormGroup,
} from '../components/timesheet/timesheet-form';
import { ODataOperators } from '../helpers/odata';
import { PaginationOptions, Timesheet, TimesheetMetricsDto } from '../models';
import { DateUtil, DetailsTypes, StringUtil, paths } from '../util';
import { TimesheetApiService } from './api';
import { FormService } from './base/form.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService extends FormService<Timesheet> {
  private metrics$ = new BehaviorSubject<TimesheetMetricsDto[]>([]);

  constructor(
    protected override api: TimesheetApiService,
    protected override ts: ToastService,
    private router: Router
  ) {
    super(ts, api);
    this.setToastMessages();
  }

  loadMetricsByRange = async (from: Date, to: Date): Promise<void> => {
    const metrics = await this.api.getMetricsQuery({
      filter: {
        date: [
          [ODataOperators.GreaterThanOrEqualTo, from],
          [ODataOperators.LessThanOrEqualTo, to],
        ],
      },
    });

    this.metrics$.next(metrics);
  };

  goToCreateOrDetailsBasedOnDate = async (date: Date): Promise<boolean> => {
    const existingItem = await this.api.getQuery({ filter: { date: date } });

    const item = existingItem?.[0];

    if (item?.id == null) return this.goToCreate(date);

    this.item$.next(item);

    return this.goToDetails(item.id, DetailsTypes.Edit);
  };

  loadListData = async (): Promise<void> => {
    await this.loadListItems(PaginationOptions.default());
  };

  loadEditData = async (id: string | null | undefined): Promise<Timesheet | null> => {
    return this.loadItem(id);
  };

  convertToForm(item: Timesheet): TimesheetFormGroup {
    const newFg = TimesheetFormGroup.from(getTimesheetForm(new Date()));

    const controls = newFg.controls;

    if (item.id) controls.id.setValue(item.id);
    controls.date.setValue(new Date(item.date ?? ''));
    controls.finished.setValue(!!item.finished);
    controls.notes = new FormArray(
      // TODO to mapping method
      item?.timesheetNotes?.map((n) => {
        const noteFg = getTimesheetNoteFormGroup();

        if (n.id) noteFg.controls.id.setValue(n.id);
        if (n.timesheetId) noteFg.controls.timesheetId.setValue(n.timesheetId);
        if (n.comment) noteFg.controls.comment.setValue(n.comment);

        return noteFg;
      }) ?? []
    );
    controls.tasks = new FormArray(
      // TODO to mapping method
      item?.taskItems?.map((n) => {
        const taskItemFg = getTaskItemFormGroup();

        if (n.id) taskItemFg.controls.id.setValue(n.id);
        if (n.timesheetId) taskItemFg.controls.timesheetId.setValue(n.timesheetId);
        if (n.title) taskItemFg.controls.title.setValue(n.title);
        if (n.comment) taskItemFg.controls.comment.setValue(n.comment);
        if (n.time) {
          taskItemFg.controls.time.setValue(StringUtil.numberToTime(n.time as unknown as number));
        }
        if (n.rating) taskItemFg.controls.rating.setValue(n.rating);
        if (n.importance) taskItemFg.controls.importance.setValue(n.importance);

        return taskItemFg;
      }) ?? []
    );

    return newFg;
  }

  toEntity(fg: TimesheetFormGroup): Partial<Timesheet> {
    return TimesheetFormGroup.toEntity(fg);
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

  goToList = () => this.router.navigateByUrl(paths.timesheets);
  goToCreate = (date?: Date) =>
    this.router.navigate([paths.timesheetsCreate], {
      queryParams: { date: DateUtil.formatDateToUniversalFormat(date ?? new Date()) },
    });
  goToDetails = async (id: number, type: DetailsTypes) =>
    this.router.navigate([paths.timesheetsDetails], { queryParams: { id, type } });
}
