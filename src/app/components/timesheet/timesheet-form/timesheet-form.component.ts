import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services';
import {
  DateUtil,
  ElementIds,
  FormTypes,
  FormUtil,
  deleteModalData,
  saveModalData,
} from 'src/app/util';
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

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

  tomorrow = DateUtil.addDays(new Date(), 1);

  get controls(): TimesheetForm {
    return this.form.controls;
  }

  get date() {
    return this.controls.date;
  }

  get finished() {
    return this.controls.finished;
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

  constructor(private modalService: ModalService) {}

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
