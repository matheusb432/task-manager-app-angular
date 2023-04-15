import { Validators } from '@angular/forms';
import { FormItem } from 'src/app/models/types';


export const profileForm: FormItem = {
  name: ['', [Validators.required, Validators.maxLength(250)]],
  timeTarget: [0, [Validators.required, Validators.min(0)]],
  tasksTarget: [0, [Validators.required, Validators.min(0)]],
  priority: 0,
  profileTypeId: [0, [Validators.required, Validators.min(0)]],
};
