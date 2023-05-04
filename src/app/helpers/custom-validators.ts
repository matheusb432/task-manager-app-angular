import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateUtilsService } from './date-utils.service';

export function passwordsAreEqual(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password?.value !== confirmPassword?.value) {
    return { confirmpassword: true };
  }
  return null;
}

export function userNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value && !/^[a-zA-Z0-9_.]+$/.test(value)) {
      return { username: true };
    }
    return null;
  };
}

export function dateMaxValidator(dateMax: Date): ValidatorFn {
  return (
    control: AbstractControl<Date>
  ): { [key: string]: { datemax: Date; actual: Date } } | null => {
    const value = control.value;


    if (value && value.getTime() > dateMax.getTime()) {
      return {
        datemax: {
          datemax: dateMax,
          actual: value,
        },
      };
    }
    return null;
  };
}
