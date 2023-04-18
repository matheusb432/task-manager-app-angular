import { FormGroup } from "@angular/forms";
import { Profile } from "src/app/models/entities";

export class ProfileFormGroup extends FormGroup {
  static getFormKeys(): (keyof Profile)[] {
    return ['name', 'timeTarget', 'tasksTarget', 'priority', 'profileTypeId'];
  }
}
