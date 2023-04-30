import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Login } from 'src/app/models/dtos/auth';

export class LoginFormGroup extends FormGroup<LoginForm> {
  static from(form: LoginForm): LoginFormGroup {
    return new LoginFormGroup(form);
  }

  static getFormKeys(): (keyof LoginForm)[] {
    return ['userNameOrEmail', 'password'];
  }

  static toEntityWithUserName(controls: LoginForm): Login {
    return { password: controls.password.value, userName: controls.userNameOrEmail.value };
  }

  static toEntityWithEmail(controls: LoginForm): Login {
    return { password: controls.password.value, email: controls.userNameOrEmail.value };
  }
}

export interface LoginForm {
  userNameOrEmail: FormControl<string>;
  password: FormControl<string>;
}

export const getLoginForm = (): LoginForm => ({
  userNameOrEmail: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(250)],
  }),
  password: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, passwordValidator()],
  }),
});

function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value && value.length < 10) return { password: true };

    return null;
  };
}

// TODO implement passwordStrengthValidator
function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      return { passwordStrength: true };
    }
    return null;
  };
}
