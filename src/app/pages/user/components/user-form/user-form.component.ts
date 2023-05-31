import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { ElementIds, FormTypes, FormUtil, deleteModalData, saveModalData } from 'src/app/util';
import { UserFormGroup } from './user-form-group';
import { NgIf, AsyncPipe } from '@angular/common';
import { ScrollToDirective } from '../../../../directives/scroll-to.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { InputComponent } from 'src/app/shared/components/inputs/input/input.component';
import { SelectComponent } from 'src/app/shared/components/inputs/select/select.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { UserService } from '../../services/user.service';
import { UserUtil } from '../../services/user.util';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormLayoutComponent,
    ScrollToDirective,
    InputComponent,
    SelectComponent,
    NgIf,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class UserFormComponent {
  @Input() form!: UserFormGroup;
  @Input() formType!: FormTypes;

  @Output() save = new EventEmitter<UserFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  subscriptions: Subscription[] = [];

  passwordVisible = false;
  visibilityIcon = UserUtil.getVisibilityIcon(() => this.togglePasswordVisibility());
  passwordHelpers = UserUtil.getPasswordHelpers();

  get submitLabel(): string {
    return FormUtil.getSubmitLabel(this.formType);
  }

  get canEdit(): boolean {
    return !FormUtil.isViewForm(this.formType);
  }

  get controls() {
    return this.form.controls;
  }

  constructor(private service: UserService, private modalService: ModalService) {}

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

  togglePasswordVisibility = (): void => {
    this.passwordVisible = !this.passwordVisible;
    this.visibilityIcon.color = this.passwordVisible ? 'primary' : 'accent';
  };
}
