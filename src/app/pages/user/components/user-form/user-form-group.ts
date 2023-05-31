import { FormGroup } from '@angular/forms';
import { FormValue } from 'src/app/models';
import {
  SignupForm,
  SignupFormGroup,
  getSignupForm,
} from 'src/app/pages/authentication/components/signup-form';

export class UserFormGroup extends FormGroup<UserForm> {
  static from(form: UserForm): UserFormGroup {
    return new UserFormGroup(form);
  }

  static getFormKeys(): (keyof UserForm)[] {
    return ['signup'];
  }

  static toJson = (fg: UserFormGroup) => {
    return fg.getRawValue();
  };
}

export interface UserForm {
  signup: FormGroup<SignupForm>;
}

export type UserFormValue = FormValue<UserForm>;

export const getUserForm = (): UserForm => ({
  signup: SignupFormGroup.from(getSignupForm()),
});
