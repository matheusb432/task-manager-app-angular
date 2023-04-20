import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileFormGroup, getProfileForm } from 'src/app/components/profile';
import { Profile } from 'src/app/models/entities';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { ToastService } from 'src/app/services';
import { ModalService } from 'src/app/services/modal.service';
import { ProfileService } from 'src/app/services/profile.service';
import { DetailsTypes, FormTypes, cancelData } from 'src/app/utils';

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
    console.log(getProfileForm());
    this.form = new FormGroup(getProfileForm());
  }

  async loadData(): Promise<void> {
    await this.service.loadCreateData();
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const item = this.form.value as Profile;

    const { id } = await this.service.insert(item);

    this.ts.success('Profile created successfully');
    this.service.goToDetails(id, DetailsTypes.View);
  }

  private onCancel(): Promise<boolean> {
    return this.service.goToList();
  }

  handleCancel() {
    this.openCancelModal();
  }

  openCancelModal(): void {
    const ref = this.modalService.confirmation(cancelData());

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.onCancel();
    });
  }
}
