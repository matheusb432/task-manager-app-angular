import { AbstractControl, FormGroup } from "@angular/forms";
import { profileForm } from "src/app/helpers/validations";
import { Profile } from "src/app/models/entities";

export class ProfileFormGroup extends FormGroup {
  get name(): AbstractControl {
    return this.get('name')!;
  }

  get timeTarget(): AbstractControl {
    return this.get('timeTarget')!;
  }

  get tasksTarget(): AbstractControl {
    return this.get('tasksTarget')!;
  }

  get priority(): AbstractControl {
    return this.get('priority')!;
  }

  get profileTypeId(): AbstractControl {
    return this.get('profileTypeId')!;
  }

  static getFormKeys(): (keyof Profile & keyof ProfileFormGroup)[] {
    return ['name', 'timeTarget', 'tasksTarget', 'priority', 'profileTypeId'];
  }
}
