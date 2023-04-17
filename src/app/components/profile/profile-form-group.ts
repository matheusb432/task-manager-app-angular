import { AbstractControl, FormGroup } from "@angular/forms";
import { profileForm } from "src/app/helpers/validations";
import { Profile } from "src/app/models/entities";

export class ProfileFormGroup extends FormGroup {
  static getFormKeys(): (keyof Profile)[] {
    return ['name', 'timeTarget', 'tasksTarget', 'priority', 'profileTypeId'];
  }
}
