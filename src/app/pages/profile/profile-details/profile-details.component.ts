import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProfileFormGroup, getProfileForm } from 'src/app/components/profile';
import { us } from 'src/app/helpers';
import { PageConfig } from 'src/app/models/configs';
import { Profile } from 'src/app/models/entities';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { PageData } from 'src/app/models/types';
import { PageService, ProfileService, ToastService } from 'src/app/services';
import { DetailsTypes, FormTypes } from 'src/app/utils';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  detailsPage!: PageConfig;
  form!: ProfileFormGroup;
  pageData?: PageData;
  formType = FormTypes.Edit;
  subscriptions: Subscription[] = [];

  get types(): ProfileType[] {
    return this.service.types;
  }

  constructor(
    private service: ProfileService,
    private ts: ToastService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  runInitMethods(): void {
    this.initUrlParams();
    this.initForm();
    this.initPage();
    this.disableFormIfView();

    this.loadData();
  }

  initSubscriptions(): void {
    this.subscriptions.push(
      this.pageService.getQueryParamsObservable().subscribe(() => {
        this.runInitMethods();
      })
    );
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

    this.service.convertToForm(this.form, loadedItem);
  }

  initForm(): void {
    this.form = ProfileFormGroup.from(getProfileForm());
  }

  initPage(): void {
    const type = this.pageData?.type;
    if (!type) return;

    this.formType = type as unknown as FormTypes;
    this.detailsPage = new PageConfig(`${us.capitalize(type)} Profile`);
  }

  submitForm(): Promise<void> {
    const submitFns: { [key: string]: () => Promise<void> } = {
      [FormTypes.Edit]: () => this.editItem(),
      [FormTypes.Duplicate]: () => this.duplicateItem(),
    };

    return submitFns[this.formType]();
  }

  async editItem(): Promise<void> {
    await this.service.update(this.pageData?.id, this.form);
    this.ts.success('Profile updated successfully');
  }

  async duplicateItem(): Promise<void> {
    const { id: createdId } = await this.service.duplicate(this.form);

    this.ts.success('Profile duplicated successfully');
    this.service.goToDetails(createdId, DetailsTypes.View);
  }

  async onRemove(): Promise<void> {
    this.service.deleteItem(this.pageData?.id);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }

  disableFormIfView(): void {
    if ((this.formType as unknown as DetailsTypes) !== DetailsTypes.View) return;

    this.form?.disable();
  }
}
