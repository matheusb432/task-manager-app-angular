import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTypes } from '../util';

@Injectable({
  providedIn: 'root',
})
export class FormUtil {
  static onSubmit<T extends FormGroup>(form: T, save: EventEmitter<T>) {
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
}
