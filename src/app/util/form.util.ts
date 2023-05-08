import { Injectable, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormTypes } from '../util';

@Injectable({
  providedIn: 'root',
})
export class FormUtil {
  static onSubmit<T extends FormGroup>(form: T, save: EventEmitter<T>): void {
    if (!form.valid) return form.markAllAsTouched();
    save.emit(form);
    form.markAsPristine();
  }

  static isCreateForm = (type: FormTypes) => type === FormTypes.Create;
  static isViewForm = (type: FormTypes) => type === FormTypes.View;
  static isEditForm = (type: FormTypes) => type === FormTypes.Edit;
  static isDuplicateForm = (type: FormTypes) => type === FormTypes.Duplicate;

  static getSubmitLabel = (type: FormTypes): string => {
    const submitLabels: { [key: string]: string } = {
      [FormTypes.Create]: 'Create',
      [FormTypes.Edit]: 'Update',
      [FormTypes.Duplicate]: 'Duplicate',
    };

    return submitLabels[type] || '';
  };

  static setFormFromItem<T>(fg: FormGroup, item: T, formKeys: (keyof T & string)[]): void {
    for (const key of formKeys) {
      const control = fg.get(key) as AbstractControl;

      if (control == null) continue;

      const value = item[key as keyof T];

      control.setValue(value == null ? '' : value);
    }
  }
}
