import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconConfig } from 'src/app/models';
import { ElementIds, FormUtil, Icons } from 'src/app/util';
import { SignupFormGroup } from './signup-form-group';
import { ButtonComponent } from '../../custom/buttons/button/button.component';
import { InputComponent } from '../../custom/inputs/input/input.component';
import { FormLayoutComponent } from '../../layout/form-layout/form-layout.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormLayoutComponent, InputComponent, ButtonComponent],
})
export class SignupFormComponent {
  @Input() form!: SignupFormGroup;

  @Output() save = new EventEmitter<SignupFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  passwordVisible = false;
  visibilityIcon = IconConfig.withClick(
    'cPasswordVisibilityIcon',
    Icons.RemoveRedEye,
    () => this.togglePasswordVisibility(),
    'accent'
  );

  passwordHelpers = [
    'At least 10 characters',
    'At least 1 uppercase letter',
    'At least 1 lowercase letter',
    'At least 1 number',
  ];

  onSubmit(): void {
    FormUtil.onSubmit(this.form, this.save);
  }

  togglePasswordVisibility = (): void => {
    this.passwordVisible = !this.passwordVisible;
    this.visibilityIcon.color = this.passwordVisible ? 'primary' : 'accent';
  };
}
