import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { dateMaxValidator } from 'src/app/helpers';
import { Timesheet } from 'src/app/models';
import { DateUtil } from 'src/app/util';

export class TimesheetFormGroup extends FormGroup<TimesheetForm> {
  static from(form: TimesheetForm): TimesheetFormGroup {
    return new TimesheetFormGroup(form);
  }

  static getFormKeys(): (keyof TimesheetForm)[] {
    return ['date', 'finished', 'notes'];
  }

  static toJson = (fg: TimesheetFormGroup): Partial<Timesheet> => {
    const value = fg.getRawValue();

    return {
      ...value,
      date: DateUtil.formatDateToUniversalFormat(value.date),
    } as Partial<Timesheet>;
  };
}

export interface TimesheetForm {
  id: FormControl<number | null>;
  date: FormControl<Date>;
  finished: FormControl<boolean>;
  notes: FormArray<FormGroup<TimesheetNoteForm>>;
  tasks: FormArray<FormGroup<TaskItemForm>>;
}

export interface TimesheetNoteForm {
  id: FormControl<number | null>;
  comment: FormControl<string>;
}

export const getTimesheetNoteFormGroup = (): FormGroup<TimesheetNoteForm> => {
  return new FormGroup(getTimesheetNoteForm());
};

export const getTimesheetNoteForm = (): TimesheetNoteForm => {
  return {
    id: new FormControl(0),
    comment: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  };
};

export interface TaskItemForm {
  id: FormControl<number | null>;
  title: FormControl<string>;
  comment: FormControl<string | null>;
  time: FormControl<string>;
  rating: FormControl<number | null>;
  importance: FormControl<number | null>;
}

export const getTaskItemFormGroup = (): FormGroup<TaskItemForm> => {
  return new FormGroup(getTaskItemForm());
};

export const getTaskItemForm = (): TaskItemForm => {
  return {
    id: new FormControl(0),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    comment: new FormControl(''),
    time: new FormControl('00:00', { nonNullable: true, validators: [Validators.required] }),
    rating: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(5)],
    }),
    importance: new FormControl(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(3)],
    }),
  };
};

export const getTimesheetForm = (initialDate: Date): TimesheetForm => {
  return {
    id: new FormControl(0),
    date: new FormControl(initialDate, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    finished: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    notes: new FormArray([getTimesheetNoteFormGroup()]),
    tasks: new FormArray([getTaskItemFormGroup()]),
  };
};
