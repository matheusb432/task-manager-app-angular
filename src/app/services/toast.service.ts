import { Injectable, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, concatMap, filter, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastData } from 'src/app/models';
import { ToastComponent } from '../components/custom/toast/toast.component';
import { AlertTypes, PubSubUtil } from '../util';

type ToastFn = () => MatSnackBarRef<ToastComponent>;

@Injectable({
  providedIn: 'root',
})
export class ToastService implements OnDestroy {
  private readonly posXDefault: MatSnackBarHorizontalPosition = 'center';
  private readonly posYDefault: MatSnackBarVerticalPosition = 'top';
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
          const ref = toastFn();
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

  open({ message, positionX, positionY, duration }: ToastData, type: AlertTypes): void {
    const durationToUse = duration === 0 ? undefined : duration || this.durationDefault;
    const typeClass = ['toast', type];

    const openFn = () => {
      const ref = this._snackBar.openFromComponent(ToastComponent, {
        horizontalPosition: positionX || this.posXDefault,
        verticalPosition: positionY || this.posYDefault,
        duration: durationToUse,
        panelClass: typeClass,
        data: message,
      });

      return ref;
    };

    this.queueToast(openFn);
  }

  closeToast(): void {
    const snackInstance: MatSnackBarRef<ToastComponent> | null = this._snackBar._openedSnackBarRef;

    snackInstance?.dismiss();
  }

  private queueToast(openFn: ToastFn): void {
    this.addToastToQueue(openFn);
  }

  private addToastToQueue(openFn: ToastFn): void {
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
