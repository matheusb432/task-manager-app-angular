import { Component, OnInit } from '@angular/core';
import { LoginFormGroup, getLoginForm } from 'src/app/components/authentication/login-form';
import { AuthService, ToastService } from 'src/app/services';
import { StringUtil } from 'src/app/util';
import { LoginFormComponent } from '../../../components/authentication/login-form/login-form.component';
import { TitleComponent } from '../../../components/custom/title/title.component';
import { AuthPageLayoutComponent } from '../../../components/layout/auth-page-layout/auth-page-layout.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [AuthPageLayoutComponent, TitleComponent, LoginFormComponent],
})
export class LoginComponent implements OnInit {
  form!: LoginFormGroup;

  constructor(private service: AuthService, private ts: ToastService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = LoginFormGroup.from(getLoginForm());
  }

  async login(form: LoginFormGroup): Promise<void> {
    const login = StringUtil.isEmail(form.controls.userNameOrEmail.value)
      ? LoginFormGroup.toEntityWithEmail(form.controls)
      : LoginFormGroup.toEntityWithUserName(form.controls);

    await this.service.login(login);

    this.ts.success('Login successful!');
  }
}
