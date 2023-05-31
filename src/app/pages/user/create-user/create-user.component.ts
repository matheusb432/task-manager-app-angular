import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormTypes, DetailsTypes } from 'src/app/util';
import { UserForm, UserFormGroup, getUserForm } from '../components/user-form/user-form-group';
import { UserService } from '../services/user.service';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { CanDeactivateForm } from 'src/app/models';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent implements OnInit, CanDeactivateForm<UserForm> {
  form!: UserFormGroup;

  formType = FormTypes.Create;

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.initForm();

    this.loadData();
  }

  initForm(): void {
    this.form = UserFormGroup.from(getUserForm());
  }

  async loadData(): Promise<void> {
    await this.service.loadCreateData();
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const { id } = await this.service.insert(this.service.toJson(this.form));

    this.service.goToDetails(id, DetailsTypes.View);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
