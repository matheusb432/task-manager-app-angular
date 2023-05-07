import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService, TimesheetService } from 'src/app/services';
import {
  DateUtil,
  ElementIds,
  FormTypes,
  FormUtil,
  cancelModalData,
  deleteModalData,
  saveModalData,
} from 'src/app/util';
import { TimesheetForm, TimesheetFormGroup } from './timesheet-form-group';

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

  get date(): AbstractControl {
    return this.controls.date;
  }

  get finished(): AbstractControl {
    return this.controls.finished;
  }

  get submitLabel(): string {
    return FormUtil.getSubmitLabel(this.formType);
  }

  get canEdit(): boolean {
    return !FormUtil.isViewForm(this.formType);
  }

  constructor(private service: TimesheetService, private modalService: ModalService) {}

  showDelete(): boolean {
    return FormUtil.isEditForm(this.formType);
  }

  openCancelModal(): void {
    this.modalService.confirmation(cancelModalData(), () => this.cancel.emit());
  }

  openDeleteModal(): void {
    this.modalService.confirmation(deleteModalData(), () => this.remove.emit());
  }

  openSaveModal(): void {
    this.modalService.confirmation(saveModalData(), () => FormUtil.onSubmit(this.form, this.save));
  }
}
