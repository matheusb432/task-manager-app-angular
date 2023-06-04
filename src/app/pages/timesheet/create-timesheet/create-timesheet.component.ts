import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription, filter, of, takeUntil, tap } from 'rxjs';

import { CanDeactivateForm, PresetTaskItem } from 'src/app/models';
import { AppService, PageService, ToastService } from 'src/app/services';
import { DateUtil, DetailsTypes, FormTypes, PubSubUtil, StringUtil, paths } from 'src/app/util';
import { ProfileService } from '../../profile/services/profile.service';
import {
  TimesheetForm,
  TimesheetFormComponent,
  TimesheetFormGroup,
  getTaskItemFormGroup,
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
  private service = inject(TimesheetService);
  private profileService = inject(ProfileService);
  private app = inject(AppService);
  private toaster = inject(ToastService);
  private route = inject(ActivatedRoute);
  private pageService = inject(PageService);

  private destroyed$ = new Subject<boolean>();

  form!: TimesheetFormGroup;

  formType = FormTypes.Create;

  tasksByDateSub: Subscription | null = null;

  private _tasksByDate$: Observable<PresetTaskItem[] | null> = of([]);
  get tasksByDate$(): Observable<PresetTaskItem[] | null> {
    return this._tasksByDate$;
  }
  set tasksByDate$(value: Observable<PresetTaskItem[] | null>) {
    this.tasksByDateSub?.unsubscribe();

    this._tasksByDate$ = value;
    this.tasksByDateSub = this._tasksByDate$
      .pipe(
        takeUntil(this.destroyed$),
        filter((tasks): tasks is PresetTaskItem[] => tasks != null),
        tap((tasks) => {
          this.addPresetTasksToForm(tasks);
        })
      )
      .subscribe();
  }

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
          const formattedDate = DateUtil.formatDateToUniversalFormat(date);
          this.initForm(date);
          this.tasksByDate$ = this.profileService.tasksByDate$(formattedDate);
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

  addPresetTasksToForm(tasks: PresetTaskItem[]): void {
    const tasksFormArray = this.form.controls.tasks;
    tasksFormArray.clear();

    tasks.forEach((task) => {
      const fg = getTaskItemFormGroup();
      fg.patchValue({ ...task, time: StringUtil.numberToTime(task.time) });
      tasksFormArray.push(fg);
    });
  }
}
