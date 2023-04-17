import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ProfileFormGroup } from '../profile-form-group';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { SelectOption } from 'src/app/models/configs';
import { ProfileTypeService } from 'src/app/services/profile-type.service';

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
    return this.form.get('name')!;
  }

  get timeTarget(): AbstractControl {
    return this.form.get('timeTarget')!;
  }

  get tasksTarget(): AbstractControl {
    return this.form.get('tasksTarget')!;
  }

  get priority(): AbstractControl {
    return this.form.get('priority')!;
  }

  get profileTypeId(): AbstractControl {
    return this.form.get('profileTypeId')!;
  }

  mockTypes: ProfileType[] = [
    { id: 1, name: 'Type 1' },
    { id: 2, name: 'Type 2' },
    {
      id: 3,
      name: 'Type 3',
      dateRangeStart: new Date(2023, 4, 5),
      dateRangeEnd: new Date(2023, 5, 5),
    },
    {
      id: 4,
      name: 'Type 4',
      dateRangeStart: new Date(2021, 4, 5),
      dateRangeEnd: new Date(2023, 4, 5),
    },
    {
      id: 5,
      name: 'Type 5',
      dateRangeStart: new Date(2023, 1, 5),
      dateRangeEnd: new Date(2023, 4, 25),
    },
  ];

  typeOptions: SelectOption[] = [];

  constructor() {
    this.typeOptions = ProfileTypeService.toOptions(this.mockTypes);
  }

  canRenderButtons = () => this.onDelete != null || this.onCancel != null || this.onSubmit != null;
}
