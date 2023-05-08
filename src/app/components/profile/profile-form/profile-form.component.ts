import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { ProfileService } from 'src/app/services/profile.service';
import {
  ElementIds,
  FormTypes,
  FormUtil,
  deleteModalData,
  saveModalData
} from 'src/app/util';
import { ProfileForm, ProfileFormGroup } from './profile-form-group';

@Component({
  selector: 'app-profile-form [form] [formType] [cancel]',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  @Input() form!: ProfileFormGroup;
  @Input() formType!: FormTypes;

  @Output() save = new EventEmitter<ProfileFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

  get controls(): ProfileForm {
    return this.form.controls;
  }

  get name(): AbstractControl {
    return this.controls.name;
  }

  get timeTarget(): AbstractControl {
    return this.controls.timeTarget;
  }

  get tasksTarget(): AbstractControl {
    return this.controls.tasksTarget;
  }

  get priority(): AbstractControl {
    return this.controls.priority;
  }

  get profileTypeId(): AbstractControl {
    return this.controls.profileTypeId;
  }

  get submitLabel(): string {
    return FormUtil.getSubmitLabel(this.formType);
  }

  get canEdit(): boolean {
    return !FormUtil.isViewForm(this.formType);
  }

  get typeOptions$() {
    return this.service.typeOptions$;
  }

  constructor(private service: ProfileService, private modalService: ModalService) {}

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
}
