import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateUtil } from 'src/app/util';
import { Timesheet } from 'src/app/models';
import { dateMaxValidator } from 'src/app/helpers';

export class TimesheetFormGroup extends FormGroup<TimesheetForm> {
  static from(form: TimesheetForm): TimesheetFormGroup {
    return new TimesheetFormGroup(form);
  }

  static getFormKeys(): (keyof TimesheetForm)[] {
    return ['date', 'finished'];
  }

  static toEntity = (value: Partial<object>): Timesheet => value as Timesheet;
}

export interface TimesheetForm {
  date: FormControl<Date>;
  finished: FormControl<boolean>;
}

export const getTimesheetForm = (today: Date) => {
  const tomorrow = DateUtil.addDays(new Date(), 1);

  return {
    date: new FormControl(today, {
      nonNullable: true,
      validators: [Validators.required, dateMaxValidator(tomorrow)],
    }),
    finished: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    // TODO add timesheet notes & task items form arrays
  };
};
