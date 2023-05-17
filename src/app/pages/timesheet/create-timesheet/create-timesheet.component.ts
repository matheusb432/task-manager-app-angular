import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TimesheetForm,
  TimesheetFormGroup,
  getTimesheetForm,
} from 'src/app/components/timesheet/timesheet-form';
import { CanDeactivateForm } from 'src/app/models';
import { AppService, PageService, TimesheetService, ToastService } from 'src/app/services';
import { DateUtil, DetailsTypes, FormTypes, paths } from 'src/app/util';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTimesheetComponent implements OnInit, CanDeactivateForm<TimesheetForm> {
  form!: TimesheetFormGroup;

  formType = FormTypes.Create;

  constructor(
    private service: TimesheetService,
    private app: AppService,
    private ts: ToastService,
    private route: ActivatedRoute,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.initSubscriptions();
  }

  async runInitMethods(): Promise<void> {
    this.initForm();

    await this.initUrlParams();
    this.initForm();
  }

  initSubscriptions(): void {
    this.pageService.getQueryParamsObservableForUrl(paths.timesheetsCreate).subscribe(() => {
      this.runInitMethods();
    });
  }

  async initUrlParams(): Promise<void> {
    const dateString = this.pageService.getParam('date');

    if (!dateString) {
      this.pageService.addParams(this.route, {
        date: DateUtil.formatDateToUniversalFormat(new Date()),
      });
      return;
    }
    const existingItem = await this.service.loadItemByDate(DateUtil.dateStringToDate(dateString));

    if (existingItem?.id != null) {
      this.ts.info(`Timesheet of date ${dateString} already exists! Redirecting...`);
      await this.service.goToDetails(existingItem.id, DetailsTypes.Edit);
      return;
    }

    this.app.setActiveDate(dateString);
  }

  initForm(): void {
    const date = this.app.getActiveDate();
    this.form = TimesheetFormGroup.from(getTimesheetForm(date));
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const { id } = await this.service.insert(this.service.toJson(this.form));

    this.service.goToDetails(id, DetailsTypes.View);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
