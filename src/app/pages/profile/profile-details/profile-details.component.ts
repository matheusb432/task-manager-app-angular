import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileFormGroup, getProfileForm } from 'src/app/components/profile';
import { us } from 'src/app/helpers';
import { PageConfig } from 'src/app/models/configs';
import { Profile } from 'src/app/models/entities';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { PageData } from 'src/app/models/types';
import { PageService, ProfileService, ToastService } from 'src/app/services';
import { FormTypes } from 'src/app/utils';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  detailsPage!: PageConfig;
  item?: Profile;
  form!: ProfileFormGroup;
  pageData?: PageData;
  formType = FormTypes.Edit;

  get types(): ProfileType[] {
    return this.service.types;
  }

  constructor(
    private service: ProfileService,
    private ts: ToastService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.initUrlParams();
    this.initPage();
    this.initForm();

    this.loadData();
  }

  initUrlParams(): void {
    this.pageData = this.pageService.getDetailsUrlParams();
  }

  async loadData(): Promise<void> {
    const loadedItem = await this.service.loadEditData(this.pageData?.id);

    if (loadedItem == null) {
      this.service.goToList();
      return;
    }

    this.item = loadedItem;

    // TODO test
    this.service.convertToForm(this.form, this.item);
  }

  initForm(): void {
    this.form = new FormGroup(getProfileForm());
  }

  initPage(): void {
    const type = this.pageData?.type;
    if (!type) return;

    this.formType = type as unknown as FormTypes;
    this.detailsPage = new PageConfig(`${us.capitalize(type)} Profile`);
  }

  submitForm(): Promise<void> {
    return this.editItem();
  }

  async editItem(): Promise<void> {
    const id = this.pageData?.id;
    const item = this.form.value as Profile;

    if (id == null) return;

    // TODO test update logic
    await this.service.update({ id: +id, ...item });

    this.ts.success('Profile updated successfully');
  }

  async onRemove(): Promise<void> {
    const id = this.pageData?.id;

    if (id == null) return;

    await this.service.remove(+id);

    // TODO test
    this.ts.success('Profile removed successfully');
    this.service.goToList();
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }
}
