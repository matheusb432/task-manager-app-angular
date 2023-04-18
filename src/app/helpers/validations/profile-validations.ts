import { Validators } from '@angular/forms';
import { FormItem } from 'src/app/models/types';


export const profileForm: FormItem = {
  name: ['', [Validators.required, Validators.maxLength(250)]],
  timeTarget: ["00:00", [Validators.required]],
  tasksTarget: ['', [Validators.required, Validators.min(0)]],
  priority: '',
  profileTypeId: ['', [Validators.required, Validators.min(0)]],
};
