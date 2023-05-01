import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  LoginForm,
  LoginFormGroup,
  getLoginForm,
} from 'src/app/components/authentication/login-form';
import { us } from 'src/app/helpers';
import { AuthService, PageService, ToastService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form!: LoginFormGroup;

  constructor(
    private service: AuthService,
    private pageService: PageService,
    private ts: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = LoginFormGroup.from(getLoginForm());
  }

  async login(form: LoginFormGroup): Promise<void> {
    const login = us.isEmail(form.controls.userNameOrEmail.value)
      ? LoginFormGroup.toEntityWithEmail(form.controls)
      : LoginFormGroup.toEntityWithUserName(form.controls);

    await this.service.login(login);

    this.ts.success('Login successful!');
    // TODO move logic to route guard
    this.pageService.goToHome();
  }
}
