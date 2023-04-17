import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ToastData } from '../models/configs';
import { AlertTypes } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly posXDefault: MatSnackBarHorizontalPosition = 'end';
  private readonly posYDefault: MatSnackBarVerticalPosition = 'top';
  private readonly actionDefault = 'Close';
  private readonly durationDefault = 3500;

  constructor(private _snackBar: MatSnackBar) {}

  success(message: string): void {
    this.open({ message }, AlertTypes.Success);
  }

  error(message: string): void {
    this.open({ message }, AlertTypes.Error);
  }

  info(message: string): void {
    this.open({ message }, AlertTypes.Info);
  }

  warning(message: string): void {
    this.open({ message }, AlertTypes.Warning);
  }

  open({ message, action, positionX, positionY, duration }: ToastData, type: AlertTypes): void {
    const actionToUse = action === null ? undefined : action || this.actionDefault;
    const durationToUse = duration === 0 ? undefined : duration || this.durationDefault;
    const typeClass = ['toast', type];

    this._snackBar.open(message, actionToUse, {
      horizontalPosition: positionX || this.posXDefault,
      verticalPosition: positionY || this.posYDefault,
      duration: durationToUse,
      panelClass: typeClass,
    });
  }
}
