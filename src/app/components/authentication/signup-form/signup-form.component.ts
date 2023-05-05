import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormUtilsService } from 'src/app/helpers';
import { IconConfig } from 'src/app/models';
import { ElementIds, Icons } from 'src/app/utils';
import { SignupForm, SignupFormGroup } from './signup-form-group';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent  {
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

  get controls(): SignupForm {
    return this.form.controls;
  }

  get userName(): AbstractControl {
    return this.controls.userName;
  }

  get password(): AbstractControl {
    return this.controls.password;
  }

  get confirmPassword(): AbstractControl {
    return this.controls.confirmPassword;
  }

  get name(): AbstractControl {
    return this.controls.name;
  }

  get email(): AbstractControl {
    return this.controls.email;
  }

  onSubmit(): void {
    FormUtilsService.onSubmit(this.form, this.save);
  }

  togglePasswordVisibility = (): void => {
    this.passwordVisible = !this.passwordVisible;
    this.visibilityIcon.color = this.passwordVisible ? 'primary' : 'accent';
  };
}
