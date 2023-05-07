import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  TimesheetForm,
  TimesheetFormGroup,
  getTimesheetForm,
} from 'src/app/components/timesheet/timesheet-form';
import { CanDeactivateForm } from 'src/app/models';
import { TimesheetService, ToastService } from 'src/app/services';
import { DetailsTypes, FormTypes } from 'src/app/util';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTimesheetComponent implements OnInit, CanDeactivateForm<TimesheetForm> {
  form!: TimesheetFormGroup;

  formType = FormTypes.Create;

  constructor(private service: TimesheetService, private ts: ToastService) {}

  ngOnInit(): void {
    this.initForm();

    this.loadData();
  }

  initForm(): void {
    this.form = TimesheetFormGroup.from(getTimesheetForm(new Date()));
  }

  async loadData(): Promise<void> {
    await this.service.loadCreateData();
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const { id } = await this.service.insert(this.form);

    this.ts.success('Timesheet created successfully');
    this.service.goToDetails(id, DetailsTypes.View);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
