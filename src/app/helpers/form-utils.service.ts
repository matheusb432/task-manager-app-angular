import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  static onSubmit<T extends FormGroup>(form: T, save: EventEmitter<T>) {
    if (!form.valid) return form.markAllAsTouched();
    save.emit(form);
  }
}
