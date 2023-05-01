import { Component, OnInit } from '@angular/core';
import { SignupFormGroup, getSignupForm } from 'src/app/components/authentication/signup-form';
import { AuthService, PageService, ToastService } from 'src/app/services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
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
    // TODO handle dynamic email/username setting
    const signup = SignupFormGroup.toEntity(form.value);

    const res = await this.service.signup(signup);

    console.log(res);
    this.ts.success('signup successful!');
    // TODO uncomment
    // this.pageService.goToHome();
  }
}
