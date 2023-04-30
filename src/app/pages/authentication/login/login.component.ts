import { Component, OnInit } from '@angular/core';
import { LoginForm, LoginFormGroup, getLoginForm } from 'src/app/components/authentication/login-form';
import { AuthService, PageService, ToastService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: LoginFormGroup;

  constructor(private service: AuthService, private pageService: PageService, private ts: ToastService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = LoginFormGroup.from(getLoginForm());
  }

  async login(form: LoginFormGroup): Promise<void> {
    // TODO handle dynamic email/username setting
    const login = LoginFormGroup.toEntityWithUserName(form.controls);

    const res = await this.service.login(login);

    console.log(res);
    this.ts.success('Login successful!');
    // TODO uncomment
    // this.pageService.goToHome();

  }
}
