import { Component, OnInit } from '@angular/core';
import { AuthService, ToastService } from 'src/app/services';
import { SignupFormComponent } from '../components';
import { SignupFormGroup, getSignupForm } from '../components/signup-form';
import { AuthPageLayoutComponent } from 'src/app/shared/components/layouts/auth-page-layout/auth-page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [AuthPageLayoutComponent, TitleComponent, SignupFormComponent],
})
export class SignupComponent implements OnInit {
  form!: SignupFormGroup;

  constructor(private service: AuthService, private ts: ToastService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = SignupFormGroup.from(getSignupForm());
  }

  async signup(form: SignupFormGroup): Promise<void> {
    const signup = SignupFormGroup.toJson(form);

    await this.service.signup(signup);

    this.ts.success('Sign up successful!');
  }
}
