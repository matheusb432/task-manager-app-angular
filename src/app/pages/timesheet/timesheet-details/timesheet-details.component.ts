import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  TimesheetForm,
  TimesheetFormGroup,
  getTimesheetForm,
} from 'src/app/components/timesheet/timesheet-form';
import { CanDeactivateForm } from 'src/app/models';

@Component({
  selector: 'app-timesheet-details',
  templateUrl: './timesheet-details.component.html',
  styleUrls: ['./timesheet-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetDetailsComponent implements OnInit, CanDeactivateForm<TimesheetForm> {
  form!: TimesheetFormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = TimesheetFormGroup.from(getTimesheetForm(new Date()));
  }
}
