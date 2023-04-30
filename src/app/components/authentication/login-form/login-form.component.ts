import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ElementIds } from 'src/app/utils';
import { LoginForm, LoginFormGroup } from './login-form-group';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Input() form!: LoginFormGroup;

  @Output() save = new EventEmitter<LoginFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  elIds = ElementIds;

  get controls(): LoginForm {
    return this.form.controls;
  }

  get userNameOrEmail(): AbstractControl {
    return this.controls.userNameOrEmail;
  }

  get password(): AbstractControl {
    return this.controls.password;
  }

  // TODO implement rememberMe fc?
  // get rememberMe(): AbstractControl {
  //   return this.controls.rememberMe;
  // }

  onSubmit(): void {
    this.save.emit(this.form);
  }
}
