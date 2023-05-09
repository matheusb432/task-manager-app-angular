import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Mapper } from 'mapper-ts/lib-esm';
import { FormValue, Profile } from 'src/app/models';
import { TimePipe } from 'src/app/pipes/time.pipe';

export class ProfileFormGroup extends FormGroup<ProfileForm> {
  static from(form: ProfileForm): ProfileFormGroup {
    return new ProfileFormGroup(form);
  }

  static getFormKeys(): (keyof Profile & keyof ProfileForm)[] {
    return ['name', 'timeTarget', 'tasksTarget', 'priority', 'profileTypeId'];
  }

  static toEntity = (fg: ProfileFormGroup): Profile => {
    const value = fg.getRawValue();
    return new Mapper(Profile).map({
      ...value,
      timeTarget: TimePipe.formatTimeHhMm(value.timeTarget),
    }) as Profile;
  };
}

export interface ProfileForm {
  name: FormControl<string>;
  timeTarget: FormControl<string>;
  tasksTarget: FormControl<number | undefined>;
  priority: FormControl<number | undefined>;
  profileTypeId: FormControl<number | undefined>;
}

export const getProfileForm = (): ProfileForm => ({
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
});
