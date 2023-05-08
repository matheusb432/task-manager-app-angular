import { Component, OnInit } from '@angular/core';
import {
  ProfileForm,
  ProfileFormGroup,
  getProfileForm,
} from 'src/app/components/profile/profile-form';
import { CanDeactivateForm } from 'src/app/models';
import { ToastService } from 'src/app/services';
import { ProfileService } from 'src/app/services/profile.service';
import { DetailsTypes, FormTypes } from 'src/app/util';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit, CanDeactivateForm<ProfileForm> {
  form!: ProfileFormGroup;

  formType = FormTypes.Create;

  constructor(private service: ProfileService, private ts: ToastService) {}

  ngOnInit(): void {
    this.initForm();

    this.loadData();
  }

  initForm(): void {
    this.form = ProfileFormGroup.from(getProfileForm());
  }

  async loadData(): Promise<void> {
    await this.service.loadCreateData();
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const { id } = await this.service.insert(this.form);

    this.ts.success('Profile created successfully');
    this.service.goToDetails(id, DetailsTypes.View);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
