import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';

import { CanDeactivateForm } from 'src/app/models';
import { AppService, PageService, ToastService } from 'src/app/services';
import { DateUtil, DetailsTypes, FormTypes, PubSubUtil, paths } from 'src/app/util';
import {
  TimesheetFormComponent,
  TimesheetForm,
  TimesheetFormGroup,
  getTimesheetForm,
} from '../components/timesheet-form';
import { TimesheetService } from '../services/timesheet.service';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TimesheetFormComponent],
})
export class CreateTimesheetComponent
  implements OnInit, OnDestroy, CanDeactivateForm<TimesheetForm>
{
  private destroyed$ = new Subject<boolean>();

  form!: TimesheetFormGroup;

  formType = FormTypes.Create;

  constructor(
    private service: TimesheetService,
    private app: AppService,
    private toaster: ToastService,
    private route: ActivatedRoute,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  async runInitMethods(): Promise<void> {
    await this.initUrlParams();
  }

  private initSubs(): void {
    this.pageService.getQueryParamsObservableForUrl(paths.timesheetsCreate).subscribe(() => {
      this.runInitMethods();
    });
    this.app.activeDate$
      .pipe(
        takeUntil(this.destroyed$),
        tap((date) => {
          this.initForm(date);
        })
      )
      .subscribe();
  }

  async initUrlParams(): Promise<void> {
    const dateString = this.pageService.getParam('date');

    if (!dateString) {
      this.pageService.addParams(this.route, {
        date: DateUtil.formatDateToUniversalFormat(new Date()),
      });
      return;
    }
    const existingItem = await this.service.loadItemByDate(DateUtil.dateStringToDate(dateString));

    if (existingItem?.id != null) {
      this.toaster.info(`Timesheet of date ${dateString} already exists! Redirecting...`);
      await this.service.goToDetails(existingItem.id, DetailsTypes.Edit);
      return;
    }

    this.app.setActiveDate(dateString);
  }

  initForm(date: Date): void {
    if (this.form == undefined) {
      this.form = TimesheetFormGroup.from(getTimesheetForm(date));
    } else {
      this.form.patchValue({ date });
    }
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
