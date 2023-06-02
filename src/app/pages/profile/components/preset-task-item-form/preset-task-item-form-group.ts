import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValue, PresetTaskItem } from 'src/app/models';
import { StringUtil } from 'src/app/util';

export class PresetTaskItemFormGroup extends FormGroup<PresetTaskItemForm> {
  static from(form: PresetTaskItemForm): PresetTaskItemFormGroup {
    return new PresetTaskItemFormGroup(form);
  }

  static getFormKeys(): (keyof PresetTaskItemForm)[] {
    return ['title', 'comment', 'time', 'importance'];
  }

  static toJson = (fg: PresetTaskItemFormGroup): Partial<PresetTaskItem> => {
    const value = fg.getRawValue();

    return {
      ...value,
      time: StringUtil.timeToNumber(value.time ?? ''),
    } as Partial<PresetTaskItem>;
  };
}

export interface PresetTaskItemForm {
  id: FormControl<number | null>;
  title: FormControl<string | null>;
  comment: FormControl<string | null>;
  time: FormControl<string | null>;
  importance: FormControl<number | null>;
}

export type PresetTaskItemFormValue = FormValue<PresetTaskItemForm>;

export const getPresetTaskItemFormGroup = (): FormGroup<PresetTaskItemForm> => {
  return new FormGroup(getPresetTaskItemForm());
};

export const getPresetTaskItemForm = () => {
  return {
    id: new FormControl(0),
    title: new FormControl(''),
    comment: new FormControl(''),
    time: new FormControl('00:00'),
    importance: new FormControl(1, {
      validators: [Validators.min(1), Validators.max(3)],
    }),
  };
};
