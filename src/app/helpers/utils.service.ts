import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormTypes } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  static formatDate = (date: Date): string => {
    const datePipe = new DatePipe('en-US');

    if (!date) return '';

    const formattedDate = datePipe.transform(date, 'dd/MM/yyyy');

    return formattedDate!;
  };

  static isCreateForm = (type: FormTypes) => type === FormTypes.Create;
  static isViewForm = (type: FormTypes) => type === FormTypes.View;
  static isEditForm = (type: FormTypes) => type === FormTypes.Edit;
  static isDuplicateForm = (type: FormTypes) => type === FormTypes.Duplicate;
}
