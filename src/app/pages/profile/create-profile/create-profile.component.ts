import { Component, OnInit } from '@angular/core';
import { ProfileFormGroup, getProfileForm } from 'src/app/components/profile';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { ToastService } from 'src/app/services';
import { ModalService } from 'src/app/services/modal.service';
import { ProfileService } from 'src/app/services/profile.service';
import { DetailsTypes, FormTypes } from 'src/app/utils';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
  form!: ProfileFormGroup;

  formType = FormTypes.Create;

  get types(): ProfileType[] {
    return this.service.types;
  }

  constructor(
    private service: ProfileService,
    private ts: ToastService,
    private modalService: ModalService
  ) {}

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
