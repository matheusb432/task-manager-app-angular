import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconConfig } from 'src/app/models';
import { ElementIds, FormUtil, Icons } from 'src/app/util';
import { LoginFormGroup } from './login-form-group';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Input() form!: LoginFormGroup;

  @Output() save = new EventEmitter<LoginFormGroup>();

  elIds = ElementIds;

  passwordVisible = false;
  visibilityIcon = IconConfig.withClick(
    'cPasswordVisibilityIcon',
    Icons.RemoveRedEye,
    () => this.togglePasswordVisibility(),
    'accent'
  );

  onSubmit(): void {
    FormUtil.onSubmit(this.form, this.save);
  }

  togglePasswordVisibility = (): void => {
    this.passwordVisible = !this.passwordVisible;
    this.visibilityIcon.color = this.passwordVisible ? 'primary' : 'accent';
  };
}
