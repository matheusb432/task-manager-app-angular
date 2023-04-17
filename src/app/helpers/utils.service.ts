import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

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
}
