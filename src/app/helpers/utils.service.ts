import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormTypes } from '../utils';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  static formatDate = (date: Date): string => {
    const datePipe = new DatePipe('en-US');

    if (!date) return '';

    const formattedDate = datePipe.transform(date, 'dd/MM/yyyy');

    return formattedDate || '';
  };

  static capitalize = (word: string | undefined): string => {
    if (!word) return '';

    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  };

  static deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

  static timeToNumber = (timeHhMm: string): number => {
    const splitTime = timeHhMm?.split(':');
    if (splitTime?.length !== 2) return 0;

    const [hours, minutes] = splitTime;
    return Number(hours + minutes);
  };

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

  static unsub(subscriptions: Subscription[]): void {
    if (!subscriptions?.length) return;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
