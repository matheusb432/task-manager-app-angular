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
import { ModalService } from 'src/app/services/modal.service';
import { DetailsTypes, FormTypes, cancelData } from 'src/app/utils';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  detailsPage!: PageConfig;
  item?: Profile;
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
    private pageService: PageService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.initSubscriptions();

    this.runInitMethods();
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

    this.item = loadedItem;

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
    const submitFns: { [key: string]: () => Promise<void> } = {
      [FormTypes.Edit]: () => this.editItem(),
      [FormTypes.Duplicate]: () => this.duplicateItem(),
    };

    return submitFns[this.formType]();
  }

  async editItem(): Promise<void> {
    const id = this.pageData?.id;
    const item = this.form.value as Profile;

    if (id == null) return;

    await this.service.update({ id: +id, ...item });

    this.ts.success('Profile updated successfully');
  }

  async duplicateItem(): Promise<void> {
    const id = this.pageData?.id;
    const item = this.form.value as Profile;

    if (id == null) return;

    const { id: createdId } = await this.service.duplicate(item);

    this.ts.success('Profile duplicated successfully');
    this.service.goToDetails(createdId, DetailsTypes.View);
  }

  async onRemove(): Promise<void> {
    const id = this.pageData?.id;

    if (id == null) return;

    await this.service.remove(+id);

    this.ts.success('Profile removed successfully');
    this.service.goToList();
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
  disableFormIfView(): void {
    if ((this.formType as unknown as DetailsTypes) !== DetailsTypes.View) return;

    this.form?.disable();
  }
}
