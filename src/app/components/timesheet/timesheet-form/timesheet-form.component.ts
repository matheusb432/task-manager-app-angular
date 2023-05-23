import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppService, ModalService, TimesheetService } from 'src/app/services';
import { ElementIds, FormTypes, FormUtil, deleteModalData, saveModalData } from 'src/app/util';
import {
  TaskItemForm,
  TimesheetForm,
  TimesheetFormGroup,
  TimesheetNoteForm,
  getTaskItemFormGroup,
  getTimesheetNoteFormGroup,
} from './timesheet-form-group';

@Component({
  selector: 'app-timesheet-form',
  templateUrl: './timesheet-form.component.html',
  styleUrls: ['./timesheet-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetFormComponent {
  @Input() form!: TimesheetFormGroup;
  @Input() formType!: FormTypes;

  @Output() save = new EventEmitter<TimesheetFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  dateRangeOrDefault$ = this.app.dateRangeOrDefault$;
  dateFilterFn$ = this.service.dateFilterFn$;

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

  get controls(): TimesheetForm {
    return this.form.controls;
  }

  get noteForms() {
    return this.controls.notes;
  }

  get taskForms() {
    return this.controls.tasks;
  }

  get submitLabel(): string {
    return FormUtil.getSubmitLabel(this.formType);
  }

  get canEdit(): boolean {
    return !FormUtil.isViewForm(this.formType);
  }

  get canEditDate(): boolean {
    return (
      (this.canEdit && FormUtil.isDuplicateForm(this.formType)) ||
      FormUtil.isCreateForm(this.formType)
    );
  }

  constructor(
    private service: TimesheetService,
    private modalService: ModalService,
    private app: AppService
  ) {}

  addNote(): void {
    this.noteForms.push(getTimesheetNoteFormGroup());
  }

  removeNote(index: number): void {
    this.noteForms.removeAt(index);
  }

  addTask(): void {
    this.taskForms.push(getTaskItemFormGroup());
  }

  removeTask(index: number): void {
    this.taskForms.removeAt(index);
  }

  showDelete(): boolean {
    return FormUtil.isEditForm(this.formType);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  openDeleteModal(): void {
    this.modalService.confirmation(deleteModalData(), () => this.remove.emit());
  }

  openSaveModal(): void {
    this.modalService.confirmation(saveModalData(), () => FormUtil.onSubmit(this.form, this.save));
  }

  getFormItemId(
    index: number,
    item: FormGroup<TaskItemForm> | FormGroup<TimesheetNoteForm>
  ): number {
    return item.controls.id.value ?? index;
  }
}
