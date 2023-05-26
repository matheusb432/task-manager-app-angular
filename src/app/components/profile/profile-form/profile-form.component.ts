import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ElementIds, FormTypes, FormUtil, deleteModalData, saveModalData } from 'src/app/util';
import { ProfileFormGroup } from './profile-form-group';
import { ButtonComponent } from '../../custom/buttons/button/button.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { SelectComponent } from '../../custom/inputs/select/select.component';
import { InputComponent } from '../../custom/inputs/input/input.component';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';
import { FormLayoutComponent } from '../../layout/form-layout/form-layout.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-profile-form [form] [formType] [cancel]',
    templateUrl: './profile-form.component.html',
    styleUrls: ['./profile-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, FormLayoutComponent, ScrollToDirective, InputComponent, SelectComponent, NgIf, ButtonComponent, AsyncPipe]
})
export class ProfileFormComponent {
  @Input() form!: ProfileFormGroup;
  @Input() formType!: FormTypes;

  @Output() save = new EventEmitter<ProfileFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

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
