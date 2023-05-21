import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import {
  ProfileForm,
  ProfileFormGroup,
  getProfileForm,
} from 'src/app/components/profile/profile-form';
import { CanDeactivateForm, PageData } from 'src/app/models';
import { PageService, ProfileService } from 'src/app/services';
import { DetailsTypes, FormTypes, PubSubUtil } from 'src/app/util';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy, CanDeactivateForm<ProfileForm> {
  private _form!: ProfileFormGroup;
  get form(): ProfileFormGroup {
    return this._form;
  }
  set form(value: ProfileFormGroup) {
    this._form = value;
    this.disableFormIfView();
  }
  get formType(): FormTypes {
    if (!this.pageData?.type) return FormTypes.Edit;

    return this.pageData?.type as unknown as FormTypes;
  }

  private _pageData?: PageData | undefined;
  get pageData(): PageData | undefined {
    return this._pageData;
  }
  set pageData(value: PageData | undefined) {
    this._pageData = value;
    this.disableFormIfView();
  }

  subscriptions: Subscription[] = [];

  constructor(private service: ProfileService, private pageService: PageService) {}

  ngOnInit(): void {
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    PubSubUtil.unsub(this.subscriptions);
  }

  runInitMethods(): void {
    this.initUrlParams();
    this.initForm();

    this.loadData();
  }

  private initSubscriptions(): void {
    this.subscriptions.push(
      this.pageService
        .getQueryParamsObservable()
        .pipe(
          tap(() => {
            this.disableFormIfView();
          })
        )
        .subscribe(() => {
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

    this.form = this.service.convertToForm(loadedItem);
  }

  initForm(): void {
    this.form = ProfileFormGroup.from(getProfileForm());
  }

  submitForm(): Promise<void> {
    const submitFns: { [key: string]: () => Promise<void> } = {
      [FormTypes.Edit]: () => this.editItem(),
      [FormTypes.Duplicate]: () => this.duplicateItem(),
    };

    return submitFns[this.formType]();
  }

  async editItem(): Promise<void> {
    await this.service.update(this.pageData?.id, this.service.toJson(this.form));
  }

  async duplicateItem(): Promise<void> {
    const { id: createdId } = await this.service.duplicate(this.service.toJson(this.form));

    this.service.goToDetails(createdId, DetailsTypes.View);
  }

  async onRemove(): Promise<void> {
    await this.service.deleteItem(this.pageData?.id);
    this.service.goToList();
  }

  onCancel(): Promise<boolean> {
    return this.service.goToList();
  }

  disableFormIfView(): void {
    if ((this.formType as unknown as DetailsTypes) !== DetailsTypes.View) return;

    this.form?.disable();
  }
}
