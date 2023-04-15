import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ProfileFormGroup } from '../profile-form-group';

@Component({
  selector: 'app-profile-form [form] [onCancel]',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent {
  @Input() form!: ProfileFormGroup;

  @Input() onSubmit?: (e: any) => any;

  @Input() onCancel!: () => any;

  @Input() onDelete?: () => any;

  get name(): AbstractControl {
    return this.form.name;
  }

  get timeTarget(): AbstractControl {
    return this.form.timeTarget;
  }

  get tasksTarget(): AbstractControl {
    return this.form.tasksTarget;
  }

  get priority(): AbstractControl {
    return this.form.priority;
  }

  get profileTypeId(): AbstractControl {
    return this.form.profileTypeId;
  }

  canRenderButtons = () => this.onDelete != null || this.onCancel != null || this.onSubmit != null;
}
