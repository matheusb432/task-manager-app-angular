import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateUtilsService, dateMaxValidator } from 'src/app/helpers';
import { Timesheet } from 'src/app/models';

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

export const getTimesheetForm = (defaultDate: Date) => {
  const tomorrow = DateUtilsService.addDays(new Date(), 1);

  return {
    date: new FormControl(defaultDate, {
      nonNullable: true,
      validators: [Validators.required, dateMaxValidator(tomorrow)],
    }),
    finished: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    // TODO add timesheet notes & task items form arrays
  };
};
