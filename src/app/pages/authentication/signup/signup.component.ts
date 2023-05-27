import { Component, OnInit } from '@angular/core';
import { SignupFormGroup, getSignupForm } from 'src/app/components/authentication/signup-form';
import { AuthService, ToastService } from 'src/app/services';
import { SignupFormComponent } from '../../../components/authentication/signup-form/signup-form.component';
import { TitleComponent } from '../../../components/custom/title/title.component';
import { AuthPageLayoutComponent } from '../../../components/layout/auth-page-layout/auth-page-layout.component';

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
