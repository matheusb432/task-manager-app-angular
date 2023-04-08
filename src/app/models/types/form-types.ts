import { ValidatorFn } from '@angular/forms';

export type FormValue = string | number | boolean | null | undefined;

export type FormItem = { [key: string]: [FormValue, ValidatorFn[]] | FormValue };
