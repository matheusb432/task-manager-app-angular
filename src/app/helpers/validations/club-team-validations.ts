import { Validators } from '@angular/forms';
import { FormItem } from 'src/app/models/types';

export const teamForm: FormItem = {
  name: ['', [Validators.required, Validators.maxLength(50)]],
  description: ['', [Validators.required, Validators.maxLength(200)]],
  badge: '',
  primary: ['#000000', [Validators.required, Validators.maxLength(10)]],
  secondary: ['#000000', [Validators.required, Validators.maxLength(10)]],
};
