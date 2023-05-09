import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateUtil } from 'src/app/util';
import { Timesheet } from 'src/app/models';
import { dateMaxValidator } from 'src/app/helpers';

export class TimesheetFormGroup extends FormGroup<TimesheetForm> {
  static from(form: TimesheetForm): TimesheetFormGroup {
    return new TimesheetFormGroup(form);
  }

  static getFormKeys(): (keyof TimesheetForm)[] {
    return ['date', 'finished', 'notes'];
  }

  static toEntity = (value: Partial<TimesheetFormValue>): Partial<Timesheet> => {
    return {
      date: value.date?.toISOString(),
      finished: value.finished,
      timesheetNotes: value.notes?.map((n) => ({ comment: n.comment })) ?? [],
    };
  };
}

export interface TimesheetForm {
  date: FormControl<Date>;
  finished: FormControl<boolean>;
  notes: FormArray<FormGroup<TimesheetNoteForm>>;
  // Implement
  // taskItems: FormArray<FormGroup<TaskItemForm>>;
}

interface TimesheetFormValue {
  date: Date;
  finished: boolean;
  notes: Partial<TimesheetNoteFormValue>[];
}

interface TimesheetNoteFormValue {
  comment: string;
}

export interface TimesheetNoteForm {
  comment: FormControl<string>;
}

export const getTimesheetNoteFormGroup = (): FormGroup<TimesheetNoteForm> => {
  return new FormGroup(getTimesheetNoteForm());
};

export const getTimesheetNoteForm = (): TimesheetNoteForm => {
  return {
    comment: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  };
};

export interface TaskItemFormValue {
  title: string;
  time: string;
  rating: null | undefined;
  importance: number | null;
  notes: Partial<TaskItemNoteFormValue>[];
}

export interface TaskItemForm {
  title: FormControl<string>;
  time: FormControl<string>;
  rating: FormControl<null | undefined>;
  importance: FormControl<number | null>;
  notes: FormArray<FormGroup<TaskItemNoteForm>>;
}

export const getTaskItemFormGroup = (): FormGroup<TaskItemForm> => {
  return new FormGroup(getTaskItemForm());
};

export const getTaskItemForm = () => {
  return {
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    time: new FormControl('00:00', { nonNullable: true, validators: [Validators.required] }),
    rating: new FormControl(undefined, {
      validators: [Validators.required, Validators.min(0), Validators.max(5)],
    }),
    importance: new FormControl(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(3)],
    }),
    notes: new FormArray([getTaskItemNoteFormGroup()]),
  };
};

interface TaskItemNoteFormValue {
  comment: string;
}

export interface TaskItemNoteForm {
  comment: FormControl<string>;
}

export const getTaskItemNoteFormGroup = (): FormGroup<TaskItemNoteForm> => {
  return new FormGroup(getTaskItemNoteForm());
};

export const getTaskItemNoteForm = (): TaskItemNoteForm => {
  return {
    comment: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  };
};

export const getTimesheetForm = (today: Date): TimesheetForm => {
  const tomorrow = DateUtil.addDays(new Date(), 1);

  return {
    date: new FormControl(today, {
      nonNullable: true,
      validators: [Validators.required, dateMaxValidator(tomorrow)],
    }),
    finished: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    notes: new FormArray([getTimesheetNoteFormGroup()]),
    // TODO add task items form array
  };
};
