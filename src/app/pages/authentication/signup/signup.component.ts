import { Component, OnInit } from '@angular/core';
import { SignupFormGroup, getSignupForm } from 'src/app/components/authentication/signup-form';
import { AuthService, PageService, ToastService } from 'src/app/services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  form!: SignupFormGroup;

  constructor(
    private service: AuthService,
    private pageService: PageService,
    private ts: ToastService
  ) {}

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
