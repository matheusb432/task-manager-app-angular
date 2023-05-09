import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  TimesheetForm,
  TimesheetFormGroup,
  getTimesheetForm,
} from 'src/app/components/timesheet/timesheet-form';
import { CanDeactivateForm } from 'src/app/models';
import { PageService, TimesheetService, ToastService } from 'src/app/services';
import { DateUtil, DetailsTypes, FormTypes } from 'src/app/util';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTimesheetComponent implements OnInit, CanDeactivateForm<TimesheetForm> {
  form!: TimesheetFormGroup;
  date?: Date;

  formType = FormTypes.Create;

  constructor(
    private service: TimesheetService,
    private pageService: PageService,
    private ts: ToastService
  ) {}

  ngOnInit(): void {
    this.initSubscriptions();
  }

  runInitMethods(): void {
    this.initUrlParams();
    this.initForm();
  }

  initSubscriptions(): void {
    this.pageService.getQueryParamsObservable().subscribe(() => {
      this.runInitMethods();
    });
  }

  initUrlParams(): void {
    const dateString = this.pageService.getParam('date');

    if (dateString) this.date = DateUtil.dateStringToDate(dateString);
  }

  initForm(): void {
    this.form = TimesheetFormGroup.from(getTimesheetForm(this.date ?? new Date()));
  }



  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const { id } = await this.service.insert(this.service.toEntity(this.form));

    this.service.goToDetails(id, DetailsTypes.View);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
