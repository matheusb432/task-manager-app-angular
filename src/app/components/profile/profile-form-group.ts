import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Profile } from 'src/app/models/entities';

export class ProfileFormGroup extends FormGroup<ProfileForm> {
  static getFormKeys(): (keyof Profile & keyof ProfileForm)[] {
    return ['name', 'timeTarget', 'tasksTarget', 'priority', 'profileTypeId'];
  }
}

export interface ProfileForm {
  name: FormControl<string>;
  timeTarget: FormControl<string>;
  tasksTarget: FormControl<number | undefined>;
  priority: FormControl<number | undefined>;
  profileTypeId: FormControl<number | undefined>;
}

export const profileForm: ProfileForm = {
  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(250)],
  }),
  timeTarget: new FormControl('00:00', { nonNullable: true, validators: [Validators.required] }),
  tasksTarget: new FormControl<number | undefined>(undefined, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  }),
  priority: new FormControl(),
  profileTypeId: new FormControl<number | undefined>(undefined, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  }),
};
