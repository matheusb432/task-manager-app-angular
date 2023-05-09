import { takeUntil } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  TimesheetForm,
  TimesheetFormGroup,
  getTimesheetForm,
} from 'src/app/components/timesheet/timesheet-form';
import { CanDeactivateForm, PageConfig, PageData, WithDestroyed } from 'src/app/models';
import { DetailsTypes, FormTypes, StringUtil } from 'src/app/util';
import { PageService, TimesheetService } from 'src/app/services';

@Component({
  selector: 'app-timesheet-details',
  templateUrl: './timesheet-details.component.html',
  styleUrls: ['./timesheet-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetDetailsComponent
  extends WithDestroyed
  implements OnInit, CanDeactivateForm<TimesheetForm>
{
  detailsPage!: PageConfig;
  form!: TimesheetFormGroup;
  pageData?: PageData;
  formType = FormTypes.Edit;

  constructor(private service: TimesheetService, private pageService: PageService) {
    super();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  runInitMethods(): void {
    this.initUrlParams();
    this.initForm();
    this.initPage();
    this.disableFormIfView();

    this.loadData();
  }

  initSubscriptions(): void {
    this.pageService
      .getQueryParamsObservable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.runInitMethods();
      });
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
    this.form = TimesheetFormGroup.from(getTimesheetForm(new Date()));
  }

  initPage(): void {
    const type = this.pageData?.type;
    if (!type) return;

    this.formType = type as unknown as FormTypes;
    this.detailsPage = new PageConfig(`${StringUtil.capitalize(type)} Timesheet`);
  }

  submitForm(): Promise<void> {
    const submitFns: { [key: string]: () => Promise<void> } = {
      [FormTypes.Edit]: () => this.editItem(),
      [FormTypes.Duplicate]: () => this.duplicateItem(),
    };

    return submitFns[this.formType]();
  }

  async editItem(): Promise<void> {
    await this.service.update(this.pageData?.id, this.service.toEntity(this.form));
  }

  async duplicateItem(): Promise<void> {
    const { id: createdId } = await this.service.duplicate(this.service.toEntity(this.form));

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
