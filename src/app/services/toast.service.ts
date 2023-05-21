import { Injectable, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
  SimpleSnackBar,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, concatMap, filter, takeUntil } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToastData } from 'src/app/models';
import { AlertTypes, PubSubUtil } from '../util';

type ToastFn<T extends SimpleSnackBar = TextOnlySnackBar> = (prefix?: string) => MatSnackBarRef<T>;

@Injectable({
  providedIn: 'root',
})
export class ToastService implements OnDestroy {
  private readonly posXDefault: MatSnackBarHorizontalPosition = 'center';
  private readonly posYDefault: MatSnackBarVerticalPosition = 'top';
  private readonly actionDefault = 'Close';
  private readonly durationDefault = 4000;

  private _toastQueue$ = new BehaviorSubject<ToastFn | void>(undefined);
  private _toastCount$ = new BehaviorSubject<number>(0);
  private destroyed$ = new Subject<boolean>();

  get toastCount$() {
    return this._toastCount$.asObservable();
  }

  constructor(private _snackBar: MatSnackBar) {
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private initSubs(): void {
    this._toastQueue$
      .pipe(
        takeUntil(this.destroyed$),
        filter((toastQueue): toastQueue is ToastFn => {
          const isValidToast = toastQueue != null;
          if (isValidToast) this.incrementCount();

          return isValidToast;
        }),
        concatMap((toastQueue) => {
          const toastFn = toastQueue;
          const count = this._toastCount$.getValue();
          // TODO how to live update the toast message?
          const prefix = count > 1 ? `(${count})` : undefined;

          const ref = toastFn(prefix);
          return ref.afterDismissed().pipe(finalize(() => this.decrementCount()));
        })
      )
      .subscribe();
  }

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

    // TODO toast queue?
    // this._snackBar.open(message, actionToUse, {
    //   horizontalPosition: positionX || this.posXDefault,
    //   verticalPosition: positionY || this.posYDefault,
    //   duration: durationToUse,
    //   panelClass: typeClass,
    // });
    const openFn = (prefix?: string) => {
      const displayMessage = prefix ? `${prefix}: ${message}` : message;

      return this._snackBar.open(displayMessage, actionToUse, {
        horizontalPosition: positionX || this.posXDefault,
        verticalPosition: positionY || this.posYDefault,
        duration: durationToUse,
        panelClass: typeClass,
      });
    };

    this.queueToast(openFn);
  }

  private queueToast<T extends TextOnlySnackBar>(openFn: ToastFn<T>): void {
    this.addToastToQueue(openFn);
  }

  private addToastToQueue<T extends TextOnlySnackBar>(openFn: ToastFn<T>): void {
    this._toastQueue$.next(openFn);
  }

  private incrementCount() {
    const val = this._toastCount$.getValue();
    this._toastCount$.next(val + 1);
  }

  private decrementCount() {
    const val = this._toastCount$.getValue();
    this._toastCount$.next(val - 1);
  }
}
