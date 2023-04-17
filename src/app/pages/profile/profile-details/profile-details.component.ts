import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProfileFormGroup } from 'src/app/components/profile';
import { us } from 'src/app/helpers';
import { profileForm } from 'src/app/helpers/validations';
import { PageConfig } from 'src/app/models/configs';
import { Profile } from 'src/app/models/entities';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { FormItem, PageData } from 'src/app/models/types';
import { PageService, ProfileService, ToastService } from 'src/app/services';

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

    // this.loadItem();
    this.loadData();
  }

  initUrlParams(): void {
    this.pageData = this.pageService.getDetailsUrlParams();
  }

  async loadData(): Promise<void> {
    const loadedItem = await this.service.loadEditData(this.pageData?.id);

    if (loadedItem == null) return;

    this.item = loadedItem;

    // TODO test
    this.service.convertToForm(this.form, this.item);
  }

  initForm(): void {
    this.form = this.pageService.buildForm(profileForm);
  }

  initPage(): void {
    const type = us.capitalize(this.pageData?.type);

    this.detailsPage = new PageConfig(`${type} Profile`);
  }

  submitForm(): Promise<void> {
    return this.editItem();
  }

  async editItem(): Promise<void> {
    const item = this.form.value;

    // TODO test update logic
    await this.service.update({ id: this.pageData?.id, ...item });

    this.ts.success('Profile updated successfully');
  }
}
