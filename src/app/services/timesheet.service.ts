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
import { DateUtil, DetailsTypes, FormUtil, StringUtil, paths } from '../util';
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

  goToList = () => this.router.navigateByUrl(paths.timesheets);
  goToCreate = (date?: Date) =>
    this.router.navigate([paths.timesheetsCreate], {
      queryParams: { date: DateUtil.formatDateToUniversalFormat(date ?? new Date()) },
    });
  goToDetails = async (id: number, type: DetailsTypes) =>
    this.router.navigate([paths.timesheetsDetails], { queryParams: { id, type } });
}
