import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Signup } from 'src/app/models';

export class SignupFormGroup extends FormGroup<SignupForm> {
  static from(form: SignupForm): SignupFormGroup {
    return new SignupFormGroup(form, { validators: passwordsAreEqual });
  }

  static getFormKeys(): (keyof SignupForm)[] {
    return ['userName', 'email', 'name', 'password'];
  }

  static toEntity(value: Partial<Signup>): Signup {
    return value as Signup;
  }
}

export interface SignupForm {
  userName: FormControl<string>;
  email: FormControl<string>;
  name: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

const passwordValidators: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(10),
  passwordStrengthValidator(),
];

export const getSignupForm = (): SignupForm => ({
  userName: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100), userNameValidator()],
  }),
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email, Validators.maxLength(100)],
  }),
  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100)],
  }),
  password: new FormControl('', {
    nonNullable: true,
    validators: passwordValidators,
  }),
  confirmPassword: new FormControl('', {
    nonNullable: true,
    validators: passwordValidators,
  }),
});

function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      return { passwordstrength: true };
    }
    return null;
  };
}

function passwordsAreEqual(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password?.value !== confirmPassword?.value) {
    return { confirmpassword: true };
  }
  return null;
}

function userNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value && !/^[a-zA-Z0-9_.]+$/.test(value)) {
      return { username: true };
    }
    return null;
  };
}
